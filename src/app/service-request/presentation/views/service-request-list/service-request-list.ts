import {
  Component,
  effect,
  inject,
  OnInit,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef
} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';
import { ServiceRequestStore } from '../../../application/service-request-store';
import { ServiceRequest } from '../../../domain/model/service-request.entity';
import { ServiceRequestsApi } from '../../../infrastructure/service-request-api';
import { TranslatePipe } from '@ngx-translate/core';
import { FeedbackApiService } from '../../../../feedback/infrastructure/feedback-api.service';
import { MatInput } from '@angular/material/input';
import {IamApi} from '../../../../iam/infrastructure/iam-api';
import {TechniciansService} from '../../../../technician/infrastructure/technicians.service';

@Component({
  selector: 'app-service-request-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatSortModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    TranslatePipe,
    MatInput,
  ],
  templateUrl: './service-request-list.html',
  styleUrl: './service-request-list.css'
})
export class ServiceRequestListComponent implements OnInit, AfterViewInit {

  private readonly router = inject(Router);
  private readonly store = inject(ServiceRequestStore);
  private readonly iamApi = inject(IamApi);
  private readonly techniciansService = inject(TechniciansService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly reviewsApi = inject(FeedbackApiService);
  private readonly api = inject(ServiceRequestsApi);
  private readonly cdr = inject(ChangeDetectorRef);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  readonly loading = this.store.loading;
  readonly error = this.store.error;

  dataSource = new MatTableDataSource<ServiceRequest>([]);

  selectedStatus = '';
  selectedType = '';

  readonly statusOptions = ['', 'pending', 'accepted', 'inProgress', 'completed', 'canceled', 'rejected'];
  readonly typeOptions = ['', 'corrective', 'preventive'];

  displayedColumns = [
    'orderNumber',
    'equipmentName',
    'siteName',
    'provider',
    'technician',
    'status',
    'completedAt',
    'actions'
  ];

  reviewDialogOpen = false;
  reviewReadOnly = false;
  selectedRequest: ServiceRequest | null = null;
  providersMap: Record<number, string> = {};
  techniciansMap: Record<number, string> = {};

  reviewForm = {
    rating: 0,
    comment: ''
  };

  constructor() {
    effect(() => {
      const requests = this.store.serviceRequests();
      if (!requests) return;
      this.applyFilters();
    });
  }

  ngOnInit(): void {

    this.iamApi.getAllUsers().subscribe(users => {
      this.providersMap = users.reduce((acc: any, user: any) => {
        acc[user.id] = user.username;
        return acc;
      }, {});
    });

    this.store.loadAll().subscribe(async () => {

      const requests = this.store.serviceRequests() ?? [];

      for (const request of requests) {

        if ((request as any).technicianId) {

          try {

            const technician: any = await firstValueFrom(
              this.techniciansService.getTechnicianById(
                (request as any).technicianId
              )
            );

            this.techniciansMap[(request as any).technicianId] =
              technician.name ||
              technician.fullName ||
              technician.firstName ||
              `Technician ${(request as any).technicianId}`;

          } catch (err) {

            console.error(
              `Could not load technician ${(request as any).technicianId}`,
              err
            );
          }
        }
      }

      this.applyFilters();
    });
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  navigateToDetail(request: ServiceRequest): void {
    this.router.navigate(['/services', request.id]);
  }

  navigateToNew(): void {
    this.router.navigate(['/services/new']);
  }

  applyFilters(): void {
    let list: ServiceRequest[] = this.store.serviceRequests() ?? [];
    console.log('REQUESTS:', list);
    console.log('TECHNICIANS MAP:', this.techniciansMap);
    list = [...list];

    if (this.selectedStatus) {
      list = list.filter(r => r.status === this.selectedStatus);
    }

    if (this.selectedType) {
      list = list.filter(r => (r as any).type === this.selectedType);
    }
    list = list.map((req, index) => ({
      ...req,
      orderNumber: index + 1
    }));

    this.dataSource.data = list;
    this.cdr.detectChanges();
  }

  statusClass(status: string): string {
    return {
      pending: 'chip-pending',
      accepted: 'chip-accepted',
      inProgress: 'chip-in-progress',
      completed: 'chip-completed',
      canceled: 'chip-canceled',
      rejected: 'chip-rejected'
    }[status] ?? '';
  }

  formatDate(request: any): string {
    const date = request?.completedAt ?? request?.canceledAt ?? null;
    if (!date) return '-';
    const d = new Date(date);
    return isNaN(d.getTime()) ? '-' : d.toLocaleDateString();
  }

  async cancelRequest(request: ServiceRequest): Promise<void> {
    try {
      await firstValueFrom(this.api.sendCancelRequestCommand(request.id));
      this.snackBar.open('Request cancelled', 'Close', { duration: 3000 });
      await firstValueFrom(this.store.loadAll());
    } catch (err) {
      console.error(err);
      this.snackBar.open('Error cancelling request', 'Close', { duration: 3000 });
    }
  }

  openReview(request: ServiceRequest): void {
    this.selectedRequest = request;
    this.reviewForm = { rating: 0, comment: '' };
    this.reviewReadOnly = false;
    this.reviewDialogOpen = true;
  }

  async viewReview(request: ServiceRequest): Promise<void> {
    this.selectedRequest = request;
    this.reviewReadOnly = true;
    this.reviewForm = { rating: 0, comment: '' };

    try {
      const review: any = await firstValueFrom(
        this.reviewsApi.getReviewById((request as any).reviewId)
      );

      this.reviewForm = {
        rating: review.rating,
        comment: review.comment
      };
    } catch (err) {
      console.error('Failed to load review:', err);
    }

    this.reviewDialogOpen = true;
  }

  async submitReview(): Promise<void> {
    if (!this.selectedRequest || this.reviewForm.rating === 0) return;

    const payload = {
      serviceRequestId: this.selectedRequest?.id,
      technicianId: (this.selectedRequest as any)?.technicianId,
      rating: this.reviewForm.rating,
      comment: this.reviewForm.comment,
      createdAt: new Date().toISOString()
    };
    try {
      await firstValueFrom(
        this.reviewsApi.createReview(payload)
      );

      this.snackBar.open('Review submitted', 'Close', { duration: 3000 });

      this.reviewDialogOpen = false;
      this.selectedRequest = null;

      await firstValueFrom(this.store.loadAll());

    } catch (err) {
      console.error(err);
      this.snackBar.open('Error submitting review', 'Close', { duration: 3000 });
    }
  }
}

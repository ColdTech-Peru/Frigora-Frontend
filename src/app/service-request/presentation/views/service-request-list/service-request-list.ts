import {
  Component,
  effect,
  inject,
  OnInit,
  ViewChild,
  AfterViewInit
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

import { ServiceRequestStore } from '../../../application/service-request-store';
import { ServiceRequest } from '../../../domain/model/service-request.entity';
import { TranslatePipe } from '@ngx-translate/core';

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
    TranslatePipe
  ],
  templateUrl: './service-request-list.html',
  styleUrl: './service-request-list.css'
})
export class ServiceRequestListComponent implements OnInit, AfterViewInit {

  private readonly router = inject(Router);
  private readonly store = inject(ServiceRequestStore);
  private readonly snackBar = inject(MatSnackBar);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  readonly loading = this.store.loading;
  readonly error = this.store.error;

  readonly displayedColumns = [
    'orderNumber',
    'createdAt',
    'equipmentName',
    'siteName',
    'status',
    'actions'
  ];

  dataSource = new MatTableDataSource<ServiceRequest>([]);

  selectedStatus = '';
  selectedType = '';

  readonly statusOptions = [
    '',
    'pending',
    'accepted',
    'inProgress',
    'completed',
    'canceled',
    'rejected'
  ];

  readonly typeOptions = [
    '',
    'corrective',
    'preventive'
  ];

  constructor() {
    effect(() => {
      const requests = this.store.serviceRequests();
      if (!requests) return;

      this.applyFilters();
    });
  }

  ngOnInit(): void {
    this.store.loadAll();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private safeDate(date: any): number {
    if (!date) return 0;

    const parsed = new Date(date);
    return isNaN(parsed.getTime()) ? 0 : parsed.getTime();
  }

  applyFilters(): void {
    let list: ServiceRequest[] = this.store.serviceRequests() ?? [];

    list = [...list];

    list.sort(
      (a, b) =>
        this.safeDate(b.createdAt) -
        this.safeDate(a.createdAt)
    );

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

    if (this.paginator) {
      this.paginator.firstPage();
    }
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

  formatDate(date: any): string {
    if (!date) return '-';

    const parsed = new Date(date);

    if (isNaN(parsed.getTime())) {
      return '-';
    }

    return parsed.toLocaleDateString();
  }

  navigateToDetail(request: ServiceRequest): void {
    this.router.navigate(['/services', request.id]);
  }

  navigateToNew(): void {
    this.router.navigate(['/services/new']);
  }
}

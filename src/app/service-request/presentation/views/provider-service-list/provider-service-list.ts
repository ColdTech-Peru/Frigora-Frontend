import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';

import { MatCardModule } from '@angular/material/card';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { ServiceRequestsApi } from '../../../infrastructure/service-request-api';
import { IamApi } from '../../../../iam/infrastructure/iam-api';
import { AssetsManagementApi } from '../../../../assets-management/infrastructure/assets-management-api';
import { AuthStoreService } from '../../../../iam/application/iam.store';
import { MonitoringApiService } from '../../../../monitoring/infrastructure/monitoring-api.service';
import { ServiceRequestAssembler } from '../../../infrastructure/service-request-assembler';
import {MatTooltip} from '@angular/material/tooltip';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-provider-service-list',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatPaginatorModule,
    MatSortModule,
    MatTooltip
  ],
  templateUrl: './provider-service-list.html',
  styleUrl: './provider-service-list.css'
})
export class ProviderServiceListComponent implements OnInit {
  loading = false;
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['orderNumber', 'requesterName', 'siteName', 'equipmentName', 'status', 'actions'];

  filters = { status: '', clientName: '' };
  statusOptions = ['', 'pending', 'accepted', 'inProgress', 'completed', 'canceled', 'rejected'];

  private serviceRequestApi = inject(ServiceRequestsApi);
  private iamApi = inject(IamApi);
  private assetsApi = inject(AssetsManagementApi);
  private monitoringApi = inject(MonitoringApiService);
  private authStore = inject(AuthStoreService);
  public translate = inject(TranslateService);
  private router = inject(Router);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    const providerId = this.authStore.currentUserId || '14qTsdO';
    this.loading = true;

    forkJoin({
      requests: this.serviceRequestApi.getRequestsForProviderQuery(providerId as any),
      users: this.iamApi.getAllUsers(),
    }).subscribe({
      next: (res: any) => {
        const requests = res.requests ?? [];

        if (!requests.length) {
          this.dataSource.data = [];
          this.loading = false;
          return;
        }

        // ── ownerIds únicos de los requests ──
        const ownerIds = [...new Set(requests.map((r: any) => r.requesterId))] as number[];

        forkJoin({
          sites: forkJoin(ownerIds.map(id => this.assetsApi.getSitesByOwner(id))).pipe(
            map((results: any[]) => results.flat())
          ),
          equipments: forkJoin(ownerIds.map(id => this.monitoringApi.getEquipmentsByOwner(id))).pipe(
            map((results: any[]) => results.flat())
          ),
        }).subscribe({
          next: (ownerData: any) => {
            const assembler = new ServiceRequestAssembler();
            const context = {
              users: res.users,
              sites: ownerData.sites,
              equipments: ownerData.equipments
            };

            const data = assembler.toEntitiesFromResponse(
              { serviceRequests: requests }, context
            );

            this.dataSource.data = data.map((req, index) => ({ ...req, orderNumber: index + 1 }));
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.loading = false;
          },
          error: (err) => {
            console.error(err);
            this.loading = false;
          }
        });
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const f = JSON.parse(filter);
      const matchesStatus = !f.status || data.status === f.status;
      const matchesName = !f.clientName || data.requesterName?.toLowerCase().includes(f.clientName.toLowerCase());
      return matchesStatus && matchesName;
    };
    this.dataSource.filter = JSON.stringify(this.filters);
  }

  navigateToDetail(request: any): void {
    this.router.navigateByUrl(`/provider/services/${request.id}`);
  }

  statusSeverity(status: string): string {
    const map: Record<string, string> = {
      pending: 'danger',
      accepted: 'warning',
      inProgress: 'info',
      completed: 'success',
      canceled: 'secondary',
      rejected: 'secondary'
    };
    return map[status] || 'secondary';
  }

  deleteRequest(request: any): void {

    const confirmed = confirm(
      'Are you sure you want to delete this service request?'
    );

    if (!confirmed) return;

    this.serviceRequestApi.deleteServiceRequest(request.id)
      .subscribe({
        next: () => {
          this.fetchData();
        },
        error: (err) => {
          console.error(err);
        }
      });
  }
}

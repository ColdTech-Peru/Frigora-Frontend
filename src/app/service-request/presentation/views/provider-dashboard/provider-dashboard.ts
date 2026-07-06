import {Component, OnInit, inject, ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AssetsManagementApi } from '../../../../assets-management/infrastructure/assets-management-api';
import { TechniciansService } from '../../../../technician/infrastructure/technicians.service';
import { ServiceRequestsApi } from '../../../infrastructure/service-request-api';
import { AuthStoreService } from '../../../../iam/application/iam.store';
import { MonitoringApiService } from '../../../../monitoring/infrastructure/monitoring-api.service';
import { ServiceRequestAssembler } from '../../../infrastructure/service-request-assembler';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-provider-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatTooltipModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    TranslatePipe
  ],
  templateUrl: './provider-dashboard.html',
  styleUrls: ['./provider-dashboard.css']
})
export class ProviderDashboardComponent implements OnInit {

  loading = false;
  error: string | null = null;

  pendingRequests: any[] = [];

  kpis = {
    pending: 0,
    active: 0,
    technicians: 0,
  };

  displayedColumns: string[] = [
    'id',
    'description',
    'siteName',
    'equipmentName',
    'priority',
    'actions'
  ];

  private router = inject(Router);
  private authStore = inject(AuthStoreService);
  private serviceRequestApi = inject(ServiceRequestsApi);
  private techniciansApi = inject(TechniciansService);
  private assetsManagementApi = inject(AssetsManagementApi);
  private monitoringApi = inject(MonitoringApiService);
  private cdr = inject(ChangeDetectorRef);

  get currentProviderId(): string {
    return <string>this.authStore.currentUserId ?? '14qTsdO';
  }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    const providerId = this.currentProviderId;
    if (!providerId) return;

    this.loading = true;
    this.error = null;
    this.cdr.markForCheck();

    forkJoin({
      requests: this.serviceRequestApi.getRequestsForProviderQuery(providerId),
      techs: this.techniciansApi.getTechniciansByProvider(providerId),
    }).subscribe({
      next: (res: any) => {
        const allRequests = res.requests?.data ?? res.requests ?? [];

        if (allRequests.length === 0) {
          this.pendingRequests = [];
          this.kpis = { pending: 0, active: 0, technicians: res.techs?.length ?? 0 };
          this.loading = false;
          this.cdr.markForCheck();
          return;
        }

        const ownerId = allRequests[0].requesterId;
        forkJoin({
          sites: this.assetsManagementApi.getSitesByOwner(ownerId),
          equipments: this.monitoringApi.getEquipmentsByOwner(ownerId),
        }).subscribe({
          next: (ownerData: any) => {
            const context = {
              sites: ownerData.sites ?? [],
              equipments: ownerData.equipments ?? []
            };

            const assembler = new ServiceRequestAssembler();
            const mapped = allRequests.map((r: any) =>
              assembler.toEntityFromResource(r, context)
            );

            this.pendingRequests = mapped.filter(
              (r: any) => (r.status ?? '').toLowerCase() === 'pending'
            );

            this.kpis.pending = this.pendingRequests.length;
            this.kpis.active = mapped.filter((r: any) =>
              ['accepted', 'inprogress', 'inProgress'].includes(r.status)
            ).length;
            this.kpis.technicians = res.techs?.length ?? 0;
            this.loading = false;
            this.cdr.markForCheck();
          },
          error: (e) => {
            this.error = 'Failed to load owner data.';
            this.loading = false;
            this.cdr.markForCheck();
          }
        });
      },
      error: (e) => {
        this.error = 'Failed to load dashboard data.';
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  handleAccept(requestId: number | string): void {
    this.serviceRequestApi.sendAcceptRequestCommand(requestId)
      .subscribe(() => this.fetchData());
  }

  handleReject(requestId: number | string): void {
    this.serviceRequestApi.sendRejectRequestCommand(requestId)
      .subscribe(() => this.fetchData());
  }

  navigateToList(): void {
    this.router.navigate(['/provider/services']);
  }
}

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';

// Angular Material Imports
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

// Ajusta las rutas a tus verdaderos servicios en Angular


@Component({
  selector: 'app-provider-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatTooltipModule,
    MatChipsModule,
    MatProgressSpinnerModule
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

  displayedColumns: string[] = ['id', 'description', 'siteName', 'equipmentName', 'priority', 'actions'];

  // Inyección de dependencias
  private router = inject(Router);
  public translate = inject(TranslateService);
  private authStore = inject(AuthStoreService);
  private serviceRequestApi = inject(ServiceRequestsApi);
  private techniciansApi = inject(TechniciansService);
  private assetsManagementApi = inject(AssetsManagementApi);
  private monitoringApi = inject(MonitoringApiService);

  get currentProviderId(): string {
    // Retorna el ID forzado para probar la vista directamente
    // Cambia esto a this.authStore.currentUser?.id cuando restaures el login
    return '14qTsdO';
  }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    const providerId = this.currentProviderId;
    if (!providerId) return;

    this.loading = true;
    this.error = null;

    forkJoin({
      requests: this.serviceRequestApi.getRequestsForProviderQuery(providerId),
      techs: this.techniciansApi.getTechniciansByProvider(providerId),
      sites: this.assetsManagementApi.getSites(),
      equipments: this.monitoringApi.getEquipments()
    }).subscribe({
      next: (res) => {
        const allRequests = res.requests; // Ajusta si tu API devuelve res.requests.data
        const context = { sites: res.sites, equipments: res.equipments };

        const assembler = new ServiceRequestAssembler();

        this.pendingRequests = allRequests
          .filter((r: any) => r.status === 'pending')
          .map((r: any) => assembler.toEntityFromResource(r, context));

        this.kpis.pending = this.pendingRequests.length;
        this.kpis.active = allRequests.filter((r: any) => ['accepted', 'inProgress'].includes(r.status)).length;
        this.kpis.technicians = res.techs.length;

        this.loading = false;
      },
      error: (e) => {
        this.error = 'Failed to load dashboard data.';
        console.error(e);
        this.loading = false;
      }
    });
  }

  handleAccept(requestId: number | string): void {
    this.serviceRequestApi.sendAcceptRequestCommand(requestId).subscribe(() => {
      this.fetchData();
    });
  }

  handleReject(requestId: number | string): void {
    this.serviceRequestApi.sendRejectRequestCommand(requestId).subscribe(() => {
      this.fetchData();
    });
  }

  navigateToList(): void {
    this.router.navigate(['/provider/services']);
  }
}

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ServiceRequest } from '../../../domain/model/service-request.entity';
import { ServiceRequestsApi } from '../../../infrastructure/service-request-api';
import { AssetsManagementApi } from '../../../../assets-management/infrastructure/assets-management-api';
import { AuthStoreService } from '../../../../iam/application/iam.store';
import { TechniciansService } from '../../../../technician/infrastructure/technicians.service';
import { ServiceRequestAssembler } from '../../../infrastructure/service-request-assembler';

// Servicios y APIs (Ajusta las rutas a tu proyecto)


@Component({
  selector: 'app-provider-completed-services',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatCardModule,
    MatTableModule,
    MatProgressSpinnerModule,
    DatePipe
  ],
  templateUrl: './complete-service.html',
  styleUrl: './complete-service.css'
})
export class ProviderCompletedServicesComponent implements OnInit {
  loading = false;
  error: string | null = null;
  completedRequests: ServiceRequest[] = [];
  displayedColumns: string[] = ['id', 'description', 'siteName', 'technicianName', 'completedAt'];

  private serviceRequestApi = inject(ServiceRequestsApi);
  private techniciansApi = inject(TechniciansService);
  private assetsManagementApi = inject(AssetsManagementApi);
  private authStore = inject(AuthStoreService);
  public translate = inject(TranslateService);

  get currentProviderId(): string | number | null {
    // Mantenemos el ID que configuramos para pruebas
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
      // Traemos las peticiones del proveedor, los técnicos y los sitios (para los nombres en la tabla)
      requests: this.serviceRequestApi.getRequestsForProviderQuery(providerId as any),
      techs: this.techniciansApi.getTechniciansByProvider(providerId as any),
      sites: this.assetsManagementApi.getSites()
    }).subscribe({
      next: (res) => {
        const allRequests = res.requests;
        const context = { technicians: res.techs, sites: res.sites };
        const assembler = new ServiceRequestAssembler();

        // Filtramos solo los completados y los ensamblamos
        this.completedRequests = allRequests
          .filter((r: any) => r.status === 'completed')
          .map((r: any) => assembler.toEntityFromResource(r, context));

        this.loading = false;
      },
      error: (e) => {
        this.error = 'Failed to load completed services.';
        console.error(e);
        this.loading = false;
      }
    });
  }
}

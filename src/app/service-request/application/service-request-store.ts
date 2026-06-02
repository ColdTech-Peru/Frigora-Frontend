import { inject, Injectable, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ServiceRequest } from '../domain/model/service-request.entity';
import { ServiceRequestsApi } from '../infrastructure/service-request-api';
import { MonitoringApiService } from '../../monitoring/infrastructure/monitoring-api.service';
import { AssetsManagementApi } from '../../assets-management/infrastructure/assets-management-api';
import { AuthStoreService } from '../../iam/application/iam.store';

@Injectable({ providedIn: 'root' })
export class ServiceRequestStore {

  private readonly serviceRequestsApi = inject(ServiceRequestsApi);
  private readonly monitoringApi = inject(MonitoringApiService);
  private readonly assetsManagementApi = inject(AssetsManagementApi);
  private readonly authStore = inject(AuthStoreService);

  private readonly serviceRequestsSignal = signal<ServiceRequest[]>([]);
  readonly serviceRequests = this.serviceRequestsSignal.asReadonly();

  private readonly equipmentsSignal = signal<{ id: any; name: string }[]>([]);
  readonly equipments = this.equipmentsSignal.asReadonly();

  private readonly sitesSignal = signal<{ id: any; name: string }[]>([]);
  readonly sites = this.sitesSignal.asReadonly();

  private readonly loadingSignal = signal<boolean>(false);
  readonly loading = this.loadingSignal.asReadonly();

  private readonly errorSignal = signal<string | null>(null);
  readonly error = this.errorSignal.asReadonly();

  loadAll(): void {
    const role = this.authStore.currentUserRole;
    const userId = this.authStore.currentUserId;

    if (!userId) {
      this.errorSignal.set('No user ID found');
      return;
    }

    const requests$ = role === 'Provider'
      ? this.serviceRequestsApi.getRequestsForProviderQuery(userId)
      : this.serviceRequestsApi.getRequestsByRequesterQuery(userId);

    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    forkJoin({
      requests: requests$,
      equipments: this.monitoringApi.getEquipments(),
      sites: this.assetsManagementApi.getSites(),
    }).subscribe({

      next: ({ requests, equipments, sites }: any) => {
        this.equipmentsSignal.set(
          equipments.map((e: any) => ({ id: e.id, name: e.name }))
        );
        this.sitesSignal.set(
          sites.map((s: any) => ({ id: s.id, name: s.name }))
        );

        const enriched = requests.map((req: ServiceRequest) => {
          const equipment = equipments.find(
            (e: any) => String(e.id) === String(req.equipmentId)
          );
          const site = sites.find(
            (s: any) => String(s.id) === String((req as any).siteId)
          );
          return Object.assign(
            Object.create(Object.getPrototypeOf(req)),
            req,
            {
              equipmentName: equipment?.name ?? req.equipmentId ?? 'N/A',
              siteName: site?.name ?? (req as any).siteId ?? 'N/A',
            }
          );
        });

        this.serviceRequestsSignal.set(enriched);
        this.loadingSignal.set(false);
      },

      error: err => {
        console.error('Error detallado:', err);
        this.errorSignal.set(this.formatError(err, 'Failed to load service requests'));
        this.loadingSignal.set(false);
      }
    });
  }

  createRequest(data: Partial<ServiceRequest>): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.serviceRequestsApi.sendNewRequestCommand(data).subscribe({
      next: () => this.loadAll(),
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to create service request'));
        this.loadingSignal.set(false);
      }
    });
  }

  private formatError(error: any, fallback: string): string {
    if (error instanceof Error) {
      return error.message.includes('Resource not found')
        ? `${fallback}: Not found`
        : error.message;
    }
    return fallback;
  }
}

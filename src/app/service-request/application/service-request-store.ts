import { inject, Injectable, signal } from '@angular/core';
import { forkJoin, retry } from 'rxjs';
import { ServiceRequest } from '../domain/model/service-request.entity';
import { ServiceRequestsApi } from '../infrastructure/service-request-api';
import { MonitoringApiService } from '../../monitoring/infrastructure/monitoring-api.service';
import { AssetsManagementApi } from '../../assets-management/infrastructure/assets-management-api';

/**
 * State management store for service requests using Angular signals.
 * Enriches service requests with equipment and site names from external bounded contexts.
 * Encapsulates cross-boundary dependencies, keeping components unaware of external APIs.
 * @author Alejandro Galindo
 */
@Injectable({ providedIn: 'root' })
export class ServiceRequestStore {

  private readonly serviceRequestsApi = inject(ServiceRequestsApi);

  /**
   * @description MonitoringApiService is injected here to encapsulate
   * the cross-boundary dependency with the Monitoring context.
   */
  private readonly monitoringApi = inject(MonitoringApiService);

  /**
   * @description AssetsManagementApi is injected here to encapsulate
   * the cross-boundary dependency with the Assets Management context.
   */
  private readonly assetsManagementApi = inject(AssetsManagementApi);

  private readonly serviceRequestsSignal = signal<ServiceRequest[]>([]);
  readonly serviceRequests = this.serviceRequestsSignal.asReadonly();

  /**
   * @description Holds the list of available equipments loaded from MonitoringApi.
   * Exposed as readonly so components can access it without injecting MonitoringApi directly.
   */
  private readonly equipmentsSignal = signal<{ id: any; name: string }[]>([]);
  readonly equipments = this.equipmentsSignal.asReadonly();

  /**
   * @description Holds the list of available sites loaded from AssetsManagementApi.
   * Exposed as readonly so components can access it without injecting AssetsManagementApi directly.
   */
  private readonly sitesSignal = signal<{ id: any; name: string }[]>([]);
  readonly sites = this.sitesSignal.asReadonly();

  private readonly loadingSignal = signal<boolean>(false);
  readonly loading = this.loadingSignal.asReadonly();

  private readonly errorSignal = signal<string | null>(null);
  readonly error = this.errorSignal.asReadonly();

  /**
   * Loads all service requests, equipments, and sites in parallel.
   * Enriches service requests with equipment and site names.
   * Uses String() comparison to safely match ids regardless of their type.
   * Also stores equipments and sites for external use by components.
   */
  loadAll(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    forkJoin({
      requests: this.serviceRequestsApi.getAllServiceRequestsQuery(),
      equipments: this.monitoringApi.getEquipments(),
      sites: this.assetsManagementApi.getSites(),
    }).pipe(retry(2)).subscribe({

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
        this.errorSignal.set(this.formatError(err, 'Failed to load service requests'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Creates a new service request and reloads the list on success.
   * @param data - The new service request payload.
   */
  createRequest(data: Partial<ServiceRequest>): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.serviceRequestsApi.sendNewRequestCommand(data).subscribe({
      next: () => {
        this.loadAll();
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to create service request'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Formats error messages for user-friendly display.
   * @param error - The error object.
   * @param fallback - The fallback error message.
   * @returns A formatted error message.
   */
  private formatError(error: any, fallback: string): string {
    if (error instanceof Error) {
      return error.message.includes('Resource not found')
        ? `${fallback}: Not found`
        : error.message;
    }
    return fallback;
  }
}

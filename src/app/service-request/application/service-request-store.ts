import { inject, Injectable, signal } from '@angular/core';
import {forkJoin, Observable, map, tap, switchMap, of} from 'rxjs';
import { ServiceRequest } from '../domain/model/service-request.entity';
import { ServiceRequestsApi } from '../infrastructure/service-request-api';
import { MonitoringApiService } from '../../monitoring/infrastructure/monitoring-api.service';
import { AssetsManagementApi } from '../../assets-management/infrastructure/assets-management-api';
import { AuthStoreService } from '../../iam/application/iam.store';
import { FeedbackApiService } from '../../feedback/infrastructure/feedback-api.service';

@Injectable({ providedIn: 'root' })
export class ServiceRequestStore {

  private readonly serviceRequestsApi = inject(ServiceRequestsApi);
  private readonly monitoringApi = inject(MonitoringApiService);
  private readonly assetsManagementApi = inject(AssetsManagementApi);
  private readonly authStore = inject(AuthStoreService);
  private readonly reviewsApi = inject(FeedbackApiService);

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

  loadAll(): Observable<void> {
    const userId = this.authStore.currentUserId;
    const role = this.authStore.currentUserRole;

    if (!userId) {
      this.errorSignal.set('No user ID found');
      throw new Error('No user ID found');
    }

    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    const requests$ =
      role === 'Provider'
        ? this.serviceRequestsApi.getRequestsForProviderQuery(userId)
        : this.serviceRequestsApi.getRequestsByRequesterQuery(userId);

    return requests$.pipe(
      switchMap((requests: any) => {
        if (!requests?.length) {
          this.serviceRequestsSignal.set([]);
          this.loadingSignal.set(false);
          return of(void 0);
        }

        const ownerIds = [...new Set(requests.map((r: any) => r.requesterId))] as number[];

        return forkJoin({
          equipments: forkJoin(
            ownerIds.map(id => this.monitoringApi.getEquipmentsByOwner(id))
          ).pipe(map((results: any[]) => results.flat())),
          sites: forkJoin(
            ownerIds.map(id => this.assetsManagementApi.getSitesByOwner(id))
          ).pipe(map((results: any[]) => results.flat())),
          reviews: this.reviewsApi.getAllReviews(),
        }).pipe(
          tap(({ equipments, sites, reviews }: any) => {
            this.equipmentsSignal.set(
              equipments.map((e: any) => ({ id: e.id, name: e.name }))
            );
            this.sitesSignal.set(
              sites.map((s: any) => ({ id: s.id, name: s.name }))
            );

            const enriched = requests.map((req: any) => {
              const equipment = equipments.find(
                (e: any) => String(e.id) === String(req.equipmentId)
              );
              const site = sites.find(
                (s: any) => String(s.id) === String(req.siteId)
              );
              const serviceReview = reviews.find(
                (r: any) => String(r.serviceRequestId) === String(req.id)
              );

              return {
                ...req,
                equipmentName: equipment?.name ?? 'N/A',
                siteName: site?.name ?? 'N/A',
                hasReview: !!serviceReview,
                reviewId: serviceReview?.id ?? null
              };
            });

            this.serviceRequestsSignal.set(enriched);
            this.loadingSignal.set(false);
          }),
          map(() => void 0)
        );
      })
    );
  }
  createRequest(data: Partial<ServiceRequest>): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    const requesterId = this.authStore.currentUserId;

    if (!requesterId) {
      this.errorSignal.set('User not authenticated');
      this.loadingSignal.set(false);
      return;
    }

    const payload = {
      ...data,
      requesterId: requesterId
    };

    this.serviceRequestsApi.sendNewRequestCommand(payload).subscribe({
      next: () => {
        this.loadAll().subscribe();
      },
      error: err => {
        console.error(err);
        this.errorSignal.set('Failed to create service request');
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

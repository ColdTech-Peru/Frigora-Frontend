import { computed, Injectable, signal, DestroyRef, inject } from '@angular/core';
import { DashboardSnapshot } from '../domain/model/dashboard-snapshot.entity';
import { AlertView } from '../domain/model/alert-view.entity';
import { MonitoringApiService } from '../../monitoring/infrastructure/monitoring-api.service';
import { ServiceRequestsApi } from '../../service-request/infrastructure/service-request-api';
import { AuthStoreService } from '../../iam/application/iam.store';
import { forkJoin } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DashboardStore {
  private readonly destroyRef = inject(DestroyRef);
  private readonly monitoringApi = inject(MonitoringApiService);
  private readonly serviceRequestsApi = inject(ServiceRequestsApi);
  private readonly authStore = inject(AuthStoreService);

  private readonly snapshotSignal = signal<DashboardSnapshot | null>(null);
  private readonly alertsSignal = signal<AlertView[]>([]);
  private readonly loadingSignal = signal<boolean>(false);
  private readonly errorSignal = signal<string | null>(null);

  readonly snapshot = this.snapshotSignal.asReadonly();
  readonly alerts = this.alertsSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  readonly temperatureChart = computed(() => this.snapshot()?.temperatureChartData);
  readonly avgTemperature = computed(() => this.snapshot()?.avgTemperature ?? 0);

  loadFullDashboard(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    forkJoin({
      equipments: this.monitoringApi.getEquipments(),
      alerts: this.monitoringApi.getAlerts(),
      serviceRequests: this.serviceRequestsApi.getRequestsByRequesterQuery(this.authStore.currentUserId!),
      readings: this.monitoringApi.getReadings()
    })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loadingSignal.set(false))
      )
      .subscribe({
        next: ({ equipments, alerts, serviceRequests, readings }) => {
          console.log('readings[0]:', readings[0]);
          console.log('serviceRequests:', serviceRequests);
          const snapshot = new DashboardSnapshot({
            kpis: {
              totalEquipments: equipments.length,
              openAlerts: alerts.filter((a: any) => a.status?.toLowerCase() === 'active').length,
              activeRequests: serviceRequests.length
            },
            trends: {
              temperature: {
                labels: readings.map((r: any) => r.timestamp ?? r.createdAt),
                avg: readings.map((r: any) => r.temperature ?? r.value)
              }
            }
          });
          this.snapshotSignal.set(snapshot);

          const alertInstances = alerts.map((a: any) => new AlertView({
            id: a.id,
            createdAt: a.createdAt,
            equipmentId: a.equipmentId,
            siteId: a.siteId,
            severity: a.severity,
            status: a.status,
            equipmentName: a.equipmentName,
            siteName: a.siteName
          }));
          this.alertsSignal.set(alertInstances);
        },
        error: (err) => {
          console.error('Error loading dashboard', err);
          this.errorSignal.set('Failed to load dashboard data');
        }
      });
  }

  clearStore(): void {
    this.snapshotSignal.set(null);
    this.alertsSignal.set([]);
    this.errorSignal.set(null);
  }
}

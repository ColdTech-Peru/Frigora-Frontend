import { computed, Injectable, signal, DestroyRef, inject } from '@angular/core';
import { DashboardSnapshot } from '../domain/model/dashboard-snapshot.entity';
import { AlertView } from '../domain/model/alert-view.entity';
import { DashboardApi } from '../infrastructure/dashboard-api';
import { AuthStoreService } from '../../iam/application/iam.store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DashboardStore {
  private readonly destroyRef = inject(DestroyRef);
  private readonly dashboardApi = inject(DashboardApi);
  private readonly authStore = inject(AuthStoreService);

  private readonly snapshotSignal = signal<DashboardSnapshot | null>(null);
  private readonly alertsSignal = signal<AlertView[]>([]);
  private readonly loadingSnapshotSignal = signal<boolean>(false);
  private readonly loadingAlertsSignal = signal<boolean>(false);
  private readonly errorSignal = signal<string | null>(null);

  readonly snapshot = this.snapshotSignal.asReadonly();
  readonly alerts = this.alertsSignal.asReadonly();
  readonly loading = computed(() => this.loadingSnapshotSignal() || this.loadingAlertsSignal());
  readonly error = this.errorSignal.asReadonly();

  readonly kpis = computed(() => this.snapshot()?.kpis ?? {});
  readonly temperatureChart = computed(() => this.snapshot()?.temperatureChartData);
  readonly avgTemperature = computed(() => this.snapshot()?.avgTemperature ?? 0);

  readonly criticalAlerts = computed(() =>
    this.alerts().filter(alert => alert.severity.toLowerCase() === 'critical')
  );
  readonly criticalAlertsCount = computed(() => this.criticalAlerts().length);

  loadSnapshot(): void {
    const userId = this.authStore.currentUserId;
    if (!userId) return;

    this.loadingSnapshotSignal.set(true);
    this.errorSignal.set(null);

    this.dashboardApi.getDashboardConfigByUser(userId)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loadingSnapshotSignal.set(false))
      )
      .subscribe({
        next: (data) => {
          if (data) {
            this.snapshotSignal.set(new DashboardSnapshot(data));
          } else {
            this.snapshotSignal.set(null);
          }
        },
        error: (err) => {
          console.error('Error loading snapshot', err);
          this.errorSignal.set('Failed to load dashboard snapshot');
        }
      });
  }

  loadAlerts(): void {
    const tenantId = this.authStore.currentTenantId;

    this.loadingAlertsSignal.set(true);
    this.errorSignal.set(null);

    this.dashboardApi.getAlerts(tenantId ?? undefined)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loadingAlertsSignal.set(false))
      )
      .subscribe({
        next: (alertsData) => {
          const alertInstances = alertsData.map(data => new AlertView({
            id: data.id,
            createdAt: data.createdAt,
            equipmentId: data.equipmentId,
            siteId: data.siteId,
            severity: data.severity,
            status: data.status,
            equipmentName: data.equipmentName,
            siteName: data.siteName
          }));
          this.alertsSignal.set(alertInstances);
        },
        error: (err) => {
          console.error('Error loading alerts', err);
          this.errorSignal.set('Failed to load alerts');
        }
      });
  }

  loadFullDashboard(): void {
    this.loadSnapshot();
    this.loadAlerts();
  }

  clearStore(): void {
    this.snapshotSignal.set(null);
    this.alertsSignal.set([]);
    this.errorSignal.set(null);
  }
}

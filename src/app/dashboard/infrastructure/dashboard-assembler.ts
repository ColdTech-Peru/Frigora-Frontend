
import { DashboardSnapshot } from '../domain/model/dashboard-snapshot.entity';
import { AlertView } from '../domain/model/alert-view.entity';
import { DashboardSnapshotResponse, AlertResponse } from './dashboard-response';

export class DashboardAssembler {

  static toEntityFromResource(resource: DashboardSnapshotResponse | null | undefined): DashboardSnapshot | null {
    if (!resource) return null;

    return new DashboardSnapshot({
      id: resource.id,
      tenantId: resource.tenantId,
      updatedAt: resource.updatedAt,
      kpis: resource.kpis,
      trends: resource.trends
    });
  }


  static toEntitiesFromResponse(data: DashboardSnapshotResponse[] | null | undefined): DashboardSnapshot[] {
    if (!Array.isArray(data)) {
      return [];
    }

    return data
      .map(resource => this.toEntityFromResource(resource))
      .filter((entity): entity is DashboardSnapshot => entity !== null);
  }

  static toAlertView(alertData: AlertResponse, equipmentName?: string, siteName?: string): AlertView {
    return new AlertView({
      id: alertData.id,
      createdAt: alertData.createdAt,
      equipmentId: alertData.equipmentId,
      siteId: alertData.siteId,
      severity: alertData.severity,
      status: alertData.status,
      equipmentName,
      siteName
    });
  }
}

import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { DashboardSnapshot } from '../domain/model/dashboard-snapshot.entity';
import { DashboardsResponse, DashboardResource } from './dashboard-response';

export class DashboardAssembler implements BaseAssembler<DashboardSnapshot, DashboardResource, DashboardsResponse> {
  toEntityFromResource(resource: DashboardResource): DashboardSnapshot {
	return new DashboardSnapshot({
	  id: String(resource.id),
	  tenantId: resource.tenantId,
	  updatedAt: resource.updatedAt,
	  kpis: resource.kpis,
	  trends: resource.trends
	});
  }

  toResourceFromEntity(entity: DashboardSnapshot): DashboardResource {
	return {
	  id: Number(entity.id) || 0,
	  tenantId: entity.tenantId,
	  updatedAt: entity.updatedAt.toISOString(),
	  kpis: entity.kpis,
	  trends: entity.trends
	} as DashboardResource;
  }

  toEntitiesFromResponse(response: DashboardsResponse): DashboardSnapshot[] {
	return response.snapshots.map(r => this.toEntityFromResource(r));
  }
}



import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { AlertView } from '../domain/model/alert-view.entity';
import { AlertsResponse, AlertResource } from './alert-response';

export class AlertAssembler implements BaseAssembler<AlertView, AlertResource, AlertsResponse> {
  toEntityFromResource(resource: AlertResource): AlertView {
    return new AlertView({
      id: resource.id,
      createdAt: resource.createdAt,
      equipmentId: resource.equipmentId,
      siteId: resource.siteId,
      severity: resource.severity,
      status: resource.status
    });
  }

  toResourceFromEntity(entity: AlertView): AlertResource {
    return {
      id: entity.id,
      createdAt: entity.createdAt,
      equipmentId: entity.equipmentId,
      siteId: entity.siteId,
      severity: entity.severity,
      status: entity.status
    };
  }

  toEntitiesFromResponse(response: AlertsResponse): AlertView[] {
    return response.alerts.map(resource => this.toEntityFromResource(resource));
  }
}


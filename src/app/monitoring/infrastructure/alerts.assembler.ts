import { AlertsEntity } from '../domain/model/alerts.entity';

export class AlertsAssembler {
  static toEntityFromResource(resource: any): AlertsEntity {
    return new AlertsEntity(
      resource.id,
      resource.tenantId,
      resource.equipmentId,
      resource.siteId,
      resource.type,
      resource.severity,
      resource.message,
      resource.status,
      resource.createdAt,
      resource.resolvedAt,
      resource.acknowledgedBy
    );
  }

  static toEntitiesFromResponse(response: any[]): AlertsEntity[] {
    return response.map(resource => this.toEntityFromResource(resource));
  }
}

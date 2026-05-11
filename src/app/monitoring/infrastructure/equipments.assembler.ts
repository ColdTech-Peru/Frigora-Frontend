import { EquipmentsEntity } from '../domain/model/equipments.entity';

export class EquipmentsAssembler {
  static toEntityFromResource(resource: any): EquipmentsEntity {
    return new EquipmentsEntity(
      resource.id,
      resource.equipmentId,
      resource.name,
      resource.model,
      resource.type,
      resource.serial,
      resource.status,
      resource.manufacturer,
      resource.installed,
      resource.lastSeen,
      resource.setPoint,
      resource.online,
      resource.currentTemperature,
      resource.created,
      resource.updated
    );
  }

  static toEntitiesFromResponse(response: any[]): EquipmentsEntity[] {
    return response.map(resource => this.toEntityFromResource(resource));
  }
}

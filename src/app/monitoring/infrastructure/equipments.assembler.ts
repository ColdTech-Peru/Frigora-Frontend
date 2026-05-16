import { EquipmentsEntity } from '../domain/model/equipments.entity';

export class EquipmentsAssembler {
  static toEntityFromResource(resource: any, readings: any[] = []): EquipmentsEntity {
    const latestReading = this.getLatestReadingByEquipmentId(resource.id, readings);

    return new EquipmentsEntity(
      resource.id,
      resource.equipmentId ?? resource.id,
      resource.name,
      resource.model,
      resource.type,
      resource.serial,
      resource.status,
      resource.manufacturer,
      resource.installed ?? resource.installedAt,
      resource.lastSeen ?? resource.lastSeenAt,
      resource.setPoint ?? resource.setpointC,
      resource.online,
      resource.currentTemperature ?? latestReading?.temperature ?? null,
      resource.created ?? resource.installedAt,
      resource.updated ?? resource.lastSeenAt
    );
  }

  static toEntitiesFromResponse(response: any[], readings: any[] = []): EquipmentsEntity[] {
    return response.map(resource => this.toEntityFromResource(resource, readings));
  }

  private static getLatestReadingByEquipmentId(equipmentId: string, readings: any[]): any | null {
    const equipmentReadings = readings
      .filter(reading => reading.equipmentId === equipmentId)
      .sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime());

    return equipmentReadings.length > 0 ? equipmentReadings[0] : null;
  }
}

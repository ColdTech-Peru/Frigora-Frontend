import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { EquipmentResource, EquipmentsResponse } from './equipment-response';

export class EquipmentAssembler implements BaseAssembler<any, EquipmentResource, EquipmentsResponse> {
  toEntityFromResource(resource: EquipmentResource): any {
    return {
      id: resource.id,
      name: resource.name
    };
  }

  toResourceFromEntity(entity: any): EquipmentResource {
    return {
      id: entity.id,
      name: entity.name
    };
  }

  toEntitiesFromResponse(response: EquipmentsResponse): any[] {
    return response.equipments.map(resource => this.toEntityFromResource(resource));
  }
}


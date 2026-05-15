import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { EquipmentResource, EquipmentsResponse } from './equipment-response';
import { EquipmentAssembler } from './equipment-assembler';
import { HttpClient } from '@angular/common/http';

export class EquipmentsApiEndpoint extends BaseApiEndpoint<
  any,
  EquipmentResource,
  EquipmentsResponse,
  EquipmentAssembler
> {
  constructor(http: HttpClient) {
    super(http, 'http://localhost:3000/equipments', new EquipmentAssembler()); // TODO: usar environment
  }
}


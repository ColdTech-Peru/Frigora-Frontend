import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface EquipmentResource extends BaseResource {
  id: string;
  name: string;
}

export interface EquipmentsResponse extends BaseResponse {
  equipments: EquipmentResource[];
}


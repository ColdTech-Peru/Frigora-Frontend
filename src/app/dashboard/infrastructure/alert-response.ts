import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface AlertResource extends BaseResource {
  /**
   * El API devuelve un identificador numérico. `BaseResource` exige `id: number`,
   * así que mantenemos `number` aquí para que la interfaz extienda correctamente.
   */
  id: number;
  createdAt: string;
  equipmentId: string;
  siteId: string;
  severity: string;
  status: string;
}

export interface AlertsResponse extends BaseResponse {
  alerts: AlertResource[];
}


import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface AlertResource extends BaseResource {
  id: string;
  createdAt: string;
  equipmentId: string;
  siteId: string;
  severity: string;
  status: string;
}

export interface AlertsResponse extends BaseResponse {
  alerts: AlertResource[];
}


import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface DashboardResource extends BaseResource {
  id: number;
  tenantId: string;
  updatedAt: string;
  kpis?: Record<string, any>;
  trends?: {
    temperature?: {
      labels?: string[];
      avg?: number[];
    };
    energy?: {
      labels?: string[];
      kwh?: number[];
    };
  };
}

export interface DashboardsResponse extends BaseResponse {
  snapshots: DashboardResource[];
}


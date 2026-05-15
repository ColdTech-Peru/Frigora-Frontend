import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';

export interface ReportResource extends BaseResource {
  id: number,
  tenantId: number,
  equipmentId: number,
  title: string,
  type: string,
  summary: string,
  content: string,
  url: string,
  status: string,
  generatedAt: string
}

export interface ReportResponse extends BaseResponse {
  categories: ReportResource[];
}

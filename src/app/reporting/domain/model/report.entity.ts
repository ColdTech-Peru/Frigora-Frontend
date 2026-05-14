export interface Report {
  id?: number;
  tenantId?: number;
  equipmentId?: number;

  title: string;
  type: string;
  summary: string;
  content: string;
  url: string;

  status?: string;
  generatedAt?: string;
}

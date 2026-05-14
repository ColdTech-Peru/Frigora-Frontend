
export interface DashboardSnapshotResponse {
  id: string;
  tenantId: string;
  updatedAt: string;
  kpis: any;
  trends: any;
}

export interface AlertResponse {
  id: string;
  createdAt: string;
  equipmentId: string;
  siteId: string;
  severity: string;
  status: string;
}

export interface EquipmentResponse {
  id: string;
  name: string;
}

export interface SiteResponse {
  id: string;
  name: string;
}

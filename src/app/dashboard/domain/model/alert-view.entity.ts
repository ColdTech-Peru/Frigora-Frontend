export class AlertView {
  id: string;
  createdAt: string;
  equipmentId: string;
  siteId: string;
  severity: string;
  status: string;
  equipmentName: string;
  siteName: string;

  constructor(init?: Partial<AlertView>) {
    this.id = init?.id ?? '';
    this.createdAt = init?.createdAt ?? '';
    this.equipmentId = init?.equipmentId ?? '';
    this.siteId = init?.siteId ?? '';
    this.severity = init?.severity ?? '';
    this.status = init?.status ?? '';

    this.equipmentName = init?.equipmentName || init?.equipmentId || '-';
    this.siteName = init?.siteName || init?.siteId || '-';
  }
}

export class AlertsEntity {
  constructor(
    public id: number,
    public tenantId: number,
    public equipmentId: number,
    public siteId: number,
    public type: string,
    public severity: string,
    public message: string,
    public status: string,
    public createdAt: string,
    public resolvedAt?: string,
    public acknowledgedBy?: string
  ) {}
}

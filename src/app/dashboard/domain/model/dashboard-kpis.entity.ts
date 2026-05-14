/**
 * DashboardKpis Entity
 * Represents the KPIs data shown in the dashboard
 * This data comes from other APIs (equipments, alerts, reports)
 */
export class DashboardKpis {
  totalEquipments: number;
  openAlerts: number;
  activeRequests: number;
  avgTemperature: number;
  minTemperature: number;
  maxTemperature: number;

  constructor(init?: Partial<DashboardKpis>) {
    this.totalEquipments = init?.totalEquipments ?? 0;
    this.openAlerts = init?.openAlerts ?? 0;
    this.activeRequests = init?.activeRequests ?? 0;
    this.avgTemperature = init?.avgTemperature ?? 0;
    this.minTemperature = init?.minTemperature ?? 0;
    this.maxTemperature = init?.maxTemperature ?? 0;
  }

  /**
   * Check if we have valid data
   */
  hasData(): boolean {
    return (
      this.totalEquipments > 0 ||
      this.openAlerts > 0 ||
      this.activeRequests > 0
    );
  }

  /**
   * Get formatted average temperature
   */
  getFormattedAvgTemp(): string {
    return this.avgTemperature ? `${this.avgTemperature.toFixed(1)} °C` : '-';
  }
}


export interface SnapshotKpis {
  totalSites?: number;
  totalEquipments?: number;
  openAlerts?: number;
  activeRequests?: number;
  energyThisWeekKwh?: number;
  [key: string]: any;
}

export interface TemperatureTrend {
  labels: string[];
  avg: number[];
}

export interface EnergyTrend {
  labels: string[];
  kwh: number[];
}

export interface SnapshotTrends {
  temperature: TemperatureTrend;
  energy: EnergyTrend;
}

export class DashboardSnapshot {
  id: string;
  tenantId: string;
  updatedAt: Date;
  kpis: SnapshotKpis;
  trends: SnapshotTrends;

  constructor(init?: any) {
    this.id = init?.id ?? '';
    this.tenantId = init?.tenantId ?? '';
    this.updatedAt = init?.updatedAt ? new Date(init.updatedAt) : new Date();
    this.kpis = init?.kpis ?? {};

    this.trends = {
      temperature: {
        labels: init?.trends?.temperature?.labels || [],
        avg: init?.trends?.temperature?.avg || []
      },
      energy: {
        labels: init?.trends?.energy?.labels || [],
        kwh: init?.trends?.energy?.kwh || []
      }
    };
  }

  /**
   * Genera el objeto de configuración de datos listo para ser consumido
   * por librerías de gráficos como Chart.js o ng2-charts en Angular.
   */
  get temperatureChartData(): any {
    return {
      labels: this.trends.temperature.labels,
      datasets: [{
        label: '°C',
        data: this.trends.temperature.avg,
        tension: 0.35,
        fill: true,
        borderColor: 'rgba(3, 169, 244, 1)',
        backgroundColor: 'rgba(3, 169, 244, 0.1)',
        pointRadius: 3,
        pointHoverRadius: 5
      }]
    };
  }

  /**
   * Calcula la temperatura promedio basándose en el arreglo de tendencias
   */
  get avgTemperature(): number {
    const temps = this.trends.temperature.avg;
    if (!temps || temps.length === 0) return 0;

    const sum = temps.reduce((acc, val) => acc + val, 0);
    return sum / temps.length;
  }
}

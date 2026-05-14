export class DashboardCard {
  id: number | null;
  cardType: string;
  order: number;
  isVisible: boolean;

  constructor(init?: Partial<DashboardCard>) {
    this.id = init?.id ?? null;
    this.cardType = init?.cardType ?? '';
    this.order = init?.order ?? 0;
    this.isVisible = init?.isVisible ?? true;
  }

  /**
   * Get card icon based on type
   * ONLY cards with available endpoints
   */
  getIcon(): string {
    const iconMap: Record<string, string> = {
      'MonitoredEquipment': 'pi-sitemap',
      'OpenAlerts': 'pi-exclamation-triangle'
    };

    return iconMap[this.cardType] || 'pi-th-large';
  }

  /**
   * Get card color based on type
   * ONLY cards with available endpoints
   */
  getColor(): string {
    const colorMap: Record<string, string> = {
      'MonitoredEquipment': '#3B82F6',
      'OpenAlerts': '#F59E0B'
    };

    return colorMap[this.cardType] || '#6B7280';
  }
}

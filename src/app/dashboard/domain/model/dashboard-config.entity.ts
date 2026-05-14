import { DashboardCard } from './dashboard-card.entity';

/**
 * DashboardConfig Entity
 * Represents the dashboard configuration for a user
 */
export class DashboardConfig {
  id: number | null;
  userId: number | null;
  defaultSiteId: number | null;
  defaultTemperatureRange: string;
  cards: DashboardCard[];

  constructor(init?: Partial<DashboardConfig>) {
    this.id = init?.id ?? null;
    this.userId = init?.userId ?? null;
    this.defaultSiteId = init?.defaultSiteId ?? null;
    this.defaultTemperatureRange = init?.defaultTemperatureRange ?? '-20 to 5';

    if (init?.cards && Array.isArray(init.cards)) {
      this.cards = init.cards.map(card => new DashboardCard(card));
    } else {
      this.cards = [];
    }
  }

  /**
   * Get visible cards sorted by order
   */
  getVisibleCards(): DashboardCard[] {
    return this.cards
      .filter(card => card.isVisible)
      .sort((a, b) => a.order - b.order);
  }

  /**
   * Get card by type
   */
  getCardByType(cardType: string): DashboardCard | undefined {
    return this.cards.find(card => card.cardType === cardType);
  }

  /**
   * Check if a card type is enabled and visible
   */
  hasCard(cardType: string): boolean {
    return this.cards.some(card => card.cardType === cardType && card.isVisible);
  }
}

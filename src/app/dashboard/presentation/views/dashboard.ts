import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';

import { DashboardStore } from '../../application/dashboard.store';
import { KpiCards } from '../components/kpi-cards/kpi-cards';
import { TrendChart } from '../components/trend-chart/trend-chart';
import { RecentAlertsTableComponent } from '../components/recent-alerts-table/recent-alerts-table';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    TranslatePipe,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatTooltipModule,
    KpiCards,
    TrendChart,
    RecentAlertsTableComponent
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardView implements OnInit {
  readonly store = inject(DashboardStore);

  ngOnInit(): void {
    this.refreshDashboard();
  }

  refreshDashboard(): void {
    this.store.loadFullDashboard('t1');
  }

  clearErrors(): void {
    (this.store as any).errorSignal?.set(null);
  }
}

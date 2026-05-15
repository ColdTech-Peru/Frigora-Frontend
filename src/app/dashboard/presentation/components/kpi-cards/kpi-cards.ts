import { Component, computed, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import {
  MatCard,
  MatCardHeader,
  MatCardTitle,
  MatCardContent
} from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { DashboardSnapshot } from '../../../domain/model/dashboard-snapshot.entity';

@Component({
  selector: 'app-kpi-cards',
  imports: [
    TranslatePipe,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatIcon
  ],
  templateUrl: './kpi-cards.html',
  styleUrl: './kpi-cards.css'
})
export class KpiCards {
  snapshot = input<DashboardSnapshot | null>(null);

  formattedAvgTemperature = computed(() => {
    const currentSnapshot = this.snapshot();
    if (!currentSnapshot) return '-';

    const avg = currentSnapshot.avgTemperature;
    return avg ? `${avg.toFixed(1)} °C` : '-';
  });
}

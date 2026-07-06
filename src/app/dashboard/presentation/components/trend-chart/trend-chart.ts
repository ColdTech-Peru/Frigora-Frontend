import { Component, computed, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import {
  MatCard,
  MatCardHeader,
  MatCardTitle,
  MatCardContent
} from '@angular/material/card';

@Component({
  selector: 'app-trend-chart',
  standalone: true,
  imports: [
    TranslatePipe,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent
  ],
  templateUrl: './trend-chart.html',
  styleUrl: './trend-chart.css'
})
export class TrendChart {

  chartData = signal({
    labels: [
      '10:00', '10:01', '10:02', '10:03',
      '10:04', '10:05', '10:06', '10:07'
    ],
    datasets: [
      {
        data: [21.5, 21.8, 22.1, 22.0, 22.4, 22.9, 23.1, 22.7]
      }
    ]
  });

  isLoading = signal(false);

  hasValidData = computed(() => {
    const data = this.chartData();
    return !!data?.datasets?.[0]?.data?.length;
  });

  noDataMessage = computed(() =>
    this.isLoading()
      ? 'Cargando datos...'
      : 'Sin datos de tendencia disponibles'
  );

  labels = computed(() => this.chartData().labels || []);

  values = computed(() => this.chartData().datasets[0].data || []);

  svgPoints = computed(() => {
    const data = this.values();
    if (!data.length) return '';

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max === min ? 1 : max - min;

    const width = 400;
    const height = 200;
    const padding = 20;

    return data
      .map((val, i) => {
        const x = (i / (data.length - 1)) * width;
        const y =
          height -
          (((val - min) / range) * (height - padding * 2) + padding);

        return `${x},${y}`;
      })
      .join(' ');
  });
}

import { Component, computed, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import {
  MatCard,
  MatCardHeader,
  MatCardTitle,
  MatCardContent
} from '@angular/material/card';

export interface TrendChartData {
  labels: string[];
  datasets: { data: number[] }[];
}

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

  chartData = input<TrendChartData | null>(null);
  isLoading = input<boolean>(false);

  labels = computed<string[]>(() =>
    this.chartData()?.labels ?? []
  );

  values = computed<number[]>(() =>
    this.chartData()?.datasets?.[0]?.data ?? []
  );

  hasValidData = computed(() =>
    this.values().length > 0
  );

  noDataMessage = computed(() =>
    this.isLoading()
      ? 'Cargando datos...'
      : 'Sin datos de tendencia disponibles'
  );

  svgPoints = computed(() => {
    const data = this.values();
    if (!data.length) return '0,0';

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

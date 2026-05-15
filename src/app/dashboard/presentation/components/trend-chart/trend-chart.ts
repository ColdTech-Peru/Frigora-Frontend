import { Component, computed, input } from '@angular/core';
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
  chartData = input<any>(null);
  isLoading = input<boolean>(false);

  hasValidData = computed(() => {
    const data = this.chartData();
    return !!data && data.datasets && data.datasets.length > 0 && data.datasets[0].data.length > 0;
  });

  noDataMessage = computed(() => {
    return this.isLoading() ? 'Cargando datos...' : 'Sin datos de tendencia disponibles';
  });

  labels = computed<string[]>(() => this.chartData()?.labels || []);
  values = computed<number[]>(() => this.chartData()?.datasets?.[0]?.data || []);

  // Lógica matemática intacta para dibujar la línea nativa
  svgPoints = computed(() => {
    const data = this.values();
    if (data.length === 0) return '';

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max === min ? 1 : max - min;

    const svgWidth = 400;
    const svgHeight = 200;
    const padding = 20;

    return data.map((val, index) => {
      const x = (index / (data.length - 1)) * svgWidth;
      const y = svgHeight - (((val - min) / range) * (svgHeight - padding * 2) + padding);
      return `${x},${y}`;
    }).join(' ');
  });
}

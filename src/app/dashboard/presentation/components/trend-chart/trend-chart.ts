import { Component, computed, OnDestroy } from '@angular/core';
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
export class TrendChart implements OnDestroy {

  private data: number[] = [
    22.0, 22.3, 22.6, 22.9, 23.1, 23.4, 23.7
  ];

  private labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  private intervalId: any;

  constructor() {
    this.startLiveUpdates();
  }

  private startLiveUpdates() {
    this.intervalId = setInterval(() => {
      const last = this.data[this.data.length - 1];

      const variation = Math.random() * 0.4 - 0.2;
      const next = Number((last + variation).toFixed(2));

      this.data = [...this.data.slice(1), next];
    }, 1500);
  }

  isLoading = computed(() => false);

  labelsComputed = computed<string[]>(() => this.labels);

  values = computed<number[]>(() => this.data);

  hasValidData = computed(() => {
    return this.data && this.data.length > 0;
  });

  noDataMessage = computed(() => {
    return this.isLoading()
      ? 'Cargando datos...'
      : 'Sin datos de tendencia disponibles';
  });

  svgPoints = computed(() => {
    const data = this.values();
    if (!data || data.length === 0) return '';

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max === min ? 1 : max - min;

    const svgWidth = 400;
    const svgHeight = 200;
    const padding = 20;

    return data.map((val, index) => {
      const x = data.length === 1
        ? svgWidth / 2
        : (index / (data.length - 1)) * svgWidth;

      const y =
        svgHeight -
        (((val - min) / range) * (svgHeight - padding * 2) + padding);

      return `${x},${y}`;
    }).join(' ');
  });

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }
}

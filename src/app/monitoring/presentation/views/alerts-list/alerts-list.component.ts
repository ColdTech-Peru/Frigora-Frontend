import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { MonitoringStore } from '../../../application/monitoring.store';
import { AlertsEntity } from '../../../domain/model/alerts.entity';

@Component({
  selector: 'app-alerts-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './alerts-list.component.html',
  styleUrl: './alerts-list.component.css'
})
export class AlertsListComponent implements OnInit {
  alerts$: Observable<AlertsEntity[]>;
  loading$: Observable<boolean>;

  constructor(private monitoringStore: MonitoringStore) {
    this.alerts$ = this.monitoringStore.alerts$;
    this.loading$ = this.monitoringStore.loading$;
  }

  ngOnInit(): void {
    this.monitoringStore.fetchAlerts();
  }

  acknowledgeAlert(alert: AlertsEntity): void {
    this.monitoringStore.acknowledgeAlert(alert);
  }

  deleteAlert(id: number): void {
    this.monitoringStore.deleteAlert(id);
  }
}

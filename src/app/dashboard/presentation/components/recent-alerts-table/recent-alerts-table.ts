import {Component, inject, input} from '@angular/core';
import {DatePipe, NgClass} from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent } from '@angular/material/card';
import {
  MatTable,
  MatColumnDef,
  MatHeaderCellDef,
  MatHeaderCell,
  MatCellDef,
  MatCell,
  MatHeaderRowDef,
  MatHeaderRow,
  MatRowDef,
  MatRow,
  MatNoDataRow
} from '@angular/material/table';
import { MatChip } from '@angular/material/chips';
import { MatButton } from '@angular/material/button';
import { AlertView } from '../../../domain/model/alert-view.entity';
import {MonitoringStore} from '../../../../monitoring/application/monitoring.store';

@Component({
  selector: 'app-recent-alerts-table',
  standalone: true,
  imports: [
    TranslatePipe,
    DatePipe,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    MatNoDataRow,
    MatChip,
    MatButton,
    NgClass
  ],
  templateUrl: './recent-alerts-table.html',
  styleUrl: './recent-alerts-table.css'
})
export class RecentAlertsTableComponent {
  items = input<AlertView[]>([]);

  private monitoringStore = inject(MonitoringStore);

  displayedColumns: string[] = ['date', 'equipmentName', 'siteName', 'severity', 'status', 'action'];

  getSeverityClass(severity: string): string {
    if (!severity) return '';

    return 'severity-' + severity.toLowerCase();
  }

  getStatusClass(status: string): string {
    if (!status) return '';

    return 'status-' + status.toLowerCase();
  }

  acknowledgeAlert(alert: any): void {
    if (!alert?.id) return;

    this.monitoringStore.acknowledgeAlert(alert);
  }
}

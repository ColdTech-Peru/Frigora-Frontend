import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
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
    MatButton
  ],
  templateUrl: './recent-alerts-table.html',
  styleUrl: './recent-alerts-table.css'
})
export class RecentAlertsTableComponent {
  items = input<AlertView[]>([]);

  displayedColumns: string[] = ['date', 'equipmentName', 'siteName', 'severity', 'status', 'action'];

  getSeverityColor(severity: string): 'warn' | 'accent' | 'primary' | '' {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'warn';
      case 'warning': return 'accent';
      case 'info': return 'primary';
      default: return '';
    }
  }
}

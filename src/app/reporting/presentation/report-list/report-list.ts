import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { Router, RouterModule } from '@angular/router';

import { ReportEntity } from '../../domain/model/report.entity';

import { ReportingService } from '../../application/reporting.service';

/* Angular Material */

import { MatTableModule } from '@angular/material/table';

import { MatButtonModule } from '@angular/material/button';

import { MatIconModule } from '@angular/material/icon';

import { MatPaginatorModule } from '@angular/material/paginator';

import { MatFormFieldModule } from '@angular/material/form-field';

import { MatSelectModule } from '@angular/material/select';

import { MatChipsModule } from '@angular/material/chips';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-reports-list',

  standalone: true,

  imports: [
    CommonModule,
    RouterModule,
    FormsModule,

    /* Material */

    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatSelectModule,
    MatChipsModule,
    TranslatePipe
  ],

  templateUrl: './report-list.html',

  styleUrls: ['./report-list.css']
})

export class ReportsListComponent implements OnInit {

  reports: ReportEntity[] = [];

  filteredReports: ReportEntity[] = [];

  selectedStatus: string = 'all';

  selectedType: string = 'all';

  displayedColumns: string[] = [
    'id',
    'title',
    'type',
    'status',
    'actions'
  ];

  constructor(
    private reportingService: ReportingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {

    this.reportingService.getReports().subscribe({

      next: (data) => {

        this.reports = data;

        this.filteredReports = data;
      },

      error: (err) => {
        console.error(err);
      }

    });
  }

  applyFilters(): void {

    this.filteredReports = this.reports.filter(report => {

      const matchesStatus =
        this.selectedStatus === 'all' ||
        report.status === this.selectedStatus;

      const matchesType =
        this.selectedType === 'all' ||
        report.type === this.selectedType;

      return matchesStatus && matchesType;
    });
  }

  getStatusClass(status?: string): string {

    switch (status) {

      case 'Generated':
        return 'status-generated';

      case 'Completed':
        return 'status-completed';

      case 'In Progress':
        return 'status-progress';

      case 'Canceled':
        return 'status-canceled';

      case 'Pending':
        return 'status-pending';

      default:
        return '';
    }
  }

  getTypeClass(type?: string): string {

    switch (type) {

      case 'Inspection':
        return 'type-inspection';

      case 'Maintenance':
        return 'type-maintenance';

      case 'Audit':
        return 'type-audit';

      case 'Incident':
        return 'type-incident';

      default:
        return 'type-default';
    }
  }

  editReport(id?: number): void {

    if (!id) return;

    this.router.navigate(['/reporting/edit', id]);
  }

  goToDetail(id?: number): void {

    if (!id) return;

    this.router.navigate(['/reporting', id]);
  }

  createReport(): void {
    this.router.navigate(['/reporting/new']);
  }

  deleteReport(id?: number): void {

    if (!id) return;

    const confirmDelete = confirm(
      'Are you sure you want to delete this report?'
    );

    if (!confirmDelete) return;

    this.reportingService.deleteReport(id).subscribe({

      next: () => {
        this.loadReports();
      },

      error: (err) => {
        console.error(err);
      }

    });
  }
}

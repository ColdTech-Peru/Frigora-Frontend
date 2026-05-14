import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { Report } from '../../domain/model/report.entity';
import { ReportingService } from '../../application/reporting.service';

@Component({
  selector: 'app-reports-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl:  './report-list.html',
  styleUrls: ['./report-list.css']
})
export class ReportsListComponent implements OnInit {

  reports: Report[] = [];

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
      },
      error: (err) => {
        console.error(err);
      }
    });
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

    const confirmDelete = confirm('Are you sure you want to delete this report?');

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

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { Report } from '../../domain/model/report.entity';
import { ReportingService } from '../../application/reporting.service';

@Component({
  selector: 'app-report-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './report-detail.html',
  styleUrls: ['./report-detail.css']
})
export class ReportDetailComponent implements OnInit {

  report?: Report;

  constructor(
    private route: ActivatedRoute,
    private reportingService: ReportingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.reportingService.getReportById(id).subscribe({
      next: (data) => {
        this.report = data;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  saveChanges(): void {
    if (!this.report || !this.report.id) return;

    this.reportingService.updateReport(this.report.id, this.report)
      .subscribe({
        next: () => {
          alert('Report updated successfully');
        },
        error: (err) => {
          console.error(err);
        }
      });
  }

  goBack(): void {
    this.router.navigate(['/reporting']);
  }
}

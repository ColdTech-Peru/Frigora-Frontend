import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';

import { ReportEntity } from '../../domain/model/report.entity';

import { ReportingService } from '../../application/reporting.service';

/* Angular Material */

import { MatButtonModule } from '@angular/material/button';

import { MatIconModule } from '@angular/material/icon';

import { MatCardModule } from '@angular/material/card';

import { MatFormFieldModule } from '@angular/material/form-field';

import { MatInputModule } from '@angular/material/input';

import { MatSelectModule } from '@angular/material/select';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-report-detail',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,

    /* Material */

    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    TranslatePipe
  ],

  templateUrl: './report-detail.html',

  styleUrls: ['./report-detail.css']
})

export class ReportDetailComponent implements OnInit {

  report?: ReportEntity;

  constructor(
    private route: ActivatedRoute,
    private reportingService: ReportingService,
    private router: Router
  ) {}

  ngOnInit(): void {

    const id = Number(
      this.route.snapshot.paramMap.get('id')
    );

    if (!id) return;

    this.reportingService
      .getReportById(id)

      .subscribe({

        next: (data) => {
          this.report = data;
        },

        error: (err) => {
          console.error(err);
        }

      });
  }

  saveChanges(): void {

    if (!this.report?.id) return;

    this.reportingService
      .updateReport(this.report.id, this.report)

      .subscribe({

        next: () => {

          alert('Report updated successfully');

          this.router.navigate(['/reporting']);
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

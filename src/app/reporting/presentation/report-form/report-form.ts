import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';

import { ReportingService } from '../../application/reporting.service';

/* Angular Material */

import { MatButtonModule } from '@angular/material/button';

import { MatIconModule } from '@angular/material/icon';

import { MatCardModule } from '@angular/material/card';

import { MatFormFieldModule } from '@angular/material/form-field';

import { MatInputModule } from '@angular/material/input';

import { MatSelectModule } from '@angular/material/select';

import {
  MatSnackBar,
  MatSnackBarModule
} from '@angular/material/snack-bar';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-report-form',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,

    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    TranslatePipe
  ],

  templateUrl: './report-form.html',

  styleUrls: ['./report-form.css']
})

export class ReportFormComponent implements OnInit {

  reportForm: FormGroup;

  isEditMode: boolean = false;

  reportId?: number;

  constructor(
    private fb: FormBuilder,
    private reportingService: ReportingService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {

    this.reportForm = this.fb.group({

      title: ['', Validators.required],

      type: ['', Validators.required],

      summary: ['', Validators.required],

      content: ['', Validators.required],

      url: ['', Validators.required],

      status: ['Pending', Validators.required]

    });
  }

  ngOnInit(): void {

    const id = Number(
      this.route.snapshot.paramMap.get('id')
    );

    if (!id) return;

    this.isEditMode = true;

    this.reportId = id;

    this.loadReport(id);
  }

  loadReport(id: number): void {

    this.reportingService
      .getReportById(id)
      .subscribe({

        next: (report) => {

          this.reportForm.patchValue({

            title: report.title,

            type: report.type,

            summary: report.summary,

            content: report.content,

            url: report.url,

            status: report.status

          });
        },

        error: (err) => {
          console.error(err);
        }

      });
  }

  submit(): void {

    if (this.reportForm.invalid) {

      this.reportForm.markAllAsTouched();

      return;
    }

    const reportData = this.reportForm.value;

    if (this.isEditMode && this.reportId) {

      this.reportingService
        .updateReport(this.reportId, reportData)
        .subscribe({

          next: () => {

            this.snackBar.open(
              'Report updated successfully',
              'Close',
              {
                duration: 3000,
                horizontalPosition: 'end',
                verticalPosition: 'bottom',
                panelClass: ['success-snackbar']
              }
            );

            this.router.navigate(['/reporting']);
          },

          error: (err) => {
            console.error(err);
          }

        });

      return;
    }

    this.reportingService
      .createReport(reportData)
      .subscribe({

        next: () => {

          this.snackBar.open(
            'Report created successfully',
            'Close',
            {
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'bottom',
              panelClass: ['success-snackbar']
            }
          );

          this.router.navigate(['/reporting']);
        },

        error: (err) => {
          console.error(err);
        }

      });
  }
}

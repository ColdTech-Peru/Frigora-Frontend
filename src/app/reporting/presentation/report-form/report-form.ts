import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ReportingService } from '../../application/reporting.service';

@Component({
  selector: 'app-report-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './report-form.html',
  styleUrls: ['./report-form.css']
})
export class ReportFormComponent {

  reportForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private reportingService: ReportingService,
    private router: Router
  ) {

    this.reportForm = this.fb.group({
      title: ['', Validators.required],
      type: ['', Validators.required],
      summary: ['', Validators.required],
      content: ['', Validators.required],
      url: ['', Validators.required],
      status: ['Pending']
    });
  }

  submit(): void {

    if (this.reportForm.invalid) {
      this.reportForm.markAllAsTouched();
      return;
    }

    this.reportingService.createReport(this.reportForm.value)
      .subscribe({
        next: () => {
          alert('Report created successfully');
          this.router.navigate(['/reporting']);
        },
        error: (err) => {
          console.error(err);
        }
      });
  }
}

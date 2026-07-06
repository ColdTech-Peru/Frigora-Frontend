import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ServiceRequestStore } from '../../../application/service-request-store';
import { TranslatePipe } from '@ngx-translate/core';
import { IamApi } from '../../../../iam/infrastructure/iam-api';

@Component({
  selector: 'app-service-request-new',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    TranslatePipe
  ],
  templateUrl: './service-request-new.html',
  styleUrl: './service-request-new.css'
})
export class ServiceRequestNewComponent implements OnInit {

  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly store = inject(ServiceRequestStore);
  private readonly iamApi = inject(IamApi);

  readonly equipments = this.store.equipments;
  readonly sites = this.store.sites;
  readonly isLoading = this.store.loading;
  readonly error = this.store.error;

  providers: any[] = [];

  private readonly saveAttempted = signal(false);

  readonly typeOptions = [
    { label: 'Corrective', value: 'corrective' },
    { label: 'Preventive', value: 'preventive' },
  ];

  readonly priorityOptions = [
    { label: 'High', value: 'high' },
    { label: 'Medium', value: 'medium' },
    { label: 'Low', value: 'low' },
  ];

  form = {
    siteId: null as number | string | null,
    equipmentId: null as number | string | null,
    assignedTo: null as number | string | null,
    type: 'corrective',
    priority: 'medium',
    description: '',
  };

  constructor() {
    effect(() => {
      const loading = this.store.loading();
      const error = this.store.error();
      const attempted = this.saveAttempted();

      if (attempted && !loading && !error) {
        this.snackBar.open('Service request created successfully', 'Close', { duration: 3000 });
        this.navigateBack();
      }

      if (attempted && !loading && error) {
        this.snackBar.open('Failed to create service request', 'Close', { duration: 3000 });
        this.saveAttempted.set(false);
      }
    });
  }

  ngOnInit(): void {
    this.store.loadFormData().subscribe();
    this.loadProviders();
  }

  private loadProviders(): void {
    this.iamApi.getUsersByRole('Provider').subscribe({
      next: (res: any) => {
        const users = Array.isArray(res) ? res : res?.data ?? [];

        this.providers = users.map((u: any) => ({
          id: u.id,
          username: u.username || u.name || `user${u.id}`
        }));

        console.log('PROVIDERS:', this.providers);
      },
      error: (e) => console.error('Error loading providers', e)
    });
  }

  saveRequest(): void {
    if (!this.form.description || !this.form.equipmentId || !this.form.siteId || !this.form.assignedTo) {
      this.snackBar.open('Please fill in all required fields', 'Close', { duration: 3000 });
      return;
    }

    this.saveAttempted.set(true);

    this.store.createRequest({
      siteId: this.form.siteId,
      equipmentId: this.form.equipmentId,
      assignedTo: this.form.assignedTo,
      origin: 'Manual',
      type: this.form.type,
      priority: this.form.priority,
      description: this.form.description,
      status: 'pending',
      createdAt: new Date().toISOString(),
    });
  }

  navigateBack(): void {
    this.router.navigate(['/services']);
  }
}

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

/**
 * @component ServiceRequestNewComponent
 * @description Allows users to create a new service request.
 * Delegates all data logic to ServiceRequestStore.
 * @author Alejandro Galindo
 */
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

  /**
   * @description Centralized store for service requests.
   * Provides equipments, sites, loading state and errors.
   */
  private readonly store = inject(ServiceRequestStore);

  /**
   * @description Available equipments signal exposed from the store.
   * Replaces the direct call to MonitoringApiService.
   */
  readonly equipments = this.store.equipments;

  /**
   * @description Available sites signal exposed from the store.
   * Replaces the direct call to AssetsManagementApi.
   */
  readonly sites = this.store.sites;

  /**
   * @description Indicates whether an operation is in progress (loading or saving).
   * Bound directly to the store signal.
   */
  readonly isLoading = this.store.loading;

  /**
   * @description Current error message exposed by the store.
   * Null if there is no error.
   */
  readonly error = this.store.error;

  /**
   * @description Tracks whether a save was attempted,
   * to prevent the navigation effect from firing more than once.
   */
  private readonly saveAttempted = signal(false);

  /**
   * @description Service request type options.
   */
  readonly typeOptions = [
    { label: 'Corrective', value: 'corrective' },
    { label: 'Preventive', value: 'preventive' },
  ];

  /**
   * @description Service request priority options.
   */
  readonly priorityOptions = [
    { label: 'High', value: 'high' },
    { label: 'Medium', value: 'medium' },
    { label: 'Low', value: 'low' },
  ];

  /**
   * @description Form model for the new service request.
   */
  form = {
    siteId: null as number | string | null,
    equipmentId: null as number | string | null,
    type: 'corrective',
    priority: 'medium',
    description: '',
  };

  constructor() {
    /**
     * @description Reactive effect that listens to store state changes.
     * Navigates back if the save was successful (no error and not loading).
     * Only acts if a save was previously attempted.
     */
    effect(() => {
      const loading = this.store.loading();
      const error = this.store.error();
      const attempted = this.saveAttempted();

      if (attempted && !loading && !error) {
        this.snackBar.open(
          'Service request created successfully',
          'Close',
          { duration: 3000 }
        );
        this.navigateBack();
      }

      if (attempted && !loading && error) {
        this.snackBar.open(
          'Failed to create service request',
          'Close',
          { duration: 3000 }
        );
        // Resets the attempt flag to allow retries
        this.saveAttempted.set(false);
      }
    });
  }

  /**
   * @description Angular lifecycle hook.
   * Loads equipments, sites and requests from the store.
   */
  ngOnInit(): void {
    this.store.loadAll();
  }

  /**
   * @description Validates the form and delegates creation to the store.
   * The result is handled reactively in the constructor effect.
   */
  saveRequest(): void {

    if (!this.form.description || !this.form.equipmentId || !this.form.siteId) {
      this.snackBar.open(
        'Please fill in all required fields',
        'Close',
        { duration: 3000 }
      );
      return;
    }

    // Marks that a save attempt has started
    // so the effect can react to the outcome
    this.saveAttempted.set(true);

    this.store.createRequest({
      siteId: this.form.siteId,
      equipmentId: this.form.equipmentId,
      origin: 'Manual',
      type: this.form.type,
      priority: this.form.priority,
      description: this.form.description,
      status: 'pending',
      createdAt: new Date().toISOString(),
    });
  }

  /**
   * @description Navigates back to the services list.
   */
  navigateBack(): void {
    this.router.navigate(['/services']);
  }
}

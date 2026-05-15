import { Component, computed, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ServiceRequestsApi } from '../../../infrastructure/service-request-api';
import { ServiceRequestStore } from '../../../application/service-request-store';
import { MonitoringApiService } from '../../../../monitoring/infrastructure/monitoring-api.service';
import { AssetsManagementApi } from '../../../../assets-management/infrastructure/assets-management-api';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * @component ServiceRequestDetailComponent
 * @description Displays detailed information of a service request including its status,
 * priority, description, and interventions log. Allows registering new interventions
 * and deleting the request after confirmation.
 * @author Alejandro Galindo
 */
@Component({
  selector: 'app-service-request-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatDividerModule,
    MatTooltipModule,
    MatSnackBarModule,
    TranslatePipe,
  ],
  templateUrl: './service-request-detail.html',
  styleUrl: './service-request-detail.css'
})
export class ServiceRequestDetailComponent implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly api = inject(ServiceRequestsApi);
  private readonly store = inject(ServiceRequestStore);

  /**
   * @description MonitoringApiService used only in the fallback path
   * when the store does not have the request cached.
   */
  private readonly monitoringApi = inject(MonitoringApiService);

  /**
   * @description AssetsManagementApi used only in the fallback path
   * to enrich the request with the site name.
   */
  private readonly assetsManagementApi = inject(AssetsManagementApi);

  private readonly snackBar = inject(MatSnackBar);

  readonly requestId = computed(() => this.route.snapshot.paramMap.get('requestId') ?? '');

  isLoading = false;
  isDeleting = false;
  serviceRequest: any = null;
  interventions: any[] = [];

  // Equipment dialog
  displayEquipmentDialog = false;
  selectedEquipment: any = null;

  /**
   * @description Controls visibility of the delete confirmation dialog.
   */
  displayDeleteConfirm = false;

  // New intervention form
  newIntervention = {
    summary: '',
    startTime: '',
    endTime: '',
    photoUrls: [] as string[]
  };
  newPhotoUrl = '';

  /**
   * @description Angular lifecycle hook.
   * Tries to get enriched data from the store first.
   * Falls back to direct API calls if the store does not have the request cached.
   */
  ngOnInit(): void {
    const id = this.requestId();

    // Try to get enriched data from store first (includes equipmentName and siteName)
    const fromStore = this.store.serviceRequests().find(
      sr => String(sr.id) === String(id)
    );

    if (fromStore) {
      this.serviceRequest = fromStore;
      this.fetchInterventions();
    } else {
      // Fallback: load from API and enrich manually
      this.fetchRequestDetails();
    }
  }

  /**
   * @description Fallback method that loads the request details directly from the API
   * and enriches it with equipment and site names in parallel.
   */
  async fetchRequestDetails(): Promise<void> {
    this.isLoading = true;
    try {
      const [requestRes, equipmentsRes, sitesRes]: any[] = await Promise.all([
        this.api.getServiceRequestDetailsQuery(this.requestId()).toPromise(),
        this.monitoringApi.getEquipments().toPromise(),
        this.assetsManagementApi.getSites().toPromise(),
      ]);

      // Match using String() to avoid type mismatch between number and string ids
      const equipment = equipmentsRes?.find(
        (e: any) => String(e.id) === String(requestRes.equipmentId)
      );
      const site = sitesRes?.find(
        (s: any) => String(s.id) === String(requestRes.siteId)
      );

      this.serviceRequest = {
        ...requestRes,
        equipmentName: equipment?.name ?? requestRes.equipmentId ?? 'N/A',
        siteName: site?.name ?? requestRes.siteId ?? 'N/A',
      };

      await this.fetchInterventions();

    } catch (error) {
      console.error('Failed to fetch request details:', error);
      this.snackBar.open('Failed to load request details', 'Close', { duration: 3000 });
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * @description Loads the interventions for the current service request
   * from the interventions collection using serviceRequestId as filter.
   */
  async fetchInterventions(): Promise<void> {
    this.isLoading = true;
    try {
      const res: any = await this.api
        .getInterventionsByRequestQuery(this.requestId())
        .toPromise();
      this.interventions = res ?? [];
    } catch (error) {
      console.error('Failed to fetch interventions:', error);
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * @description Fetches full equipment details and opens the equipment dialog.
   */
  async openEquipmentDialog(): Promise<void> {
    if (!this.serviceRequest?.equipmentId) return;
    try {
      const response: any = await this.monitoringApi
        .getEquipmentById(this.serviceRequest.equipmentId)
        .toPromise();
      this.selectedEquipment = response;
      this.displayEquipmentDialog = true;
    } catch (error) {
      console.error('Failed to fetch equipment details:', error);
      this.snackBar.open('Failed to load equipment details', 'Close', { duration: 3000 });
    }
  }

  /**
   * @description Opens the delete confirmation dialog.
   */
  confirmDelete(): void {
    this.displayDeleteConfirm = true;
  }

  /**
   * @description Deletes the current service request after user confirmation.
   * Navigates back to /services on success.
   */
  async deleteRequest(): Promise<void> {
    const id = this.requestId();

    if (!id) {
      this.snackBar.open('Invalid request ID', 'Close', { duration: 3000 });
      this.displayDeleteConfirm = false;
      return;
    }

    this.isDeleting = true;
    this.displayDeleteConfirm = false;

    try {
      await this.api
        .sendDeleteRequestCommand(id)
        .toPromise();

      this.snackBar.open(
        'Service request deleted successfully',
        'Close',
        { duration: 3000 }
      );

      this.router.navigate(['/services']);

    } catch (error) {
      console.error('Failed to delete service request:', error);
      this.snackBar.open(
        'Failed to delete service request',
        'Close',
        { duration: 3000 }
      );
    } finally {
      this.isDeleting = false;
    }
  }

  /**
   * @description Adds a photo URL to the new intervention form.
   */
  addPhotoUrl(): void {
    const url = this.newPhotoUrl.trim();
    if (url && !this.newIntervention.photoUrls.includes(url)) {
      this.newIntervention.photoUrls.push(url);
      this.newPhotoUrl = '';
    }
  }

  /**
   * @description Removes a photo URL from the new intervention form.
   * @param url - The URL to remove.
   */
  removePhotoUrl(url: string): void {
    this.newIntervention.photoUrls =
      this.newIntervention.photoUrls.filter(u => u !== url);
  }

  /**
   * @description Submits a new intervention for the current service request.
   */
  async registerIntervention(): Promise<void> {
    if (!this.newIntervention.summary.trim()) {
      this.snackBar.open('Please provide a summary', 'Close', { duration: 3000 });
      return;
    }

    const payload = {
      serviceRequestId: this.requestId(),
      summary: this.newIntervention.summary,
      startTime: this.newIntervention.startTime
        ? new Date(this.newIntervention.startTime).toISOString()
        : new Date().toISOString(),
      endTime: this.newIntervention.endTime
        ? new Date(this.newIntervention.endTime).toISOString()
        : null,
      status: this.newIntervention.endTime ? 'completed' : 'pending',
      photoUrls: this.newIntervention.photoUrls,
    };

    try {
      await this.api.sendRecordInterventionCommand(payload).toPromise();
      this.newIntervention = { summary: '', startTime: '', endTime: '', photoUrls: [] };
      this.snackBar.open('Intervention registered', 'Close', { duration: 3000 });
      await this.fetchInterventions();
    } catch (error) {
      console.error('Failed to register intervention:', error);
      this.snackBar.open('Failed to register intervention', 'Close', { duration: 3000 });
    }
  }

  /**
   * @description Navigates to the detail view of a specific intervention.
   * @param intervention - The intervention to navigate to.
   */
  navigateToIntervention(intervention: any): void {
    this.router.navigate(['/services', this.requestId(), 'interventions', intervention.id]);
  }

  /**
   * @description Returns the CSS class for a given status chip.
   * @param status - The status string.
   */
  statusClass(status: string): string {
    const map: Record<string, string> = {
      pending: 'chip-pending',
      accepted: 'chip-accepted',
      inProgress: 'chip-in-progress',
      completed: 'chip-completed',
      canceled: 'chip-canceled',
      rejected: 'chip-rejected',
    };
    return map[status?.toLowerCase()] ?? '';
  }

  /**
   * @description Formats a date value to a locale date string.
   * @param date - The date to format.
   */
  formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString();
  }

  /**
   * @description Formats a date value to a locale date-time string.
   * @param date - The date to format.
   */
  formatDateTime(date: string | Date): string {
    return new Date(date).toLocaleString();
  }
}

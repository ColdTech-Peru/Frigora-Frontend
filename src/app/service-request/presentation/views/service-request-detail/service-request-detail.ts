import {ChangeDetectorRef, Component, computed, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatChipsModule} from '@angular/material/chips';
import {MatDividerModule} from '@angular/material/divider';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {firstValueFrom} from 'rxjs';

import {ServiceRequestsApi} from '../../../infrastructure/service-request-api';
import {ServiceRequestStore} from '../../../application/service-request-store';
import {MonitoringApiService} from '../../../../monitoring/infrastructure/monitoring-api.service';
import {AssetsManagementApi} from '../../../../assets-management/infrastructure/assets-management-api';
import {AuthStoreService} from '../../../../iam/application/iam.store';
import {TechniciansService} from '../../../../technician/infrastructure/technicians.service';

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
  ],
  templateUrl: './service-request-detail.html',
  styleUrl: './service-request-detail.css'
})
export class ServiceRequestDetailComponent implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly api = inject(ServiceRequestsApi);
  private readonly store = inject(ServiceRequestStore);
  private readonly monitoringApi = inject(MonitoringApiService);
  private readonly assetsManagementApi = inject(AssetsManagementApi);
  private readonly techniciansApi = inject(TechniciansService);
  private readonly cdr = inject(ChangeDetectorRef);
  protected readonly authStore = inject(AuthStoreService);
  private readonly snackBar = inject(MatSnackBar);

  readonly isProvider = computed(() =>
    this.authStore.currentUserRole === 'Provider'
  );

  readonly isOwner = computed(() =>
    this.authStore.currentUserRole === 'Owner'
  );

  readonly requestId = computed(() =>
    String(this.route.snapshot.paramMap.get('requestId'))
  );

  isLoading = false;

  serviceRequest: any = null;
  interventions: any[] = [];
  technicians: any[] = [];

  displayEquipmentDialog = false;
  selectedEquipment: any = null;

  newIntervention = {
    technicianId: null as any,
    summary: '',
    startTime: '',
    endTime: '',
    photoUrls: [] as string[]
  };

  newPhotoUrl = '';

  async ngOnInit(): Promise<void> {
    if (!this.isProvider() && !this.isOwner()) {
      this.snackBar.open('Unauthorized access', 'Close', { duration: 3000 });
      await this.router.navigate(['/dashboard']);
      return;
    }

    const id = this.requestId();
    const fromStore = this.store.serviceRequests().find(
      sr => String(sr.id) === String(id)
    );

    if (fromStore) {
      this.serviceRequest = fromStore;
      await this.fetchInterventions();
    } else {
      await this.fetchRequestDetails();
    }

    await this.loadTechnicians();
    this.cdr.markForCheck();
  }

  async loadTechnicians(): Promise<void> {
    try {
      if (!this.isProvider()) return;

      const providerId = this.authStore.currentUserId;
      if (providerId === null) return;

      const res: any = await firstValueFrom(
        this.techniciansApi.getTechniciansByProvider(providerId)
      );

      this.technicians = res ?? [];
      this.cdr.markForCheck();
    } catch (error) {
      console.error(error);
    }
  }

  async fetchRequestDetails(): Promise<void> {
    this.isLoading = true;
    this.cdr.markForCheck();

    try {
      const [requestRes, equipmentsRes, sitesRes]: any[] = await Promise.all([
        firstValueFrom(this.api.getServiceRequestDetailsQuery(this.requestId())),
        firstValueFrom(this.monitoringApi.getEquipments()),
        firstValueFrom(this.assetsManagementApi.getSites()),
      ]);

      const equipment = equipmentsRes?.find(
        (e: any) => String(e.id) === String(requestRes.equipmentId)
      );

      const site = sitesRes?.find(
        (s: any) => String(s.id) === String(requestRes.siteId)
      );

      this.serviceRequest = {
        ...requestRes,
        equipmentName: equipment?.name ?? 'N/A',
        siteName: site?.name ?? 'N/A',
      };

      await this.fetchInterventions();

    } catch (error) {
      console.error(error);
      this.snackBar.open('Failed to load request', 'Close', { duration: 3000 });
    } finally {
      this.isLoading = false;
      this.cdr.markForCheck();
    }
  }

  async fetchInterventions(): Promise<void> {
    try {
      const res: any = await firstValueFrom(
        this.api.getInterventionsByRequestQuery(this.requestId())
      );

      this.interventions = res ?? [];
      this.cdr.markForCheck();
    } catch (error) {
      console.error(error);
    }
  }

  async openEquipmentDialog(): Promise<void> {
    if (!this.serviceRequest?.equipmentId) return;

    try {
      this.selectedEquipment = await firstValueFrom(
        this.monitoringApi.getEquipmentById(this.serviceRequest.equipmentId)
      );
      this.displayEquipmentDialog = true;
      this.cdr.markForCheck();
    } catch (error) {
      console.error(error);
    }
  }

  addPhotoUrl(): void {
    const url = this.newPhotoUrl.trim();
    if (!url) return;

    if (!this.newIntervention.photoUrls.includes(url)) {
      this.newIntervention.photoUrls.push(url);
    }

    this.newPhotoUrl = '';
  }

  removePhotoUrl(url: string): void {
    this.newIntervention.photoUrls =
      this.newIntervention.photoUrls.filter(x => x !== url);
  }

  async registerIntervention(): Promise<void> {
    if (!this.isProvider()) return;

    if (!this.newIntervention.summary.trim()) {
      this.snackBar.open('Summary required', 'Close', { duration: 3000 });
      return;
    }

    const payload = {
      serviceRequestId: this.requestId(),
      technicianId: this.newIntervention.technicianId,
      summary: this.newIntervention.summary,

      startTime: this.newIntervention.startTime || null,
      endTime: this.newIntervention.endTime || null,

      status: this.newIntervention.endTime ? 'completed' : 'pending',

      photoUrls: this.newIntervention.photoUrls,
    };

    try {
      await firstValueFrom(this.api.sendRecordInterventionCommand(payload));

      this.newIntervention = {
        technicianId: null,
        summary: '',
        startTime: '',
        endTime: '',
        photoUrls: []
      };

      await this.fetchInterventions();

      this.snackBar.open('Intervention registered', 'Close', { duration: 3000 });

    } catch (error) {
      console.error(error);
      this.snackBar.open('Error registering intervention', 'Close', { duration: 3000 });
    }
  }

  navigateToIntervention(intervention: any): void {
    this.router.navigate(
      ['interventions', intervention.id],
      { relativeTo: this.route }
    );
  }

  statusClass(status: string): string {
    const map: Record<string, string> = {
      pending: 'chip-pending',
      accepted: 'chip-accepted',
      inprogress: 'chip-in-progress',
      completed: 'chip-completed',
      canceled: 'chip-canceled',
      rejected: 'chip-rejected',
    };

    return map[status?.toLowerCase()] ?? '';
  }

  formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString();
  }

  formatDateTime(date: string | Date): string {
    return new Date(date).toLocaleString();
  }
}

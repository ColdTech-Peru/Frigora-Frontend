import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { Subject, firstValueFrom } from 'rxjs';

import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

import { ServiceRequestsApi } from '../../../infrastructure/service-request-api';
import { TechniciansService } from '../../../../technician/infrastructure/technicians.service';
import { AuthStoreService } from '../../../../iam/application/iam.store';

@Component({
  selector: 'app-in-progress-services',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    ReactiveFormsModule,
    FormsModule,
    TranslatePipe,
    MatChipsModule,
    MatFormFieldModule
  ],
  templateUrl: './in-progress-services.html',
  styleUrls: ['./in-progress-services.css']
})
export class InProgressServicesComponent implements OnInit, OnDestroy {

  private serviceRequestApi = inject(ServiceRequestsApi);
  private techniciansApi = inject(TechniciansService);
  private authStore = inject(AuthStoreService);
  private cdr = inject(ChangeDetectorRef);

  private destroy$ = new Subject<void>();

  loading = false;
  error: string | null = null;

  activeRequests: any[] = [];
  technicians: any[] = [];

  selectedTechnicians: Record<string, any> = {};

  displayedColumns = [
    'id',
    'description',
    'status',
    'technician',
    'actions'
  ];

  get currentProviderId(): string | null {
    return this.authStore.currentUser?.id ?? null;
  }

  ngOnInit(): void {
    this.waitForAuthAndLoad();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private async waitForAuthAndLoad(): Promise<void> {
    while (!this.currentProviderId) {
      await new Promise(res => setTimeout(res, 50));
    }

    this.fetchData();
  }

  async fetchData(): Promise<void> {
    if (!this.currentProviderId) return;

    this.loading = true;
    this.cdr.markForCheck();

    try {
      const [accepted, inProgress, techs]: any = await Promise.all([
        firstValueFrom(
          this.serviceRequestApi.getRequestsForProviderQuery(
            this.currentProviderId,
            'accepted'
          )
        ),
        firstValueFrom(
          this.serviceRequestApi.getRequestsForProviderQuery(
            this.currentProviderId,
            'inProgress'
          )
        ),
        firstValueFrom(
          this.techniciansApi.getTechniciansByProvider(
            this.currentProviderId
          )
        )
      ]);

      this.technicians = techs ?? [];

      const allRequests = [...(accepted ?? []), ...(inProgress ?? [])];

      this.activeRequests = allRequests.map((r: any) => ({
        ...r,
        technicianName:
          this.technicians.find(
            t => String(t.id) === String(r.technicianId)
          )?.name ?? null
      }));

    } catch (err) {
      console.error(err);
      this.error = 'Failed to load data';
    } finally {
      this.loading = false;
      this.cdr.markForCheck();
    }
  }

  async assignTechnician(requestId: string | number): Promise<void> {
    const techId = this.selectedTechnicians[requestId];
    if (!techId) return;

    try {
      await firstValueFrom(
        this.serviceRequestApi.sendAssignTechnicianCommand(
          requestId,
          techId
        )
      );
      await this.fetchData();
    } catch (err) {
      console.error('Error assigning technician', err);
    }
  }

  async completeService(requestId: string | number): Promise<void> {
    try {
      await firstValueFrom(
        this.serviceRequestApi.sendCompleteRequestCommand(requestId)
      );
      await this.fetchData();
    } catch (err) {
      console.error('Error completing service', err);
    }
  }

  getStatusTranslation(status: string): string {
    const map: any = {
      accepted: 'Aceptado',
      inProgress: 'En progreso'
    };
    return map[status] ?? status;
  }
}

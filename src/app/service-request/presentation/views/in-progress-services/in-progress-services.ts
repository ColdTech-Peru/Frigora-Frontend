import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

import { ServiceRequestsApi } from '../../../infrastructure/service-request-api';
import { TechniciansService } from '../../../../technician/infrastructure/technicians.service';
import { AuthStoreService } from '../../../../iam/application/iam.store';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslatePipe} from '@ngx-translate/core';

import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';

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
    MatFormFieldModule,
  ],
  templateUrl: './in-progress-services.html',
  styleUrls: ['./in-progress-services.css']
})
export class InProgressServicesComponent implements OnInit {

  private serviceRequestApi = inject(ServiceRequestsApi);
  private techniciansApi = inject(TechniciansService);
  private authStore = inject(AuthStoreService);

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
    this.fetchData();
  }

  fetchData(): void {
    if (!this.currentProviderId) return;

    this.loading = true;
    this.error = null;

    forkJoin({
      accepted: this.serviceRequestApi.getRequestsForProviderQuery(this.currentProviderId, 'accepted'),
      inProgress: this.serviceRequestApi.getRequestsForProviderQuery(this.currentProviderId, 'inProgress'),
      techs: this.techniciansApi.getTechniciansByProvider(this.currentProviderId)
    }).subscribe({
      next: (res) => {

        this.activeRequests = [
          ...(res.accepted ?? []),
          ...(res.inProgress ?? [])
        ];

        this.technicians = res.techs ?? [];

        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to load data';
        this.loading = false;
      }
    });
  }

  assignTechnician(requestId: string | number): void {
    const techId = this.selectedTechnicians[requestId];
    if (!techId) return;

    this.serviceRequestApi
      .sendAssignTechnicianCommand(requestId, techId)
      .subscribe(() => this.fetchData());
  }

  completeService(requestId: string | number): void {
    this.serviceRequestApi
      .sendCompleteRequestCommand(requestId)
      .subscribe(() => this.fetchData());
  }

  getStatusTranslation(status: string): string {
    const map: any = {
      accepted: 'Aceptado',
      inProgress: 'En progreso'
    };
    return map[status] ?? status;
  }
}

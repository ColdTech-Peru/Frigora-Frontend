import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AuthStoreService } from '../../../../iam/application/iam.store';
import { ServiceRequestsApi } from '../../../infrastructure/service-request-api';

@Component({
  selector: 'app-provider-services-hub',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './provider-services-hub.html',
  styleUrl: './provider-services-hub.css'
})
export class ProviderServicesHubComponent implements OnInit {
  private router = inject(Router);
  public translate = inject(TranslateService);
  private serviceApi = inject(ServiceRequestsApi);
  private authStore = inject(AuthStoreService);

  counts = {
    pending: 0,
    accepted: 0,
    inProgress: 0,
    completed: 0,
    rejected: 0,
    canceled: 0,
  };

  get currentProviderId(): string | number | null {
    return this.authStore.currentUserId || 'public';
  }

  ngOnInit(): void {
    const providerId = this.currentProviderId;
    if (!providerId) return;

    this.serviceApi.getRequestsForProviderQuery(providerId).subscribe({
      next: (allRequests: any[]) => {
        this.counts.pending = allRequests.filter((r) => r.status === 'pending').length;
        this.counts.accepted = allRequests.filter((r) => r.status === 'accepted').length;
        this.counts.inProgress = allRequests.filter((r) => r.status === 'inProgress').length;
        this.counts.completed = allRequests.filter((r) => r.status === 'completed').length;
        this.counts.rejected = allRequests.filter((r) => r.status === 'rejected').length;
        this.counts.canceled = allRequests.filter((r) => r.status === 'canceled').length;
      },
      error: (err) => console.error('Error al cargar métricas de servicios', err)
    });
  }

  navigate(status: string): void {
    const routeNames: Record<string, string> = {
      'pending': '/provider/dashboard',
      'in-progress': '/provider/services/in-progress',
      'completed': '/provider/services/completed',
      'rejected-canceled': '/provider/services/rejected-canceled'
    };

    if (routeNames[status]) {
      this.router.navigate([routeNames[status]]);
    }
  }
}

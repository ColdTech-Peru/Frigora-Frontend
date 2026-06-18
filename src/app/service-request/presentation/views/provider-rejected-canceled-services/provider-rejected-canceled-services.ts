import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { ServiceRequest } from '../../../domain/model/service-request.entity';
import { ServiceRequestsApi } from '../../../infrastructure/service-request-api';
import { AssetsManagementApi } from '../../../../assets-management/infrastructure/assets-management-api';
import { AuthStoreService } from '../../../../iam/application/iam.store';
import { ServiceRequestAssembler } from '../../../infrastructure/service-request-assembler';

@Component({
  selector: 'app-provider-rejected-canceled-services',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatCardModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    DatePipe
  ],
  templateUrl: './provider-rejected-canceled-services.html',
  styleUrl: './provider-rejected-canceled-services.css'
})
export class ProviderRejectedCanceledServicesComponent implements OnInit {
  loading = false;
  error: string | null = null;
  rejectedCanceledRequests: ServiceRequest[] = [];
  displayedColumns: string[] = ['id', 'description', 'siteName', 'status', 'date'];

  private serviceRequestApi = inject(ServiceRequestsApi);
  private assetsManagementApi = inject(AssetsManagementApi);
  private authStore = inject(AuthStoreService);
  public translate = inject(TranslateService);

  get currentProviderId(): string | number | null {
    return this.authStore.currentUserId;
  }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    const providerId = this.currentProviderId;
    if (!providerId) return;

    this.loading = true;
    this.error = null;

    forkJoin({
      requests: this.serviceRequestApi.getRequestsForProviderQuery(providerId as any),
      sites: this.assetsManagementApi.getSites()
    }).subscribe({
      next: (res) => {
        const allRequests = res.requests;
        const context = { sites: res.sites };
        const assembler = new ServiceRequestAssembler();

        this.rejectedCanceledRequests = allRequests
          .filter((r: any) => r.status === 'rejected' || r.status === 'canceled')
          .map((r: any) => assembler.toEntityFromResource(r, context));

        this.loading = false;
      },
      error: (e) => {
        this.error = 'Failed to load rejected/canceled services.';
        console.error(e);
        this.loading = false;
      }
    });
  }
}

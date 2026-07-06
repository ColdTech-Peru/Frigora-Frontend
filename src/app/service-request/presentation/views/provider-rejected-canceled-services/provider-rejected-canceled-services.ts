import {Component, OnInit, inject, ChangeDetectorRef} from '@angular/core';
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
import {map} from 'rxjs/operators';

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
  private cdr = inject(ChangeDetectorRef);

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
    this.cdr.markForCheck();

    this.serviceRequestApi.getRequestsForProviderQuery(providerId as any).subscribe({
      next: (requests: any) => {
        const allRequests = requests ?? [];

        if (!allRequests.length) {
          this.rejectedCanceledRequests = [];
          this.loading = false;
          this.cdr.markForCheck();
          return;
        }

        const ownerIds = [...new Set(allRequests.map((r: any) => r.requesterId))] as number[];

        forkJoin({
          sites: forkJoin(ownerIds.map(id => this.assetsManagementApi.getSitesByOwner(id))).pipe(
            map((results: any[]) => results.flat())
          ),

        }).subscribe({
          next: (ownerData: any) => {
            const context = {
              sites: ownerData.sites,
              equipments: ownerData.equipments
            };
            const assembler = new ServiceRequestAssembler();

            this.rejectedCanceledRequests = allRequests
              .filter((r: any) => r.status === 'rejected' || r.status === 'canceled')
              .map((r: any) => assembler.toEntityFromResource(r, context));

            this.loading = false;
            this.cdr.markForCheck();
          },
          error: (e) => {
            this.error = 'Failed to load owner data.';
            this.loading = false;
            this.cdr.markForCheck();
          }
        });
      },
      error: (e) => {
        this.error = 'Failed to load rejected/canceled services.';
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }
}

import {ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {firstValueFrom} from 'rxjs';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatChipsModule} from '@angular/material/chips';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {ServiceRequestsApi} from '../../../infrastructure/service-request-api';
import {IamApi} from '../../../../iam/infrastructure/iam-api';
import {MatIcon} from '@angular/material/icon';
import {TechniciansService} from '../../../../technician/infrastructure/technicians.service';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-intervention-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    DatePipe,
    MatIcon,
    TranslatePipe
  ],
  templateUrl: './intervention-detail.html',
  styleUrl: './intervention-detail.css'
})
export class InterventionDetailComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private api = inject(ServiceRequestsApi);
  private iamApi = inject(IamApi);
  private techniciansService = inject(TechniciansService);
  private cdr = inject(ChangeDetectorRef);

  intervention: any = null;
  technician: any = null;
  isLoading = false;

  async ngOnInit(): Promise<void> {
    await this.fetchData();
  }

  async fetchData(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('interventionId');
    if (!id) return;

    this.isLoading = true;
    this.cdr.markForCheck();

    try {
      const res: any = await firstValueFrom(this.api.getInterventionsDetailQuery(id));
      this.intervention = res.data ?? res;
      console.log('intervention:', this.intervention)
      if (this.intervention?.technicianId) {
        this.technician = await firstValueFrom(
          this.techniciansService.getTechnicianById(this.intervention.technicianId)
        );
      }

    } catch (error) {
      console.error('Failed to load intervention detail', error);
    } finally {
      this.isLoading = false;
      this.cdr.markForCheck();
    }
  }

  goBack(): void {
    this.router.navigate(['../..'], { relativeTo: this.route });
  }

  getStatusLabel(status: string): string {
    return status ? status.toLowerCase() : '';
  }
}

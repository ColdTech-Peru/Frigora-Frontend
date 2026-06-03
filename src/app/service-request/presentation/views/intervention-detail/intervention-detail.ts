import {ChangeDetectorRef, Component, OnInit, inject} from '@angular/core';
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
    MatIcon
  ],
  templateUrl: './intervention-detail.html',
  styleUrl: './intervention-detail.css'
})
export class InterventionDetailComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private api = inject(ServiceRequestsApi);
  private iamApi = inject(IamApi);
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

      if (this.intervention?.technicianId) {
        const users: any = await firstValueFrom(this.iamApi.getAllUsers());
        this.technician = users.find((u: any) => u.id === this.intervention.technicianId) ?? null;
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

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ServiceRequestsApi } from '../../../infrastructure/service-request-api';
import { IamApi } from '../../../../iam/infrastructure/iam-api';
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

  intervention: any = null;
  technician: any = null;
  isLoading = false;

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    const id = this.route.snapshot.paramMap.get('interventionId');

    if (!id) return;

    this.isLoading = true;

    this.api.getInterventionsDetailQuery(id).subscribe({
      next: (res: any) => {
        this.intervention = res.data ?? res;

        if (this.intervention?.technicianId) {
          this.iamApi.getAllUsers().subscribe({
            next: (users: any) => {
              this.technician =
                users.find((u: any) => u.id === this.intervention.technicianId) ?? null;

              this.isLoading = false;
            },
            error: () => {
              this.isLoading = false;
            }
          });
        } else {
          this.isLoading = false;
        }
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/provider/services']);
  }

  getStatusLabel(status: string): string {
    return status ? status.toLowerCase() : '';
  }
}

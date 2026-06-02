// src/app/technician-management/presentation/views/technician-management/technician-management.component.ts

import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from '@angular/material/dialog';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatNoDataRow, MatRow, MatRowDef,
  MatTable
} from '@angular/material/table';
import { DecimalPipe } from '@angular/common';
import { Technician } from '../domain/model/technician.entity';
import { TechniciansService } from '../infrastructure/technicians.service';
import { FeedbackApiService } from '../../feedback/infrastructure/feedback-api.service';
import { AuthApiEndpoint } from '../../iam/infrastructure/auth-api';
import { AuthStoreService } from '../../iam/application/iam.store';

@Component({
  selector: 'app-technician-management',
  templateUrl: './technician-management.component.html',
  imports: [
    TranslatePipe,
    MatCard,
    MatCardTitle,
    MatCardHeader,
    MatCardContent,
    FormsModule,
    MatFormField,
    MatLabel,
    MatError,
    MatButton,
    MatInput,
    MatIcon,
    MatProgressSpinner,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCell,
    MatCellDef,
    DecimalPipe,
    MatIconButton,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatNoDataRow,
    MatDialogContent,
    MatDialogTitle,
    MatDialogActions,
    MatDialogClose
  ],
  styleUrls: ['./technician-management.component.css']
})
export class TechnicianManagementComponent implements OnInit {
  loading: boolean = false;
  submitting: boolean = false;

  // Columnas para Angular Material Table
  displayedColumns: string[] = ['name', 'specialty', 'phone', 'averageRating', 'actions'];
  technicians: Technician[] = [];

  newTechnician = { name: '', specialty: '', phone: '' };
  editableTechnician: Technician | null = null;
  technicianToDelete: Technician | null = null;

  // Referencias a los templates de los diálogos en el HTML
  @ViewChild('editDialog') editDialogTemplate!: TemplateRef<any>;
  @ViewChild('confirmDialog') confirmDialogTemplate!: TemplateRef<any>;

  constructor(
    private techniciansService: TechniciansService,
    private reviewsService: FeedbackApiService,
    private authService: AuthStoreService,
    private dialog: MatDialog,
    public translate: TranslateService
  ) {}

  get currentProviderId(): string | number | null {
    return this.authService.currentUserId;
  }

  ngOnInit(): void {
    this.fetchTechnicians();
  }

  fetchTechnicians(): void {
    if (!this.currentProviderId) return;

    this.loading = true;

    forkJoin({
      techs: this.techniciansService.getTechniciansByProvider(this.currentProviderId),
      reviews: this.reviewsService.getAllReviews()
    }).subscribe({
      next: (responses) => {
        const allTechnicians = responses.techs;
        const allReviews = responses.reviews;

        this.technicians = allTechnicians.map((techData: any) => {
          const techReviews = allReviews.filter((review: any) => review.technicianId === techData.id);
          const totalRating = techReviews.reduce((sum: number, review: any) => sum + review.rating, 0);
          const averageRating = techReviews.length > 0 ? totalRating / techReviews.length : 0;
          return new Technician({ ...techData, averageRating });
        });
      },
      error: (e) => console.error('Error cargando técnicos.', e),
      complete: () => this.loading = false
    });
  }

  registerTechnician(formDirective: any): void {
    if (!this.newTechnician.name || !this.newTechnician.specialty) return;

    this.submitting = true;
    const dataToSend = { ...this.newTechnician, providerId: this.currentProviderId };

    this.techniciansService.createTechnician(dataToSend).subscribe({
      next: () => {
        this.newTechnician = { name: '', specialty: '', phone: '' };
        formDirective.resetForm(); // Limpia el estado de errores de Material
        this.fetchTechnicians();
      },
      error: (e) => console.error('Error registrando técnico.', e),
      complete: () => this.submitting = false
    });
  }

  openEditDialog(technician: Technician): void {
    this.editableTechnician = { ...technician };
    this.dialog.open(this.editDialogTemplate, {
      width: '400px'
    });
  }

  saveTechnician(): void {
    if (!this.editableTechnician || !this.editableTechnician.id) return;

    this.submitting = true;
    this.techniciansService.updateTechnician(this.editableTechnician.id, this.editableTechnician).subscribe({
      next: () => {
        this.dialog.closeAll();
        this.fetchTechnicians();
      },
      error: (e) => console.error('Error actualizando técnico.', e),
      complete: () => this.submitting = false
    });
  }

  openConfirmDelete(technician: Technician): void {
    this.technicianToDelete = technician;
    this.dialog.open(this.confirmDialogTemplate, {
      width: '350px'
    });
  }

  confirmDelete(): void {
    if (this.technicianToDelete?.id) {
      this.techniciansService.deleteTechnician(this.technicianToDelete.id).subscribe({
        next: () => {
          this.dialog.closeAll();
          this.fetchTechnicians();
        },
        error: (e) => console.error('Error eliminando técnico.', e)
      });
    }
  }
}

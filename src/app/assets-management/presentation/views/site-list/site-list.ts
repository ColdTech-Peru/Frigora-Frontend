import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AssetsManagementStore } from '../../../application/assets-management.store';

@Component({
  selector: 'app-site-list',
  imports: [CommonModule,
    CommonModule,
    RouterModule,
    FormsModule,
    TranslateModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule
  ],
  templateUrl: './site-list.html',
  styleUrl: './site-list.css',
})
export class SiteList {
  public store = inject(AssetsManagementStore);
  private translate = inject(TranslateService);
  private dialog = inject(MatDialog);

  displayedColumns: string[] = ['name', 'address', 'contactName', 'phone', 'actions'];
  dialogRef?: MatDialogRef<any>;

  @ViewChild('newSiteDialog') newSiteDialogTemplate!: TemplateRef<any>;

  // Objeto simplificado sin latitud, longitud, ni ownerId
  newSite = {
    name: '',
    address: '',
    contactName: '',
    phone: ''
  };

  openNewSiteDialog() {
    // Limpiamos el formulario
    this.newSite = {
      name: '',
      address: '',
      contactName: '',
      phone: ''
    };

    // Abrimos el modal
    this.dialogRef = this.dialog.open(this.newSiteDialogTemplate, {
      width: '50vw',
      disableClose: true
    });
  }

  saveNewSite() {
    if (!this.newSite.name || !this.newSite.address || !this.newSite.contactName || !this.newSite.phone) {
      alert(this.translate.instant('sites.new.alert-required-fields'));
      return;
    }

    try {
      this.store.addSite(this.newSite as any);
      alert(this.translate.instant('sites.new.alert-site-created'));
      this.closeDialog();
    } catch (error) {
      alert(this.translate.instant('sites.new.alert-create-error'));
      console.error('Error creating site:', error);
    }
  }

  closeDialog() {
    this.dialogRef?.close();
  }

}

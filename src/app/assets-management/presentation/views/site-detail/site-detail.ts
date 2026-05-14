import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AssetsManagementStore } from '../../../application/assets-management.store';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-site-detail',
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    MatTableModule,
    MatButtonModule],
  templateUrl: './site-detail.html',
  styleUrl: './site-detail.css',
})
export class SiteDetail {
  public store = inject(AssetsManagementStore);
  // Definimos las columnas que se renderizarán en la tabla de Material
  displayedColumns: string[] = ['contactName', 'phone', 'created', 'updated'];
}

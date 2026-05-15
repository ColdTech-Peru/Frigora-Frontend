import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AssetsManagementStore } from '../../../application/assets-management.store';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-site-detail',
  // This is a standalone component so it can be lazy-loaded via loadComponent
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    MatTableModule,
    MatButtonModule],
  templateUrl: './site-detail.html',
  styleUrls: ['./site-detail.css'],
})
export class SiteDetail {
  public store = inject(AssetsManagementStore);
  // Definimos las columnas que se renderizarán en la tabla de Material
  displayedColumns: string[] = ['contactName', 'phone', 'created', 'updated'];
}

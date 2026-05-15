import { Component, effect, inject, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';

import { ServiceRequestStore } from '../../../application/service-request-store';
import { ServiceRequest } from '../../../domain/model/service-request.entity';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * @component ServiceRequestListComponent
 * @description Displays the paginated and filterable list of service requests.
 * @author Alejandro Galindo
 */
@Component({
  selector: 'app-service-request-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDialogModule,
    MatPaginatorModule,
    MatSortModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatInputModule,
    TranslatePipe
  ],
  templateUrl: './service-request-list.html',
  styleUrl: './service-request-list.css'
})
export class ServiceRequestListComponent implements OnInit, AfterViewInit {

  private readonly router = inject(Router);
  private readonly store = inject(ServiceRequestStore);
  private readonly snackBar = inject(MatSnackBar);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  /**
   * @description Loading state bound directly to the store signal.
   */
  readonly loading = this.store.loading;

  /**
   * @description Error message bound directly to the store signal.
   */
  readonly error = this.store.error;

  /**
   * @description Columns to display in the table.
   */
  readonly displayedColumns = [
    'orderNumber',
    'createdAt',
    'equipmentName',
    'siteName',
    'assignedToName',
    'type',
    'status',
    'actions'
  ];

  dataSource = new MatTableDataSource<ServiceRequest>([]);

  /**
   * @description Available status filter options.
   */
  readonly statusOptions = ['', 'pending', 'accepted', 'inProgress', 'completed', 'canceled', 'rejected'];

  /**
   * @description Available type filter options.
   */
  readonly typeOptions = ['', 'corrective', 'preventive'];

  selectedStatus = '';
  selectedType = '';

  constructor() {
    /**
     * @description Reactive effect that re-applies filters whenever
     * the store updates its service requests signal.
     * Ensures enriched fields (equipmentName, siteName) are
     * reflected in the table after the forkJoin completes.
     */
    effect(() => {
      this.store.serviceRequests(); // track signal
      this.applyFilters();
    });
  }

  /**
   * @description Angular lifecycle hook.
   * Triggers the store to load all requests, equipments and sites in parallel.
   */
  ngOnInit(): void {
    this.store.loadAll();
  }

  /**
   * @description Angular lifecycle hook.
   * Binds paginator and sort to the table data source after view init.
   */
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /**
   * @description Reads requests from the store, assigns order numbers,
   * applies active filters and updates the table data source.
   */
  applyFilters(): void {
    const requests = this.store.serviceRequests();

    let list = [...requests];

    list.sort(
      (a, b) =>
        new Date(a.createdAt as string).getTime() -
        new Date(b.createdAt as string).getTime()
    );

    list = list.map((req, index) => ({
      ...req,
      orderNumber: index + 1
    }));

    if (this.selectedStatus) {
      list = list.filter(r => r.status === this.selectedStatus);
    }

    if (this.selectedType) {
      list = list.filter(r => r.type === this.selectedType);
    }

    list.sort(
      (a, b) =>
        new Date(b.createdAt as string).getTime() -
        new Date(a.createdAt as string).getTime()
    );

    this.dataSource.data = list;
  }

  /**
   * @description Returns the CSS class for a given status chip.
   * @param status - The status string.
   */
  statusClass(status: string): string {
    const map: Record<string, string> = {
      pending: 'chip-pending',
      accepted: 'chip-accepted',
      inProgress: 'chip-in-progress',
      completed: 'chip-completed',
      canceled: 'chip-canceled',
      rejected: 'chip-rejected',
    };
    return map[status] ?? '';
  }

  /**
   * @description Formats a date value to a locale date string.
   * @param date - The date to format.
   */
  formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString();
  }

  /**
   * @description Returns whether a request can be canceled based on its status.
   * @param status - The current status of the request.
   */
  canCancel(status: string): boolean {
    return ['pending', 'accepted'].includes(status);
  }

  /**
   * @description Navigates to the new service request form.
   */
  navigateToNew(): void {
    this.router.navigate(['/services/new']);
  }

  /**
   * @description Navigates to the detail view of a service request.
   * @param request - The service request to view.
   */
  navigateToDetail(request: ServiceRequest): void {
    this.router.navigate(['/services', request.id]);
  }
}

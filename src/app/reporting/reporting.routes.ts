import { Routes } from '@angular/router';

export const REPORTING_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./presentation/report-list/report-list')
        .then(m => m.ReportsListComponent)
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./presentation/report-form/report-form')
        .then(m => m.ReportFormComponent)
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./presentation/report-detail/report-detail')
        .then(m => m.ReportDetailComponent)
  }
];

export class Reporting {
}

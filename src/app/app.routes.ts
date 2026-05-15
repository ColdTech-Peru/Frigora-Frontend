import { Routes } from '@angular/router';
import { monitoringRoutes } from './monitoring/presentation/monitoring-routes';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'equipments',
    pathMatch: 'full'
  },

  ...monitoringRoutes,

  {
    path: 'reporting',
    loadChildren: () =>
      import('./reporting/reporting.routes')
        .then(m => m.REPORTING_ROUTES)
  },

  {
    path: 'services',
    loadChildren: () =>
      import('./service-request/presentation/service-request-routes')
        .then(m => m.serviceRequestsRoutes)
  },

  {
    path: '**',
    redirectTo: 'equipments'
  }
];
import { Routes } from '@angular/router';
import { dashboardRoutes } from './dashboard/presentation/dashboard.routes';
import { monitoringRoutes } from './monitoring/presentation/monitoring-routes';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },

  ...monitoringRoutes,

  {
    path: 'dashboard',
    children: dashboardRoutes
  },

  {
    path: 'reporting',
    loadChildren: () =>
      import('./reporting/reporting.routes')
        .then(m => m.REPORTING_ROUTES)
  },

  {
    path: 'sites',
    loadChildren: () =>
      import('./assets-management/presentation/assets-management-routes')
        .then(m => m.assetsManagementRoutes)
  },

  {
    path: 'services',
    loadChildren: () =>
      import('./service-request/presentation/service-request-routes')
        .then(m => m.serviceRequestsRoutes)
  },

  {
    path: '**',
    redirectTo: 'dashboard'
  }
];

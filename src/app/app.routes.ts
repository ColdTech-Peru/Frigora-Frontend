import { Routes } from '@angular/router';

export const routes: Routes = [
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
  }
];

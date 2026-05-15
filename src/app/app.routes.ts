import { Routes } from '@angular/router';
import { Layout } from './shared/presentation/components/layout/layout';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      {
        path: 'reporting',
        loadChildren: () =>
          import('./reporting/reporting.routes')
            .then(m => m.REPORTING_ROUTES)
      }
    ]
  },

  {
    path: 'services',
    loadChildren: () =>
      import('./service-request/presentation/service-request-routes')
        .then(m => m.serviceRequestsRoutes)
  }
];
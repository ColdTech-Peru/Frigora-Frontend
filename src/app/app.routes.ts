import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'services',
    loadChildren: () =>
      import('./service-request/presentation/service-request-routes')
        .then(m => m.serviceRequestsRoutes)
  }
];

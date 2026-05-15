import { Routes } from '@angular/router';

export const serviceRequestsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () => import('./views/service-request-list/service-request-list').then(m => m.ServiceRequestListComponent),
        data: { titleKey: 'services.requests.title', roleRequired: 'owner' }
      },
      {
        path: 'new',
        loadComponent: () => import('./views/service-request-new/service-request-new').then(m => m.ServiceRequestNewComponent),
        data: { titleKey: 'services.requests.new', roleRequired: 'owner' }
      },
      {
        path: ':requestId',
        loadComponent: () => import('./views/service-request-detail/service-request-detail').then(m => m.ServiceRequestDetailComponent),
        data: { titleKey: 'services.requests.detail' }
      },
    ]
  }
];

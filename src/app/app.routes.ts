import { Routes } from '@angular/router';
import { authRoutes } from './iam/presentation/auth-routes';
import { dashboardRoutes } from './dashboard/presentation/dashboard.routes';
import { monitoringRoutes } from './monitoring/presentation/monitoring-routes';
import { adminRoutes } from './iam/presentation/admin-routes';
import { Layout } from './shared/presentation/components/layout/layout';
import {roleGuard} from './iam/application/role.guard';

export const routes: Routes = [
  { path: 'login', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: 'register', redirectTo: 'auth/register', pathMatch: 'full' },
  { path: 'auth', children: authRoutes, data: { public: true } },

  {
    path: '',
    component: Layout,
    children: [
      { path: '', redirectTo: 'provider/dashboard', pathMatch: 'full' },

      // --- OWNER ROUTES ---
      { path: 'dashboard', children: dashboardRoutes, data: { roleRequired: 'Owner' }, canActivate: [roleGuard] },
      { path: 'admin', children: adminRoutes, data: { roleRequired: 'Owner' }, canActivate: [roleGuard] },
      {
        path: 'sites',
        loadChildren: () => import('./assets-management/presentation/assets-management-routes').then(m => m.assetsManagementRoutes),
        data: { roleRequired: 'Owner' },
        canActivate: [roleGuard]
      },
      {
        path: 'reporting',
        loadChildren: () => import('./reporting/reporting.routes').then(m => m.REPORTING_ROUTES),
        data: { roleRequired: 'Owner' },
        canActivate: [roleGuard]
      },
      ...monitoringRoutes.map(r => ({
        ...r,
        data: { ...r.data, roleRequired: 'Owner' },
        canActivate: [roleGuard]
      })),
      {
        path: 'services',
        loadChildren: () => import('./service-request/presentation/service-request-routes').then(m => m.serviceRequestsRoutes),
        data: { roleRequired: 'Owner' },
        canActivate: [roleGuard]
      },

      // --- PROVIDER ROUTES ---
      {
        path: 'provider/dashboard',
        loadComponent: () => import('./service-request/presentation/views/provider-dashboard/provider-dashboard').then(m => m.ProviderDashboardComponent),
        data: { roleRequired: 'Provider' },
        canActivate: [roleGuard]
      },
      {
        path: 'provider/services',
        loadComponent: () => import('./service-request/presentation/views/provider-service-list/provider-service-list').then(m => m.ProviderServiceListComponent),
        data: { roleRequired: 'Provider' },
        canActivate: [roleGuard]
      },
      {
        path: 'provider/services-hub',
        loadComponent: () => import('./service-request/presentation/views/provider-services-hub/provider-services-hub').then(m => m.ProviderServicesHubComponent),
        data: { roleRequired: 'Provider' },
        canActivate: [roleGuard]
      },
      {
        path: 'provider/services/completed',
        loadComponent: () => import('./service-request/presentation/views/complete-service/complete-service').then(m => m.ProviderCompletedServicesComponent),
        data: { roleRequired: 'Provider' },
        canActivate: [roleGuard]
      },
      {
        path: 'provider/services/rejected-canceled',
        loadComponent: () => import('./service-request/presentation/views/provider-rejected-canceled-services/provider-rejected-canceled-services').then(m => m.ProviderRejectedCanceledServicesComponent),
        data: { roleRequired: 'Provider' },
        canActivate: [roleGuard]
      },
      {
        path: 'provider/technicians',
        loadComponent: () => import('./technician/presentation/technician-management.component').then(m => m.TechnicianManagementComponent),
        data: { roleRequired: 'Provider' },
        canActivate: [roleGuard]
      },
      {
        path: 'provider/services/in-progress',
        loadComponent: () => import('./service-request/presentation/views/in-progress-services/in-progress-services').then(m => m.InProgressServicesComponent),
        data: { roleRequired: 'Provider' },
        canActivate: [roleGuard]
      },
      {
        path: 'provider/services/:requestId',
        loadComponent: () =>
          import('./service-request/presentation/views/service-request-detail/service-request-detail')
            .then(m => m.ServiceRequestDetailComponent),
        data: { roleRequired: 'Provider' },
        canActivate: [roleGuard]
      },
      {
        path: 'provider/services/:requestId/interventions/:interventionId',
        loadComponent: () =>
          import('./service-request/presentation/views/intervention-detail/intervention-detail')
            .then(m => m.InterventionDetailComponent),
        data: { roleRequired: 'Provider' },
        canActivate: [roleGuard]
      }
    ]
  },

  { path: '**', redirectTo: 'auth/login' }
];

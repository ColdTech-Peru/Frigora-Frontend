import { Routes } from '@angular/router';
import { monitoringRoutes } from './monitoring/presentation/monitoring-routes';

// IMPORTANTE: Importa tu componente Layout (ajusta la ruta según tu proyecto)
import { Layout } from './shared/presentation/components/layout/layout';

export const routes: Routes = [
  // ----------------------------------------------------
  // 1. RUTAS PÚBLICAS (A pantalla completa, SIN layout)
  // ----------------------------------------------------
  {
    path: 'auth',
    loadChildren: () =>
      import('./iam/presentation/auth-routes')
        .then(m => m.authRoutes)
  },

  // ----------------------------------------------------
  // 2. RUTAS PRIVADAS (Envueltas dentro de app-layout)
  // ----------------------------------------------------
  {
    path: '',
    component: Layout, // <--- Aquí inyectamos tu Layout con el Header/Sidebar
    // canActivate: [authGuard], <-- Descoméntalo después para proteger todo
    children: [
      {
        path: '',
        redirectTo: 'equipments',
        pathMatch: 'full'
      },
      {
        path: 'admin',
        loadChildren: () =>
          import('./iam/presentation/admin-routes')
            .then(m => m.adminRoutes)
      },
      ...monitoringRoutes,
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
        redirectTo: 'equipments'
      }
    ]
  }
];

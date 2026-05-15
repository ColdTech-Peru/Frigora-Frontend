import { Routes } from '@angular/router';
import { Layout } from './shared/presentation/components/layout/layout';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [

      // AQUÍ AGREGAMOS LA RUTA PRINCIPAL DE SITIOS
      {
        path: 'sites',
        loadChildren: () =>
          import('./assets-management/presentation/assets-management-routes')
            .then(m => m.assetsManagementRoutes)
      }
    ]
  }
];

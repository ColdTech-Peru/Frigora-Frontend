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
    path: '**',
    redirectTo: 'equipments'
  }
];

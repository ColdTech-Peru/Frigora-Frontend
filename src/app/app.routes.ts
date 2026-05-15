import { Routes } from '@angular/router';
import { dashboardRoutes } from './dashboard/presentation/dashboard.routes';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },

  {
    path: 'dashboard',
    children: dashboardRoutes
  }
];

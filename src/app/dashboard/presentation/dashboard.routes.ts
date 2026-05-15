import { Routes } from '@angular/router';

const dashboard = () => import('./views/dashboard').then(m => m.DashboardView);

export const dashboardRoutes: Routes = [
  {
    path: '',
    loadComponent: dashboard
  }
];

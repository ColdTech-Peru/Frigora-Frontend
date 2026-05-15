import { Routes } from '@angular/router';

export const assetsManagementRoutes: Routes = [
  {
    path: '',
    // Se ejecuta al entrar a /sites
    loadComponent: () => import('./views/site-list/site-list').then(m => m.SiteList),
  },
  {
    path: ':id',
    // Se ejecuta al entrar a /sites/123
    loadComponent: () => import('./views/site-detail/site-detail').then(m => m.SiteDetail),
  }
];

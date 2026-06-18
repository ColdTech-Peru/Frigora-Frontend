import { Routes } from '@angular/router';

export const assetsManagementRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./views/site-list/site-list').then(m => m.SiteList),
  },
  {
    path: ':id',
    loadComponent: () => import('./views/site-detail/site-detail').then(m => m.SiteDetail),
  }
];

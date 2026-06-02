import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
  {
    path: 'users',
    loadComponent: () =>
      import('./views/admin-users/admin-users').then(m => m.AdminUsers)
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./views/admin-settings/admin-settings').then(m => m.AdminSettings)
  },
  {
    path: '',
    redirectTo: 'users',
    pathMatch: 'full'
  }
];

import { Routes } from '@angular/router';
import { EquipmentListComponent } from './views/equipment-list/equipment-list.component';
import { EquipmentDetailComponent } from './views/equipment-detail/equipment-detail.component';
import { AlertsListComponent } from './views/alerts-list/alerts-list.component';

export const monitoringRoutes: Routes = [
  {
    path: 'equipments',
    component: EquipmentListComponent
  },
  {
    path: 'equipments/:id',
    component: EquipmentDetailComponent
  },
  {
    path: 'alerts',
    component: AlertsListComponent
  }
];

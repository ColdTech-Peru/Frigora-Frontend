import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { TranslatePipe } from '@ngx-translate/core';

import { MonitoringStore } from '../../../application/monitoring.store';
import { EquipmentsEntity } from '../../../domain/model/equipments.entity';

@Component({
  selector: 'app-equipment-list',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatePipe],
  templateUrl: './equipment-list.component.html',
  styleUrl: './equipment-list.component.css'
})
export class EquipmentListComponent implements OnInit {
  equipments$: Observable<EquipmentsEntity[]>;
  loading$: Observable<boolean>;

  constructor(private monitoringStore: MonitoringStore) {
    this.equipments$ = this.monitoringStore.equipments$;
    this.loading$ = this.monitoringStore.loading$;
  }

  ngOnInit(): void {
    this.monitoringStore.fetchEquipments();
  }

  deleteEquipment(id: number): void {
    const confirmDelete = confirm('¿Seguro que deseas eliminar este equipo?');

    if (confirmDelete) {
      this.monitoringStore.deleteEquipment(id);
    }
  }
}

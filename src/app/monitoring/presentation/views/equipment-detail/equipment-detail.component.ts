import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MonitoringStore } from '../../../application/monitoring.store';
import { EquipmentsEntity } from '../../../domain/model/equipments.entity';

@Component({
  selector: 'app-equipment-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './equipment-detail.component.html',
  styleUrl: './equipment-detail.component.css'
})
export class EquipmentDetailComponent implements OnInit {
  equipment: EquipmentsEntity | null = null;

  constructor(
    private route: ActivatedRoute,
    private monitoringStore: MonitoringStore
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.monitoringStore.fetchEquipmentById(id, equipment => {
        this.equipment = equipment;
      });
    }
  }
}

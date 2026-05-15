import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { MonitoringStore } from '../../../application/monitoring.store';

@Component({
  selector: 'app-equipment-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TranslatePipe],
  templateUrl: './equipment-form.html',
  styleUrl: './equipment-form.css'
})
export class EquipmentFormComponent {
  equipment = {
    equipmentId: '',
    name: '',
    model: '',
    type: '',
    serial: '',
    status: 'Operativo',
    manufacturer: '',
    installed: '',
    lastSeen: '',
    setPoint: 0,
    online: true,
    currentTemperature: 0,
    created: '',
    updated: ''
  };

  constructor(
    private monitoringStore: MonitoringStore,
    private router: Router
  ) {}

  saveEquipment(): void {
    const today = new Date().toISOString().split('T')[0];

    const newEquipment = {
      ...this.equipment,
      setPoint: Number(this.equipment.setPoint),
      currentTemperature: Number(this.equipment.currentTemperature),
      created: today,
      updated: today,
      lastSeen: this.equipment.lastSeen || today
    };

    this.monitoringStore.createEquipment(newEquipment, () => {
      this.router.navigate(['/equipments']);
    });
  }
}

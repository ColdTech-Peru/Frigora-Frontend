import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { MonitoringApiService } from '../infrastructure/monitoring-api.service';
import { EquipmentsEntity } from '../domain/model/equipments.entity';
import { AlertsEntity } from '../domain/model/alerts.entity';
import { EquipmentsAssembler } from '../infrastructure/equipments.assembler';
import { AlertsAssembler } from '../infrastructure/alerts.assembler';

@Injectable({
  providedIn: 'root'
})
export class MonitoringStore {
  private equipmentsSubject = new BehaviorSubject<EquipmentsEntity[]>([]);
  private alertsSubject = new BehaviorSubject<AlertsEntity[]>([]);
  private errorsSubject = new BehaviorSubject<string[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  equipments$ = this.equipmentsSubject.asObservable();
  alerts$ = this.alertsSubject.asObservable();
  errors$ = this.errorsSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();

  constructor(private monitoringApi: MonitoringApiService) {}

  fetchEquipments(): void {
    this.loadingSubject.next(true);

    this.monitoringApi.getEquipments().subscribe({
      next: response => {
        const equipments = EquipmentsAssembler.toEntitiesFromResponse(response);
        this.equipmentsSubject.next(equipments);
        this.loadingSubject.next(false);
      },
      error: () => {
        this.addError('No se pudieron cargar los equipos.');
        this.loadingSubject.next(false);
      }
    });
  }

  fetchEquipmentById(id: number, callback: (equipment: EquipmentsEntity | null) => void): void {
    this.monitoringApi.getEquipmentById(id).subscribe({
      next: response => {
        const equipment = EquipmentsAssembler.toEntityFromResource(response);
        callback(equipment);
      },
      error: () => {
        this.addError('No se pudo cargar el detalle del equipo.');
        callback(null);
      }
    });
  }

  createEquipment(equipment: any, callback: () => void): void {
    this.monitoringApi.createEquipment(equipment).subscribe({
      next: response => {
        const newEquipment = EquipmentsAssembler.toEntityFromResource(response);
        const currentEquipments = this.equipmentsSubject.value;
        this.equipmentsSubject.next([...currentEquipments, newEquipment]);
        callback();
      },
      error: () => {
        this.addError('No se pudo registrar el equipo.');
      }
    });
  }

  deleteEquipment(id: number): void {
    this.monitoringApi.deleteEquipment(id).subscribe({
      next: () => {
        const currentEquipments = this.equipmentsSubject.value;
        const updatedEquipments = currentEquipments.filter(equipment => equipment.id !== id);
        this.equipmentsSubject.next(updatedEquipments);
      },
      error: () => {
        this.addError('No se pudo eliminar el equipo.');
      }
    });
  }

  fetchAlerts(): void {
    this.loadingSubject.next(true);

    this.monitoringApi.getAlerts().subscribe({
      next: response => {
        const alerts = AlertsAssembler.toEntitiesFromResponse(response);
        this.alertsSubject.next(alerts);
        this.loadingSubject.next(false);
      },
      error: () => {
        this.addError('No se pudieron cargar las alertas.');
        this.loadingSubject.next(false);
      }
    });
  }

  deleteAlert(id: number): void {
    this.monitoringApi.deleteAlert(id).subscribe({
      next: () => {
        const currentAlerts = this.alertsSubject.value;
        const updatedAlerts = currentAlerts.filter(alert => alert.id !== id);
        this.alertsSubject.next(updatedAlerts);
      },
      error: () => {
        this.addError('No se pudo eliminar la alerta.');
      }
    });
  }

  acknowledgeAlert(alert: AlertsEntity): void {
    this.monitoringApi.acknowledgeAlert(alert.id, alert).subscribe({
      next: response => {
        const updatedAlert = AlertsAssembler.toEntityFromResource(response);
        const currentAlerts = this.alertsSubject.value;

        const updatedAlerts = currentAlerts.map(item =>
          item.id === updatedAlert.id ? updatedAlert : item
        );

        this.alertsSubject.next(updatedAlerts);
      },
      error: () => {
        this.addError('No se pudo reconocer la alerta.');
      }
    });
  }

  private addError(message: string): void {
    const currentErrors = this.errorsSubject.value;
    this.errorsSubject.next([...currentErrors, message]);
  }
}

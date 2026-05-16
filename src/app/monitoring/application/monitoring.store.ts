import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin } from 'rxjs';

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

    forkJoin({
      equipments: this.monitoringApi.getEquipments(),
      readings: this.monitoringApi.getReadings()
    }).subscribe({
      next: response => {
        const equipments = EquipmentsAssembler.toEntitiesFromResponse(
          response.equipments,
          response.readings
        );

        this.equipmentsSubject.next(equipments);
        this.loadingSubject.next(false);
      },
      error: () => {
        this.addError('No se pudieron cargar los equipos.');
        this.loadingSubject.next(false);
      }
    });
  }

  fetchEquipmentById(id: string, callback: (equipment: EquipmentsEntity | null) => void): void {
    forkJoin({
      equipment: this.monitoringApi.getEquipmentById(id),
      readings: this.monitoringApi.getReadingsByEquipmentId(id)
    }).subscribe({
      next: response => {
        const equipment = EquipmentsAssembler.toEntityFromResource(
          response.equipment,
          response.readings
        );

        callback(equipment);
      },
      error: () => {
        this.addError('No se pudo cargar el detalle del equipo.');
        callback(null);
      }
    });
  }

  createEquipment(equipment: any, callback: () => void): void {
    const newEquipment = {
      ...equipment,
      tenantId: equipment.tenantId ?? 't1',
      siteId: equipment.siteId ?? 's1',
      installedAt: equipment.installed,
      setpointC: Number(equipment.setPoint),
      lastSeenAt: equipment.lastSeen || new Date().toISOString(),
      powerState: equipment.online ? 'on' : 'off'
    };

    this.monitoringApi.createEquipment(newEquipment).subscribe({
      next: response => {
        const createdEquipment = EquipmentsAssembler.toEntityFromResource(response);
        const currentEquipments = this.equipmentsSubject.value;
        this.equipmentsSubject.next([...currentEquipments, createdEquipment]);
        callback();
      },
      error: () => {
        this.addError('No se pudo registrar el equipo.');
      }
    });
  }

  deleteEquipment(id: string): void {
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

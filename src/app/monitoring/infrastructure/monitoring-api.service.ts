import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MonitoringApiService {
  private equipmentsEndpoint = `${environment.apiBaseUrl}${environment.equipmentsEndpointPath}`;
  private alertsEndpoint = `${environment.apiBaseUrl}${environment.alertsEndpointPath}`;
  private readingsEndpoint = `${environment.apiBaseUrl}/readings`;

  constructor(private http: HttpClient) {}

  getEquipments(): Observable<any[]> {
    return this.http.get<any[]>(this.equipmentsEndpoint);
  }

  getEquipmentById(id: string): Observable<any> {
    return this.http.get<any>(`${this.equipmentsEndpoint}/${id}`);
  }

  createEquipment(equipment: any): Observable<any> {
    return this.http.post<any>(this.equipmentsEndpoint, equipment);
  }

  deleteEquipment(id: string): Observable<void> {
    return this.http.delete<void>(`${this.equipmentsEndpoint}/${id}`);
  }

  getReadings(): Observable<any[]> {
    return this.http.get<any[]>(this.readingsEndpoint);
  }

  getReadingsByEquipmentId(equipmentId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.readingsEndpoint}?equipmentId=${equipmentId}`);
  }

  getAlerts(): Observable<any[]> {
    return this.http.get<any[]>(this.alertsEndpoint);
  }

  deleteAlert(id: number): Observable<void> {
    return this.http.delete<void>(`${this.alertsEndpoint}/${id}`);
  }

  acknowledgeAlert(id: number, alert: any): Observable<any> {
    return this.http.patch<any>(`${this.alertsEndpoint}/${id}`, {
      ...alert,
      status: 'acknowledged'
    });
  }
}

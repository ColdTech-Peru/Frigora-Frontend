import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MonitoringApiService {
  private baseUrl = 'http://localhost:3000';

  private equipmentsEndpoint = `${this.baseUrl}/equipments`;
  private alertsEndpoint = `${this.baseUrl}/alerts`;

  constructor(private http: HttpClient) {}

  getEquipments(): Observable<any[]> {
    return this.http.get<any[]>(this.equipmentsEndpoint);
  }

  getEquipmentById(id: number): Observable<any> {
    return this.http.get<any>(`${this.equipmentsEndpoint}/${id}`);
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

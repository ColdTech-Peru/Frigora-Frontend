import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardApi {

  private readonly baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}


  getDashboardConfigByUser(userId: string | number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/dashboard-configs/user/${userId}`);
  }

  getAvailableCards(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/dashboard-configs/available-cards`);
  }

  getAlerts(tenantId?: string, equipmentId?: string): Observable<any[]> {
    let params = new HttpParams();
    if (tenantId) params = params.set('tenantId', tenantId);
    if (equipmentId) params = params.set('equipmentId', equipmentId);
    return this.http.get<any[]>(`${this.baseUrl}/alert`, { params });
  }

  getAlertById(id: string | number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/alert/${id}`);
  }

  acknowledgeAlert(id: string | number): Observable<any> {
    return this.http.patch(`${this.baseUrl}/alert/${id}/acknowledge`, {});
  }

  deleteAlert(id: string | number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/alert/${id}`);
  }
}

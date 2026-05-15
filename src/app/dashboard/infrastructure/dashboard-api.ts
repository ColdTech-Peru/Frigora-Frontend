import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardApi {

  private readonly baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  /**
   * Obtiene el snapshot del dashboard filtrado por tenantId.
   * json-server resolverá esto como: GET /dashboard?tenantId=t1
   */
  getSnapshotByTenant(tenantId: string): Observable<any[]> {
    const params = new HttpParams().set('tenantId', tenantId);
    return this.http.get<any[]>(`${this.baseUrl}/dashboard`, { params });
  }

  /**
   * Obtiene las alertas filtradas por tenantId.
   * json-server resolverá esto como: GET /alerts?tenantId=t1
   */
  getAlertsByTenant(tenantId: string): Observable<any[]> {
    const params = new HttpParams().set('tenantId', tenantId);
    return this.http.get<any[]>(`${this.baseUrl}/alerts`, { params });
  }
}


import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { DashboardSnapshotResponse, AlertResponse, EquipmentResponse, SiteResponse } from './dashboard-response';

@Injectable({
  providedIn: 'root'
})
export class DashboardApi {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getSnapshotByTenant(tenantId: string): Observable<DashboardSnapshotResponse[]> {
    const params = new HttpParams()
      .set('tenantId', tenantId)
      .set('_limit', '1');

    return this.http.get<DashboardSnapshotResponse[]>(`${this.baseUrl}/dashboard`, { params })
      .pipe(
        catchError(error => {
          console.error('[DashboardApi] Error fetching snapshot:', error);
          throw error;
        })
      );
  }

  getRecentAlerts(tenantId: string, limit: number = 5): Observable<AlertResponse[]> {
    const params = new HttpParams()
      .set('tenantId', tenantId)
      .set('_sort', 'createdAt')
      .set('_order', 'desc')
      .set('_limit', limit.toString());

    return this.http.get<AlertResponse[]>(`${this.baseUrl}/alerts`, { params })
      .pipe(
        catchError(error => {
          console.error('[DashboardApi] Error fetching alerts:', error);
          throw error;
        })
      );
  }

  getEquipmentsByIds(ids: string[]): Observable<EquipmentResponse[]> {
    if (!ids || ids.length === 0) {
      return of([]); // Retorna un observable con array vacío
    }

    let params = new HttpParams();
    ids.forEach(id => {
      params = params.append('id', id);
    });

    return this.http.get<EquipmentResponse[]>(`${this.baseUrl}/equipments`, { params })
      .pipe(
        catchError(error => {
          console.error('[DashboardApi] Error fetching equipments:', error);
          return of([]); // Emula el "return { data: [] }" de tu catch
        })
      );
  }

  getSitesByIds(ids: string[]): Observable<SiteResponse[]> {
    if (!ids || ids.length === 0) {
      return of([]);
    }

    let params = new HttpParams();
    ids.forEach(id => {
      params = params.append('id', id);
    });

    return this.http.get<SiteResponse[]>(`${this.baseUrl}/sites`, { params })
      .pipe(
        catchError(error => {
          console.error('[DashboardApi] Error fetching sites:', error);
          return of([]);
        })
      );
  }
}

// src/app/technician-management/infrastructure/technicians.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Technician } from '../domain/model/technician.entity';
import { environment } from '../../../environments/environment';
// Importa tu environment para la URL base (ej: environment.apiUrl)

@Injectable({
  providedIn: 'root'
})
export class TechniciansService {
  private basePath = `${environment.apiBaseUrl}/technicians`;

  constructor(private http: HttpClient) {}

  getTechniciansByProvider(providerId: string | number  ): Observable<any[]> {
    const params = new HttpParams().set('providerId', providerId.toString());
    return this.http.get<any[]>(this.basePath, { params });
  }

  createTechnician(resource: any): Observable<any> {
    return this.http.post<any>(this.basePath, resource);
  }

  updateTechnician(id: number, resource: any): Observable<any> {
    return this.http.put<any>(`${this.basePath}/${id}`, resource);
  }

  deleteTechnician(id: number): Observable<any> {
    return this.http.delete<any>(`${this.basePath}/${id}`);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { DashboardSnapshotApiEndpoint } from './dashboard-endpoint';
import { DashboardSnapshot } from '../domain/model/dashboard-snapshot.entity';

@Injectable({
  providedIn: 'root'
})
export class DashboardApi extends BaseApi {
  private readonly dashboardSnapshotEndpoint: DashboardSnapshotApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this.dashboardSnapshotEndpoint = new DashboardSnapshotApiEndpoint(
      http // endpoint constructs its own URL; TODO: reemplazar por environment
    );
  }

  getSnapshotByTenant(tenantId: string): Observable<DashboardSnapshot[]> {
    return this.dashboardSnapshotEndpoint.getByTenant(tenantId);
  }

  // TODO: Implementar endpoints para alerts, equipments y sites siguiendo el mismo patrón
}

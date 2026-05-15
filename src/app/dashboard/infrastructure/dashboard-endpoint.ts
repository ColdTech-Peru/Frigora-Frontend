import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { DashboardSnapshot } from '../domain/model/dashboard-snapshot.entity';
import { DashboardsResponse, DashboardResource } from './dashboard-response';
import { DashboardAssembler } from './dashboard-assembler';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

export class DashboardSnapshotApiEndpoint extends BaseApiEndpoint<
  DashboardSnapshot,
  DashboardResource,
  DashboardsResponse,
  DashboardAssembler
> {
  constructor(http: HttpClient) {
    super(http, 'http://localhost:3000/dashboard', new DashboardAssembler()); // TODO: usar environment
  }

  /**
   * Helper to get snapshots filtered by tenantId using a query parameter.
   * Returns the same shape as getAll but filtered by tenantId on the API side.
   */
  getByTenant(tenantId: string): Observable<DashboardSnapshot[]> {
    const url = `${this.endpointUrl}?tenantId=${encodeURIComponent(tenantId)}`;
    return this.http.get<DashboardsResponse | DashboardResource[]>(url).pipe(
      map(response => {
        if (Array.isArray(response)) {
          return response.map(resource => this.assembler.toEntityFromResource(resource as DashboardResource));
        }
        return this.assembler.toEntitiesFromResponse(response as DashboardsResponse);
      }),
      catchError(this.handleError('Failed to fetch dashboard snapshots by tenant'))
    );
  }
}


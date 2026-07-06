import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { Sites } from '../domain/model/sites.entity';
import { SitesResource, SitesResponse } from './sites-response';
import { SitesAssembler } from './sites-assembler';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export class SitesApiEndpoint extends BaseApiEndpoint<Sites, SitesResource, SitesResponse, SitesAssembler> {
  constructor(http: HttpClient) {
    super(http, environment.apiBaseUrl + environment.sitesEndpointPath, new SitesAssembler());
  }

  getByOwner(ownerId: number | string): Observable<Sites[]> {
    return this.http.get<Sites[]>(`${this.resourcePath}/by-owner/${ownerId}`);
  }
}

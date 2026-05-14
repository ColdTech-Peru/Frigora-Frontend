import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { Sites } from '../domain/model/sites.entity';
import { SitesResource, SitesResponse } from './sites-response';
import { SitesAssembler } from './sites-assembler';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export class SitesApiEndpoint extends BaseApiEndpoint<Sites, SitesResource, SitesResponse, SitesAssembler>{
  constructor(http: HttpClient) {
    super(http, environment.ProviderApiBaseUrl + environment.ProviderSitesEndpointPath, new SitesAssembler());
  }
}

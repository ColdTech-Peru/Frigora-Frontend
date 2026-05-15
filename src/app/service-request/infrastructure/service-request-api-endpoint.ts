import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { ServiceRequest } from '../domain/model/service-request.entity';
import { ServiceRequestResource, ServiceRequestsResponse } from './service-request-response';
import { ServiceRequestAssembler } from './service-request-assembler';

/**
 * API endpoint for managing service requests.
 */
export class ServiceRequestsApiEndpoint extends BaseApiEndpoint<
  ServiceRequest,
  ServiceRequestResource,
  ServiceRequestsResponse,
  ServiceRequestAssembler
> {
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.apiBaseUrl}${environment.serviceRequestsEndpointPath}`,
      new ServiceRequestAssembler()
    );
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BaseApi } from '../../shared/infrastructure/base-api';
import { ServiceRequest } from '../domain/model/service-request.entity';
import { ServiceRequestsApiEndpoint } from './service-request-api-endpoint';
import { environment } from '../../../environments/environment';

const interventionsPath =
  `${environment.apiBaseUrl}${environment.interventionsEndpointPath}`;

/**
 * @class ServiceRequestsApi
 * @description A class for interacting with the service requests API.
 * @extends BaseApi
 * @author Alejandro Galindo
 */
@Injectable({ providedIn: 'root' })
export class ServiceRequestsApi extends BaseApi {

  private readonly servicesEndpoint: ServiceRequestsApiEndpoint;

  constructor(protected http: HttpClient) {
    super();
    this.servicesEndpoint = new ServiceRequestsApiEndpoint(http);
  }

  /**
   * @description Send a command to create a new service request.
   * @param command - The new request command.
   */
  sendNewRequestCommand(command: object): Observable<ServiceRequest> {
    return this.servicesEndpoint.create(command as ServiceRequest);
  }

  /**
   * @description Send a command to cancel a service request.
   * @param requestId - The ID of the request to cancel.
   */
  sendCancelRequestCommand(requestId: string | number): Observable<object> {
    return this.http.patch(
      `${this.servicesEndpoint.resourcePath}/${requestId}/cancel`, {}
    );
  }

  /**
   * @description Send a command to delete a service request permanently.
   * Uses the base endpoint delete method which performs a DELETE HTTP request.
   * @param requestId - The ID of the request to delete.
   */
  sendDeleteRequestCommand(requestId: string | number): Observable<void> {
    return this.servicesEndpoint.delete(requestId);
  }

  /**
   * @description Send a command to record a new intervention.
   * @param command - The new intervention command payload.
   */
  sendRecordInterventionCommand(command: object): Observable<object> {
    return this.http.post(interventionsPath, command);
  }

  /**
   * @description Retrieves all service requests.
   */
  getAllServiceRequestsQuery(): Observable<ServiceRequest[]> {
    return this.servicesEndpoint.getAll();
  }

  /**
   * @description Retrieves a service request by ID.
   * @param requestId - The service request ID.
   */
  getServiceRequestDetailsQuery(requestId: string | number): Observable<ServiceRequest> {
    return this.servicesEndpoint.getById(requestId);
  }

  /**
   * @description Get all interventions for a specific service request.
   * @param serviceRequestId - The ID of the service request.
   */
  getInterventionsByRequestQuery(serviceRequestId: string | number): Observable<object> {
    return this.http.get(`${interventionsPath}?serviceRequestId=${serviceRequestId}`);
  }
}

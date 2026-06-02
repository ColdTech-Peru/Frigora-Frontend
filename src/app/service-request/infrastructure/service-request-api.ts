import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ServiceRequestsApi extends BaseApi {

  private readonly basePath = `${environment.apiBaseUrl}/service-requests`;
  private readonly interventionsPath = `${environment.apiBaseUrl}/interventions`;

  constructor(protected http: HttpClient) {
    super();
  }

  sendNewRequestCommand(command: object): Observable<any> {
    return this.http.post(this.basePath, command);
  }

  sendAcceptRequestCommand(requestId: string | number): Observable<any> {
    return this.http.patch(`${this.basePath}/${requestId}/accept`, {});
  }

  sendRejectRequestCommand(requestId: string | number): Observable<any> {
    return this.http.patch(`${this.basePath}/${requestId}/reject`, {});
  }

  sendCancelRequestCommand(requestId: string | number): Observable<any> {
    return this.http.patch(`${this.basePath}/${requestId}/cancel`, {});
  }

  sendAssignTechnicianCommand(requestId: string | number, technicianId: string | number): Observable<any> {
    return this.http.patch(`${this.basePath}/${requestId}/assign-technician`, { technicianId });
  }

  sendCompleteRequestCommand(requestId: string | number): Observable<any> {
    return this.http.patch(`${this.basePath}/${requestId}/complete`, {});
  }

  // ==========================================
  // SERVICE REQUESTS - QUERIES
  // ==========================================

  getAllServiceRequestsQuery(): Observable<any[]> {
    return this.http.get<any[]>(this.basePath);
  }

  getServiceRequestDetailsQuery(requestId: string | number): Observable<any> {
    return this.http.get(`${this.basePath}/${requestId}`);
  }

  getRequestsByRequesterQuery(requesterId: string | number): Observable<any[]> {
    return this.http.get<any[]>(`${this.basePath}/requester/${requesterId}`);
  }

  getRequestsForProviderQuery(providerId: string | number): Observable<any[]> {
    return this.http.get<any[]>(`${this.basePath}/provider/${providerId}`);
  }


  sendRecordInterventionCommand(command: object): Observable<any> {
    return this.http.post(this.interventionsPath, command);
  }


  getInterventionsByRequestQuery(serviceRequestId: string | number): Observable<any[]> {
    return this.http.get<any[]>(`${this.interventionsPath}/serviceRequest/${serviceRequestId}`);
  }

  getInterventionByIdQuery(interventionId: string | number): Observable<any> {
    return this.http.get(`${this.interventionsPath}/${interventionId}`);
  }
}

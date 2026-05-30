import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { User } from '../domain/model/user.entity';
import { UserResource, UserResponse } from './user-response';
import { UserAssembler } from './user-assembler';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserApiEndpoint extends BaseApiEndpoint<User, UserResource, UserResponse, UserAssembler> {

  constructor(http: HttpClient) {
    super(http, `${environment.apiBaseUrl}${environment.usersEndpointPath}`, new UserAssembler());
  }

  getUsersByTenant(tenantId: string): Observable<User[]> {
    const params = new HttpParams().set('tenantId', tenantId);
    return this.http.get<UserResponse>(this.resourcePath, { params }).pipe(
      map((response) => this.assembler.toEntitiesFromResponse(response))
    );
  }

  getUsersByRole(role: string): Observable<User[]> {
    return this.http.get<UserResponse>(`${this.resourcePath}/role/${role}`).pipe(
      map((response) => this.assembler.toEntitiesFromResponse(response))
    );
  }
}

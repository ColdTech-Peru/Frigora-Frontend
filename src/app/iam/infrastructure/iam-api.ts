import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { User } from '../domain/model/user.entity';
import { UserApiEndpoint } from './user-api';
import { AuthApiEndpoint } from './auth-api';

@Injectable({ providedIn: 'root' })
export class IamApi extends BaseApi {
  private readonly userEndpoint: UserApiEndpoint;
  private readonly authEndpoint: AuthApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this.userEndpoint = new UserApiEndpoint(http);
    this.authEndpoint = new AuthApiEndpoint(http);
  }

  // --- AUTH OPERATIONS ---

  login(username: string, password: string): Observable<any> {
    return this.authEndpoint.signIn(username, password);
  }

  register(userData: any): Observable<any> {
    return this.authEndpoint.signUp(userData);
  }

  // --- USER OPERATIONS ---

  getUsers(tenantId: string): Observable<User[]> {
    return this.userEndpoint.getUsersByTenant(tenantId);
  }

  getUsersByRole(role: string): Observable<User[]> {
    return this.userEndpoint.getUsersByRole(role);
  }

  /*updateUser(id: string, user: User): Observable<User> {
    return this.userEndpoint.update(id, user);
  }*/

  createUser(user: User): Observable<User> {
    return this.userEndpoint.create(user);
  }
}

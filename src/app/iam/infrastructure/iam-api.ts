import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { User } from '../domain/model/user.entity';
import { UserApiEndpoint } from './user-api';
import { AuthApiEndpoint } from './auth-api';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class IamApi extends BaseApi {
  private readonly userEndpoint: UserApiEndpoint;
  private readonly authEndpoint: AuthApiEndpoint;
  private http = inject(HttpClient);
  constructor(http: HttpClient) {
    super();
    this.userEndpoint = new UserApiEndpoint(http);
    this.authEndpoint = new AuthApiEndpoint(http);
  }

  login(username: string, password: string): Observable<any> {
    return this.authEndpoint.signIn(username, password);
  }

  register(userData: any): Observable<any> {
    return this.authEndpoint.signUp(userData);
  }

  getUsers(tenantId: string): Observable<User[]> {
    return this.userEndpoint.getUsersByTenant(tenantId);
  }

  getUsersByRole(role: string) {
    return this.http.get<any[]>(`${environment.apiBaseUrl}/users/role/${role}`);
  }
  /*updateUser(id: string, user: User): Observable<User> {
    return this.userEndpoint.update(id, user);
  }*/

  createUser(user: User): Observable<User> {
    return this.userEndpoint.create(user);
  }
  getAllUsers(): Observable<any> {
    return this.http.get(`${environment.apiBaseUrl}/users`);
  }
}

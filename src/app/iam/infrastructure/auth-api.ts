// iam-api.ts (Angular)
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthApiEndpoint {
  private readonly baseUrl: string;
  private readonly authPath = '/authentication';
  private readonly usersPath = '/users';

  constructor(private http: HttpClient) {
    this.baseUrl = environment.apiBaseUrl || 'http://localhost:8080/api/v1';
  }

  // --- AUTH ---

  signIn(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}${this.authPath}/sign-in`, {
      username,
      password
    });
  }

  signUp(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}${this.authPath}/sign-up`, userData);
  }

  // --- USERS ---

  getUsers(tenantId?: string): Observable<any> {
    return this.http.get(`${this.baseUrl}${this.usersPath}`, {
      params: tenantId ? { tenantId } : {}
    });
  }

  getUsersByRole(role: string): Observable<any> {
    return this.http.get(`${this.baseUrl}${this.usersPath}/role/${role}`);
  }

  updateUser(id: string | number, resource: any): Observable<any> {
    return this.http.put(`${this.baseUrl}${this.usersPath}/${id}`, resource);
  }
}

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';

export class AuthApiEndpoint {
  private readonly baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = environment.apiBaseUrl || 'http://localhost:3000';
  }

  signIn(username: string, password: string): Observable<any> {
    return this.http.get<any[]>(`${this.baseUrl}/users?username=${username}&password=${password}`).pipe(
      map(users => {
        if (users && users.length > 0) {
          return users[0];
        } else {
          throw { status: 401, error: { message: 'Usuario o contraseña incorrectos' } };
        }
      })
    );
  }

  signUp(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/users`, userData);
  }
}

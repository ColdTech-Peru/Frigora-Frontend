import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { IamApi } from '../infrastructure/iam-api';
import { UserAssembler } from '../infrastructure/user-assembler';
import { User } from '../domain/model/user.entity';

const roleMap: Record<number, string> = {
  0: 'owner',
  1: 'provider'
};

const getRoleAsString = (role: string | number): string => {
  return typeof role === 'number' ? (roleMap[role] || 'unknown') : role;
};

@Injectable({
  providedIn: 'root'
})
export class AuthStoreService {
  private iamApi = inject(IamApi);
  private userAssembler = new UserAssembler();

  private readonly tokenKey = 'token';

  private userSubject = new BehaviorSubject<User | null>(null);
  private tokenSubject = new BehaviorSubject<string | null>(localStorage.getItem(this.tokenKey));
  private errorsSubject = new BehaviorSubject<{ message: string }[]>([]);

  user$ = this.userSubject.asObservable();
  token$ = this.tokenSubject.asObservable();
  errors$ = this.errorsSubject.asObservable();

  constructor() {
    this.loadUserFromToken();
  }

  get currentUser(): User | null { return this.userSubject.value; }
  get currentToken(): string | null { return this.tokenSubject.value; }
  get isLoggedIn(): boolean { return !!this.currentToken && !!this.currentUser; }
  get currentTenantId(): string | null { return this.currentUser?.tenantId || null; }

  async login(username: string, password: string): Promise<boolean> {
    this.errorsSubject.next([]);
    try {
      const rawUser = await firstValueFrom(this.iamApi.login(username, password));

      if (!rawUser.token || !rawUser.id || !rawUser.username) {
        this.addError('Respuesta inválida del servidor de autenticación.');
        return false;
      }

      const userResource = {
        id: rawUser.id,
        tenantId: rawUser.tenantId || '',
        name: rawUser.name || rawUser.username,
        email: rawUser.username,
        role: getRoleAsString(rawUser.role),
        status: rawUser.status || 'active',
        phone: rawUser.phone || '',
        locale: rawUser.locale || 'es',
        timezone: rawUser.timezone || 'America/Lima',
        lastLoginAt: new Date().toISOString()
      };

      const entity = this.userAssembler.toEntityFromResource(userResource);
      this.userSubject.next(entity);
      this.tokenSubject.next(rawUser.token);

      localStorage.setItem(this.tokenKey, rawUser.token);
      localStorage.setItem('user', JSON.stringify(userResource));

      return true;
    } catch (error: any) {
      this.handleAuthError(error, 'Credenciales inválidas.');
      return false;
    }
  }

  async register(userData: any): Promise<boolean> {
    this.errorsSubject.next([]);
    try {
      const dataToSend = { ...userData, role: getRoleAsString(userData.role) };
      await firstValueFrom(this.iamApi.register(dataToSend));
      return true;
    } catch (error: any) {
      this.handleAuthError(error, 'Fallo en el registro de usuario.');
      return false;
    }
  }

  logout(): void {
    this.userSubject.next(null);
    this.tokenSubject.next(null);
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('user');
    this.errorsSubject.next([]);
  }

  private loadUserFromToken(): void {
    const storedToken = localStorage.getItem(this.tokenKey);
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        this.tokenSubject.next(storedToken);
        const parsedResource = JSON.parse(storedUser);
        parsedResource.role = getRoleAsString(parsedResource.role);
        this.userSubject.next(this.userAssembler.toEntityFromResource(parsedResource));
      } catch (e) {
        console.error("Error al restaurar sesión, limpiando localStorage.", e);
        this.logout();
      }
    }
  }

  private handleAuthError(error: any, defaultMsg: string): void {
    const status = error.status;
    let errorMessage = 'Ocurrió un error inesperado.';
    if (status === 400 || status === 401) {
      errorMessage = error.error?.message || defaultMsg;
    } else if (status === 500) {
      console.error("[Auth API Error 500]", error.error);
    }
    this.addError(errorMessage);
  }

  private addError(message: string): void {
    this.errorsSubject.next([...this.errorsSubject.value, { message }]);
  }
}

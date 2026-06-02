export interface UserParams {
  id?: string | null;
  tenantId?: string;
  name?: string;
  email?: string;
  role?: string;
  status?: string;
  phone?: string;
  locale?: string;
  timezone?: string;
  lastLoginAt?: string | null;
  password?: string;
}

export class User {
  id: string | null;
  tenantId: string;
  name: string;
  email: string;
  role: string;
  status: string;
  phone: string;
  locale: string;
  timezone: string;
  lastLoginAt: string | null;
  password?: string;

  constructor(params: UserParams = {}) {
    this.id = params.id || null;
    this.tenantId = params.tenantId || '';
    this.name = params.name || '';
    this.email = params.email || '';
    this.role = params.role || 'user';
    this.status = params.status || 'active';
    this.phone = params.phone || '';
    this.locale = params.locale || 'es';
    this.timezone = params.timezone || 'America/Lima';
    this.lastLoginAt = params.lastLoginAt || null;
    this.password = params.password || '';
  }

  get firstName(): string {
    return this.name.split(' ')[0] || '';
  }

  get lastName(): string {
    return this.name.split(' ').slice(1).join(' ') || '';
  }

  get displayName(): string {
    return this.name || this.email;
  }
}

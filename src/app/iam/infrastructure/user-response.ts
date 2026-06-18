export interface UserResource {
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
}

export interface UserResponse {
  users: UserResource[];
}

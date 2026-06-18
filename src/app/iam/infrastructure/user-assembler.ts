import { UserResource, UserResponse } from './user-response';
import { User } from '../domain/model/user.entity';

export class UserAssembler {

  toEntityFromResource(resource: UserResource): User {
    return new User({
      id: resource.id,
      tenantId: resource.tenantId,
      name: resource.name,
      email: resource.email,
      role: resource.role,
      status: resource.status,
      phone: resource.phone,
      locale: resource.locale,
      timezone: resource.timezone,
      lastLoginAt: resource.lastLoginAt,
      password: resource.password
    });
  }

  toResourceFromEntity(entity: User): UserResource {
    return {
      id: entity.id,
      tenantId: entity.tenantId,
      name: entity.name,
      email: entity.email,
      role: entity.role,
      status: entity.status,
      phone: entity.phone,
      locale: entity.locale,
      timezone: entity.timezone,
      lastLoginAt: entity.lastLoginAt,
      password: entity.password
    } as UserResource;
  }

  toEntitiesFromResponse(response: UserResponse): User[] {
    return response.users.map(resource => this.toEntityFromResource(resource as UserResource));
  }

}

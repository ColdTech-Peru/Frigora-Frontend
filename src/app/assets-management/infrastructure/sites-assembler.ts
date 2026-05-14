import { Sites } from '../domain/model/sites.entity';
import { SitesResource, SitesResponse } from './sites-response';

export class SitesAssembler{
  toEntityFromResource(resource: SitesResource): Sites {
    return new Sites({
      id: resource.id,
      name: resource.name,
      address: resource.address,
      contactName: resource.contactName,
      phone: resource.phone,
      created: resource.created,
      updated: resource.updated
    });
  }

  toResourceFromEntity(entity: Sites): SitesResource {
    return {
      id: entity.id,
      name: entity.name,
      address: entity.address,
      contactName: entity.contactName,
      phone: entity.phone,
      created: entity.created,
      updated: entity.updated
    } as SitesResource;
  }

  toEntitiesFromResponse(response: SitesResponse): Sites[] {
    return response.sites.map(resource => this.toEntityFromResource(resource as SitesResource));
  }

}

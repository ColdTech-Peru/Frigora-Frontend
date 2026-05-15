import { ServiceRequestResource, ServiceRequestsResponse } from './service-request-response';
import { ServiceRequest } from '../domain/model/service-request.entity';
import { BaseAssembler } from '../../shared/infrastructure/base-assembler';

/**
 * Assembler for converting between ServiceRequest entities, ServiceRequestResource resources,
 * and ServiceRequestsResponse.
 */
export class ServiceRequestAssembler implements BaseAssembler<ServiceRequest, ServiceRequestResource, ServiceRequestsResponse> {

  /**
   * Converts a ServiceRequestsResponse to an array of ServiceRequest entities.
   * @param response - The API response containing service requests.
   * @returns An array of ServiceRequest entities.
   */
  toEntitiesFromResponse(response: ServiceRequestsResponse): ServiceRequest[] {
    return response.serviceRequests.map(resource => this.toEntityFromResource(resource as ServiceRequestResource));
  }

  /**
   * Converts a ServiceRequestResource to a ServiceRequest entity.
   * @param resource - The resource to convert.
   * @returns The converted ServiceRequest entity.
   */
  toEntityFromResource(resource: ServiceRequestResource): ServiceRequest {
    return new ServiceRequest({
      id: resource.id,
      requesterId: resource.requesterId,
      siteId: resource.siteId,
      equipmentId: resource.equipmentId,
      assignedTo: resource.assignedTo,
      origin: resource.origin,
      type: resource.type,
      priority: resource.priority,
      description: resource.description,
      status: resource.status,
      createdAt: resource.createdAt,
      completedAt: resource.completedAt,
      canceledAt: resource.canceledAt,
      technicianId: resource.technicianId,
      interventions: resource.interventions ?? [],
    });
  }

  /**
   * Converts a ServiceRequest entity to a ServiceRequestResource.
   * @param entity - The entity to convert.
   * @returns The converted ServiceRequestResource.
   */
  toResourceFromEntity(entity: ServiceRequest): ServiceRequestResource {
    return {
      id: entity.id,
      requesterId: entity.requesterId,
      siteId: entity.siteId,
      equipmentId: entity.equipmentId,
      assignedTo: entity.assignedTo,
      origin: entity.origin,
      type: entity.type,
      priority: entity.priority,
      description: entity.description,
      status: entity.status,
      createdAt: entity.createdAt as string,
      completedAt: entity.completedAt as string | null,
      canceledAt: entity.canceledAt as string | null,
      technicianId: entity.technicianId as number | null,
      interventions: [],
    } as ServiceRequestResource;
  }
}

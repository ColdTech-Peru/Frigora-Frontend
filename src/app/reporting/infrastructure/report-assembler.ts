import  { ReportEntity } from '../domain/model/report.entity';
import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { ReportResource, ReportResponse } from './report-response';

export class ReportAssembler implements BaseAssembler< ReportEntity, ReportResource, ReportResponse> {

  toEntityFromResource(resource: ReportResource): ReportEntity {
    return new ReportEntity({
      id: resource.id,
      tenantId: resource.tenantId,
      equipmentId: resource.equipmentId,
      title: resource.title,
      type: resource.type,
      summary: resource.summary,
      content: resource.content,
      url: resource.url,
      status: resource.status,
      generatedAt: resource.generatedAt
    });
  }

  toResourceFromEntity(entity: ReportEntity): ReportResource {
    return {
      id: entity.id,
      tenantId: entity.tenantId,
      equipmentId: entity.equipmentId,
      title: entity.title,
      type: entity.type,
      summary: entity.summary,
      content: entity.content,
      url: entity.url,
      status: entity.status,
      generatedAt: entity.generatedAt
    } as ReportResource;
  }

  toEntitiesFromResponse(response: ReportResponse): ReportEntity[] {
    return response.categories.map(resource => this.toEntityFromResource(resource as ReportResource));
  }

}

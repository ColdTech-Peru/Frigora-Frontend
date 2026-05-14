import { Report } from '../domain/model/report.entity';

export class ReportAssembler {

  static toEntity(data: any): Report {
    return {
      id: data.id,
      tenantId: data.tenantId,
      equipmentId: data.equipmentId,
      title: data.title,
      type: data.type,
      summary: data.summary,
      content: data.content,
      url: data.url,
      status: data.status,
      generatedAt: data.generatedAt
    };
  }

  static toEntities(data: any[]): Report[] {
    return data.map(item => this.toEntity(item));
  }
}

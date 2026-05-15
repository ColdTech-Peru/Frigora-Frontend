export class ReportEntity {

  id: number;
  tenantId: number;
  equipmentId: number;
  title: string;
  type: string;
  summary: string;
  content: string;
  url: string;
  status: string;
  generatedAt: string;

  constructor(report: {
    id: number;
    tenantId: number;
    equipmentId: number;
    title: string;
    type: string;
    summary: string;
    content: string;
    url: string;
    status: string;
    generatedAt: string;
  }) {

    this.id = report.id;
    this.tenantId = report.tenantId;
    this.equipmentId = report.equipmentId;
    this.title = report.title;
    this.type = report.type;
    this.summary = report.summary;
    this.content = report.content;
    this.url = report.url;
    this.status = report.status;
    this.generatedAt = report.generatedAt;
  }
}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ReportEntity } from '../domain/model/report.entity';
import { ReportingApiService } from '../infrastructure/reporting-api.service';

@Injectable({
  providedIn: 'root'
})
export class ReportingService {

  constructor(private api: ReportingApiService) {}

  getReports(): Observable<ReportEntity[]> {
    return this.api.getReports();
  }

  getReportById(id: number): Observable<ReportEntity> {
    return this.api.getReportById(id);
  }

  createReport(report: ReportEntity): Observable<ReportEntity> {
    return this.api.createReport(report);
  }

  updateReport(id: number, report: ReportEntity): Observable<ReportEntity> {
    return this.api.updateReport(id, report);
  }

  deleteReport(id: number): Observable<void> {
    return this.api.deleteReport(id);
  }
}

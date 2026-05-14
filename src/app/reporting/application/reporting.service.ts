import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Report } from '../domain/model/report.entity';
import { ReportingApiService } from '../infrastructure/reporting-api.service';

@Injectable({
  providedIn: 'root'
})
export class ReportingService {

  constructor(private api: ReportingApiService) {}

  getReports(): Observable<Report[]> {
    return this.api.getReports();
  }

  getReportById(id: number): Observable<Report> {
    return this.api.getReportById(id);
  }

  createReport(report: Report): Observable<Report> {
    return this.api.createReport(report);
  }

  updateReport(id: number, report: Report): Observable<Report> {
    return this.api.updateReport(id, report);
  }

  deleteReport(id: number): Observable<void> {
    return this.api.deleteReport(id);
  }
}

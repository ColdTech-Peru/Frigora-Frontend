import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ReportEntity } from '../domain/model/report.entity';
import { API_ENDPOINTS } from './report-api-endpoint';


@Injectable({
  providedIn: 'root'
})
export class ReportingApiService {

  private apiUrl = API_ENDPOINTS.reports;

  constructor(private http: HttpClient) {}

  getReports(): Observable<ReportEntity[]> {
    return this.http.get<ReportEntity[]>(this.apiUrl);
  }

  getReportById(id: number): Observable<ReportEntity> {
    return this.http.get<ReportEntity>(`${this.apiUrl}/${id}`);
  }

  createReport(report: ReportEntity): Observable<ReportEntity> {
    return this.http.post<ReportEntity>(this.apiUrl, report);
  }

  updateReport(
    id: number,
    report: ReportEntity
  ): Observable<ReportEntity> {

    return this.http.put<ReportEntity>(
      `${this.apiUrl}/${id}`,
      report
    );
  }

  deleteReport(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

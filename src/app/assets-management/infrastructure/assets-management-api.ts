import { Injectable } from '@angular/core';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { SitesApiEndpoint } from './sites-api';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sites } from '../domain/model/sites.entity';

@Injectable({ providedIn: 'root' })
export class AssetsManagementApi extends BaseApi {
  private readonly sitesEndpoint: SitesApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this.sitesEndpoint = new SitesApiEndpoint(http);
  }

  getSites(): Observable<Sites[]> {
    return this.sitesEndpoint.getAll();
  }

  createSite(site: Sites): Observable<Sites> {
    return this.sitesEndpoint.create(site);
  }



}

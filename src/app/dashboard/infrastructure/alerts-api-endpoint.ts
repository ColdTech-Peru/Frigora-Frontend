import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { AlertView } from '../domain/model/alert-view.entity';
import { AlertsResponse, AlertResource } from './alert-response';
import { AlertAssembler } from './alert-assembler';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export class AlertsApiEndpoint extends BaseApiEndpoint<
  AlertView,
  AlertResource,
  AlertsResponse,
  AlertAssembler
> {
  constructor(http: HttpClient) {
    super(http, `${environment.apiBaseUrl}/alerts`, new AlertAssembler());
  }
}

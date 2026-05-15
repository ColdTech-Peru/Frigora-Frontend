import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { AlertView } from '../domain/model/alert-view.entity';
import { AlertsResponse, AlertResource } from './alert-response';
import { AlertAssembler } from './alert-assembler';
import { HttpClient } from '@angular/common/http';

export class AlertsApiEndpoint extends BaseApiEndpoint<
  AlertView,
  AlertResource,
  AlertsResponse,
  AlertAssembler
> {
  constructor(http: HttpClient) {
    super(http, 'http://localhost:3000/alerts', new AlertAssembler()); // TODO: usar environment
  }
}


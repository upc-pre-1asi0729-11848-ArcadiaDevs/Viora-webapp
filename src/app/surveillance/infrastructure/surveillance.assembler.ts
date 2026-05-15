import { HttpResponse } from '@angular/common/http';
import { Alert } from '../domain/model/alert.entity';
import { AlertAssembler, AlertResource } from './alert.assembler';

export class SurveillanceAssembler {
  static toAlerts(resources: AlertResource[] | AlertResource | null | undefined): Alert[] {
    return AlertAssembler.toEntities(resources);
  }

  static toAlertsFromResponse(response: HttpResponse<AlertResource[] | AlertResource>): Alert[] {
    return AlertAssembler.toEntitiesFromResponse(response);
  }
}

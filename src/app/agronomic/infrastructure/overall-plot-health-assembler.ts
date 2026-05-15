import {
  OverallPlotHealth,
  OverallPlotHealthStatus,
} from '../domain/model/overall-plot-health.entity';

import { OverallPlotHealthResource } from './resources/overall-plot-health.resource';

export class OverallPlotHealthAssembler {
  static toEntityFromResource(
    resource: OverallPlotHealthResource | null | undefined,
  ): OverallPlotHealth {
    return new OverallPlotHealth({
      status: this.toOverallPlotHealthStatus(resource?.status),
      healthyPlotsCount: resource?.healthyPlotsCount ?? 0,
      reviewPlotsCount: resource?.reviewPlotsCount ?? 0,
    });
  }

  static toEntitiesFromResources(resources: OverallPlotHealthResource[] = []): OverallPlotHealth[] {
    return resources.map((resource) => this.toEntityFromResource(resource));
  }

  private static toOverallPlotHealthStatus(value: string | undefined): OverallPlotHealthStatus {
    const validStatuses: OverallPlotHealthStatus[] = [
      'Healthy',
      'Warning',
      'Under Review',
      'Critical',
    ];

    return validStatuses.indexOf(value as OverallPlotHealthStatus) !== -1
      ? (value as OverallPlotHealthStatus)
      : 'Healthy';
  }
}

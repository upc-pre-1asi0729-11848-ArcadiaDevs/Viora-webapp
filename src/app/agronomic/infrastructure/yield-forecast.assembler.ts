import {
  YieldForecast,
  YieldRiskLevel
} from '../domain/model/yield-forecast.entity';

import { YieldForecastResource } from './resources/yield-forecast.resource';

export class YieldForecastAssembler {
  static toEntityFromResource(
    resource: YieldForecastResource | null | undefined
  ): YieldForecast {
    return new YieldForecast({
      id: resource?.id ?? null,
      plotId: resource?.plotId ?? null,
      tonnes: resource?.tonnes ?? 0,
      riskLevel: this.toYieldRiskLevel(resource?.riskLevel),
      description: resource?.description ?? ''
    });
  }

  static toEntitiesFromResources(
    resources: YieldForecastResource[] = []
  ): YieldForecast[] {
    return resources.map(resource => this.toEntityFromResource(resource));
  }

  private static toYieldRiskLevel(value: string | undefined): YieldRiskLevel {
    const validRiskLevels: YieldRiskLevel[] = ['Low', 'Medium', 'High'];

    return validRiskLevels.includes(value as YieldRiskLevel)
      ? value as YieldRiskLevel
      : 'Low';
  }
}

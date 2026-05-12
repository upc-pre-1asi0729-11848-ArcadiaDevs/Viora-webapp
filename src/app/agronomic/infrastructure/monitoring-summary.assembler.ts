import { MonitoringSummary } from '../domain/model/monitoring-summary.entity';

import { MonitoringSummaryResource } from './resources/monitoring-summary.resource';

import { AgronomicRecordAssembler } from './agronomic-record.assembler';
import { ChillHourRecordAssembler } from './chill-hour-record.assembler';
import { YieldForecastAssembler } from './yield-forecast.assembler';
import { OverallPlotHealthAssembler } from './overall-plot-health.assembler';

export class MonitoringSummaryAssembler {
  static toEntityFromResource(
    resource: MonitoringSummaryResource | null | undefined,
  ): MonitoringSummary {
    const latestNdvi = resource?.ndvi
      ? AgronomicRecordAssembler.toEntityFromResource(resource.ndvi)
      : null;

    const chillHourRecord = resource?.chillAccumulation
      ? ChillHourRecordAssembler.toEntityFromResource(resource.chillAccumulation)
      : null;

    const yieldForecast = resource?.yieldForecast
      ? YieldForecastAssembler.toEntityFromResource(resource.yieldForecast)
      : null;

    const overallPlotHealth = resource?.overallHealth
      ? OverallPlotHealthAssembler.toEntityFromResource(resource.overallHealth)
      : null;

    return new MonitoringSummary({
      id: resource?.id ?? null,
      period: resource?.period ?? 'current',
      ndvi: latestNdvi,
      chillAccumulation: chillHourRecord,
      yieldForecast,
      overallHealth: overallPlotHealth,
      updatedAt: resource?.updatedAt ?? new Date().toISOString(),
    });
  }

  static toEntitiesFromResources(resources: MonitoringSummaryResource[] = []): MonitoringSummary[] {
    return resources.map((resource) => this.toEntityFromResource(resource));
  }

  static toFirstEntityFromResources(
    resources: MonitoringSummaryResource[] = [],
  ): MonitoringSummary | null {
    const firstResource = resources.at(0);

    return firstResource ? this.toEntityFromResource(firstResource) : null;
  }
}

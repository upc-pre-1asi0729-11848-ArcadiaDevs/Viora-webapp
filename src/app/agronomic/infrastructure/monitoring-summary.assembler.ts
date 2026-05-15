/**
 * @file monitoring-summary.assembler.ts
 * @description specialized assembler for mapping Monitoring Summary resources to domain entities.
 */
import { MonitoringSummary } from '../domain/model/monitoring-summary.entity';
import { BaseAssembler } from '../../shared/infrastructure/base-assembler';

import { MonitoringSummaryResource } from './monitoring-summaries-response';

import { AgronomicRecordAssembler } from './agronomic-record.assembler';
import { ChillHourRecordAssembler } from './chill-hour-record.assembler';
import { YieldForecastAssembler } from './yield-forecast.assembler';
import { OverallPlotHealthAssembler } from './overall-plot-health.assembler';

export class MonitoringSummaryAssembler extends BaseAssembler {
  /**
   * Transforms a single resource into an entity.
   * @param {Object} resource - Raw data point.
   * @returns {any}
   */
  static toEntityFromResource(
    resource: MonitoringSummaryResource | null | undefined,
  ): MonitoringSummary {
    return new MonitoringSummary({
      id: resource?.id ?? null,
      period: resource?.period ?? 'current',
      latestNdvi: AgronomicRecordAssembler.toEntityFromResource(resource?.ndvi),
      chillHourRecord: ChillHourRecordAssembler.toEntityFromResource(resource?.chillAccumulation),
      yieldForecast: YieldForecastAssembler.toEntityFromResource(resource?.yieldForecast),
      overallPlotHealth: OverallPlotHealthAssembler.toEntityFromResource(resource?.overallHealth),
      updatedAt: resource?.updatedAt ?? '',
    });
  }

  /**
   * Transforms a collection of resources into entities.
   * @param {Object[]} resources - Array of raw data points.
   * @returns {any[]}
   */
  static toEntitiesFromResources(resources: MonitoringSummaryResource[] = []): MonitoringSummary[] {
    return this.toEntities(resources, (resource) => this.toEntityFromResource(resource));
  }

  /**
   * Transforms the first resource of a collection into an entity.
   * @param {Object[]} resources - Array of raw data points.
   * @returns {any | null}
   */
  static toFirstEntityFromResources(
    resources: MonitoringSummaryResource[] = [],
  ): MonitoringSummary | null {
    return this.toFirstEntity(resources, (resource) => this.toEntityFromResource(resource));
  }
}

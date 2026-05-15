/**
 * @file agronomic-statistics.assembler.ts
 * @description specialized assembler for mapping Agronomic Statistics resources to domain entities.
 */
import {
  AgronomicStatistics,
  AgronomicTimeRange,
  AgronomicTrend,
} from '../domain/model/agronomic-statistics.entity';

import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { AgronomicStatisticsResource } from './agronomic-statistics-response';

export class AgronomicStatisticsAssembler extends BaseAssembler {
  /**
   * Transforms a single resource into an entity.
   * @param {Object} resource - Raw data point.
   * @returns {any}
   */
  static toEntityFromResource(
    resource: AgronomicStatisticsResource | null | undefined,
  ): AgronomicStatistics {
    return new AgronomicStatistics({
      id: resource?.id ?? null,
      plotId: resource?.plotId ?? null,
      timeRange: this.toTimeRange(resource?.timeRange),
      labels: resource?.labels ?? [],
      ndviSeries: resource?.ndviSeries ?? [],
      cpSeries: resource?.cpSeries ?? [],
      threshold: resource?.threshold ?? 600,
      observation: resource?.observation ?? '',
      description: resource?.description ?? '',
      trend: this.toTrend(resource?.trend),
      statusLabel: resource?.statusLabel ?? 'Stable',
    });
  }

  /**
   * Transforms a collection of resources into entities.
   * @param {Object[]} resources - Array of raw data points.
   * @returns {any[]}
   */
  static toEntitiesFromResources(
    resources: AgronomicStatisticsResource[] = [],
  ): AgronomicStatistics[] {
    return this.toEntities(resources, (resource) => this.toEntityFromResource(resource));
  }

  /**
   * Transforms the first resource of a collection into an entity.
   * @param {Object[]} resources - Array of raw data points.
   * @returns {any | null}
   */
  static toFirstEntityFromResources(
    resources: AgronomicStatisticsResource[] = [],
  ): AgronomicStatistics | null {
    return this.toFirstEntity(resources, (resource) => this.toEntityFromResource(resource));
  }

  private static toTimeRange(value: string | undefined): AgronomicTimeRange {
    const validRanges: AgronomicTimeRange[] = ['current', '7days', '30days', 'campaign'];

    return validRanges.includes(value as AgronomicTimeRange)
      ? (value as AgronomicTimeRange)
      : '30days';
  }

  private static toTrend(value: string | undefined): AgronomicTrend {
    const validTrends: AgronomicTrend[] = ['Stable', 'Up', 'Down', 'Review'];

    return validTrends.includes(value as AgronomicTrend) ? (value as AgronomicTrend) : 'Stable';
  }
}

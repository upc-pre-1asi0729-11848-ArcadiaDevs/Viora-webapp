/**
 * @file chill-hour-record.assembler.ts
 * @description specialized assembler for mapping Chill Hour Record resources to domain entities.
 */
import { ChillHourRecord } from '../domain/model/chill-hour-record.entity';
import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { ChillHourRecordResource } from './chill-hour-records-response';

export class ChillHourRecordAssembler extends BaseAssembler {
  /**
   * Transforms a single resource into an entity.
   * @param {Object} resource - Raw data point.
   * @returns {any}
   */
  static toEntityFromResource(
    resource: ChillHourRecordResource | null | undefined,
  ): ChillHourRecord {
    return new ChillHourRecord({
      id: resource?.id ?? null,
      plotId: resource?.plotId ?? null,
      accumulatedChillPortions: resource?.accumulatedChillPortions ?? 0,
      weeklyDiff: resource?.weeklyDiff ?? 0,
      threshold: resource?.threshold ?? 600,
      generatedAt: resource?.generatedAt ?? '',
    });
  }

  /**
   * Transforms a collection of resources into entities.
   * @param {Object[]} resources - Array of raw data points.
   * @returns {any[]}
   */
  static toEntitiesFromResources(resources: ChillHourRecordResource[] = []): ChillHourRecord[] {
    return this.toEntities(resources, (resource) => this.toEntityFromResource(resource));
  }
}

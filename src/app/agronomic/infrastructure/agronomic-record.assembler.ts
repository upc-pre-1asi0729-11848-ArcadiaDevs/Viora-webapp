/**
 * @file agronomic-record.assembler.ts
 * @description specialized assembler for mapping Agronomic Record resources to domain entities.
 */
import { AgronomicRecord, NdviTrend } from '../domain/model/agronomic-record.entity';

import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { AgronomicRecordResource } from './agronomic-record-response';

export class AgronomicRecordAssembler extends BaseAssembler {
  /**
   * Transforms a single resource into an entity.
   * @param {Object} resource - Raw data point.
   * @returns {any}
   */
  static toEntityFromResource(
    resource: AgronomicRecordResource | null | undefined,
  ): AgronomicRecord {
    return new AgronomicRecord({
      id: resource?.id ?? null,
      plotId: resource?.plotId ?? null,
      date: resource?.date ?? '',
      ndviIndex: resource?.ndviIndex ?? 0,
      ndviTrend: this.toNdviTrend(resource?.ndviTrend),
      ndviStatusLabel: resource?.ndviStatusLabel ?? '',
      temp: resource?.temp ?? 0,
      cp: resource?.cp ?? 0,
      yieldValue: resource?.yieldValue ?? 0,
    });
  }

  /**
   * Transforms a collection of resources into entities.
   * @param {Object[]} resources - Array of raw data points.
   * @returns {any[]}
   */
  static toEntitiesFromResources(resources: AgronomicRecordResource[] = []): AgronomicRecord[] {
    return this.toEntities(resources, (resource) => this.toEntityFromResource(resource));
  }

  private static toNdviTrend(value: string | undefined): NdviTrend {
    const validTrends: NdviTrend[] = ['up', 'down', 'stable'];

    return validTrends.includes(value as NdviTrend) ? (value as NdviTrend) : 'stable';
  }
}

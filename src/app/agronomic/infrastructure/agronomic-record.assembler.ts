import { AgronomicRecord, NdviTrend } from '../domain/model/agronomic-record.entity';

import { AgronomicRecordResource } from './resources/agronomic-record.resource';

export class AgronomicRecordAssembler {
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

  static toEntitiesFromResources(resources: AgronomicRecordResource[] = []): AgronomicRecord[] {
    return resources.map((resource) => this.toEntityFromResource(resource));
  }

  private static toNdviTrend(value: string | undefined): NdviTrend {
    const validTrends: NdviTrend[] = ['up', 'down', 'stable'];

    return validTrends.includes(value as NdviTrend) ? (value as NdviTrend) : 'stable';
  }
}

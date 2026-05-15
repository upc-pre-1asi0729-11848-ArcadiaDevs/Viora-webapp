import { ChillHourRecord } from '../domain/model/chill-hour-record.entity';
import { ChillHourRecordResource } from './resources/chill-hour-record.resource';

export class ChillHourRecordAssembler {
  static toEntityFromResource(
    resource: ChillHourRecordResource | null | undefined
  ): ChillHourRecord {
    return new ChillHourRecord({
      id: resource?.id ?? null,
      plotId: resource?.plotId ?? null,
      accumulatedChillPortions: resource?.accumulatedChillPortions ?? 0,
      weeklyDiff: resource?.weeklyDiff ?? 0,
      threshold: resource?.threshold ?? 600,
      generatedAt: resource?.generatedAt ?? ''
    });
  }

  static toEntitiesFromResources(
    resources: ChillHourRecordResource[] = []
  ): ChillHourRecord[] {
    return resources.map(resource => this.toEntityFromResource(resource));
  }
}

/**
 * @file chill-hour-records-response.ts
 * @description API resource payload definition for Chill Hour Records data.
 */
import {
  BaseResource,
  BaseResponse,
  CollectionResponse
} from '../../shared/infrastructure/base-response';

export interface ChillHourRecordResource extends BaseResource {
  plotId?: number | string | null;
  accumulatedChillPortions?: number;
  weeklyDiff?: number;
  threshold?: number;
  generatedAt?: string;
}

export interface ChillHourRecordsResponse extends BaseResponse {
  chillHourRecords: ChillHourRecordResource[];
}

export type ChillHourRecordCollectionResponse = CollectionResponse<
  ChillHourRecordResource,
  'chillHourRecords'
>;

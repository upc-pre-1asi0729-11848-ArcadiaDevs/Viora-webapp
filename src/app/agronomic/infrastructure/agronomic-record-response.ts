/**
 * @file agronomic-records-response.ts
 * @description API resource payload definition for Agronomic Records data.
 */
import {
  BaseResource,
  BaseResponse,
  CollectionResponse,
} from '../../shared/infrastructure/base-response';

export interface AgronomicRecordResource extends BaseResource {
  plotId?: number | string | null;
  date?: string;
  ndviIndex?: number;
  ndviTrend?: string;
  ndviStatusLabel?: string;
  temp?: number;
  cp?: number;
  yieldValue?: number;
}

export interface AgronomicRecordsResponse extends BaseResponse {
  records: AgronomicRecordResource[];
}

export type AgronomicRecordCollectionResponse = CollectionResponse<
  AgronomicRecordResource,
  'records'
>;

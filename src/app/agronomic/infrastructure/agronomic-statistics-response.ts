/**
 * @file agronomic-statistics-response.ts
 * @description API resource payload definition for Agronomic Statistics data.
 */
import {
  BaseResource,
  BaseResponse,
  CollectionResponse,
} from '../../shared/infrastructure/base-response';

export interface AgronomicStatisticsResource extends BaseResource {
  plotId?: number | string | null;
  timeRange?: string;
  labels?: string[];
  ndviSeries?: number[];
  cpSeries?: number[];
  threshold?: number;
  observation?: string;
  description?: string;
  trend?: string;
  statusLabel?: string;
}

export interface AgronomicStatisticsResponse extends BaseResponse {
  statistics: AgronomicStatisticsResource[];
}

export type AgronomicStatisticsCollectionResponse = CollectionResponse<
  AgronomicStatisticsResource,
  'statistics'
>;

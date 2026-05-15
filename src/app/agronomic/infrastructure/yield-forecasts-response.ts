/**
 * @file yield-forecasts-response.ts
 * @description API resource payload definition for Yield Forecasts data.
 */
import {
  BaseResource,
  BaseResponse,
  CollectionResponse
} from '../../shared/infrastructure/base-response';

export interface YieldForecastResource extends BaseResource {
  plotId?: number | string | null;
  tonnes?: number;
  riskLevel?: string;
  description?: string;
}

export interface YieldForecastsResponse extends BaseResponse {
  yieldForecasts: YieldForecastResource[];
}

export type YieldForecastCollectionResponse = CollectionResponse<
  YieldForecastResource,
  'yieldForecasts'
>;

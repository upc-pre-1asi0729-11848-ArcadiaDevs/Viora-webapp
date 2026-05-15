/**
 * @file weather-summaries-response.ts
 * @description API resource payload definition for Weather Summaries data.
 */
import {
  BaseResource,
  BaseResponse,
  CollectionResponse
} from '../../shared/infrastructure/base-response';

export interface WeatherForecastDayResource {
  dayLabel?: string;
  minTemp?: number;
  maxTemp?: number;
  condition?: string;
}

export interface WeatherSummaryResource extends BaseResource {
  city?: string;
  currentTemp?: number;
  condition?: string;
  lastUpdate?: string;
  icon?: string;
  backgroundImage?: string;
  forecast3Days?: WeatherForecastDayResource[];
  temperatureAnomaly?: number;
  climateRisk?: string;
}

export interface WeatherSummariesResponse extends BaseResponse {
  weatherSummaries: WeatherSummaryResource[];
}

export type WeatherSummaryCollectionResponse = CollectionResponse<
  WeatherSummaryResource,
  'weatherSummaries'
>;

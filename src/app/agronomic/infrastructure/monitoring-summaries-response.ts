/**
 * @file monitoring-summaries-response.ts
 * @description API resource payload definition for Monitoring Summaries data.
 */
import {
  BaseResource,
  BaseResponse,
  CollectionResponse
} from '../../shared/infrastructure/base-response';

import { AgronomicRecordResource } from './agronomic-records-response';
import { ChillHourRecordResource } from './chill-hour-records-response';
import { OverallPlotHealthResource } from './overall-plot-health-response';
import { YieldForecastResource } from './yield-forecasts-response';

export interface MonitoringSummaryResource extends BaseResource {
  period?: string;
  updatedAt?: string;
  ndvi?: AgronomicRecordResource | null;
  chillAccumulation?: ChillHourRecordResource | null;
  yieldForecast?: YieldForecastResource | null;
  overallHealth?: OverallPlotHealthResource | null;
}

export interface MonitoringSummariesResponse extends BaseResponse {
  summaries: MonitoringSummaryResource[];
}

export type MonitoringSummaryCollectionResponse = CollectionResponse<
  MonitoringSummaryResource,
  'summaries'
>;

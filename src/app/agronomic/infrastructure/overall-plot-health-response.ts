/**
 * @file overall-plot-health-response.ts
 * @description API resource payload definition for Overall Plot Health data.
 */
import {
  BaseResource,
  BaseResponse,
  CollectionResponse
} from '../../shared/infrastructure/base-response';

export interface OverallPlotHealthResource extends BaseResource {
  status?: string;
  healthyPlotsCount?: number;
  reviewPlotsCount?: number;
}

export interface OverallPlotHealthResponse extends BaseResponse {
  overallPlotHealth: OverallPlotHealthResource[];
}

export type OverallPlotHealthCollectionResponse = CollectionResponse<
  OverallPlotHealthResource,
  'overallPlotHealth'
>;

/**
 * @file plots-response.ts
 * @description API resource payload definition for Plots data.
 */
import {
  BaseResource,
  BaseResponse,
  CollectionResponse,
} from '../../shared/infrastructure/base-response';

import { SatelliteImageryResource } from './satellite-imagery-response';

export type PlotCoordinateResource = [number, number];

export interface PlotResource extends BaseResource {
  name?: string;
  polygonCoordinates?: PlotCoordinateResource[];
  areaSize?: number;
  lastUpdate?: string;
  healthStatus?: string;
  phenologicalRisk?: string;
  currentImagery?: SatelliteImageryResource | null;
}

export interface PlotsResponse extends BaseResponse {
  plots: PlotResource[];
}

export type PlotCollectionResponse = CollectionResponse<PlotResource, 'plots'>;

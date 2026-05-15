/**
 * @file satellite-imagery-response.ts
 * @description API resource payload definition for Satellite Imagery data.
 */
import {
  BaseResource,
  BaseResponse,
  CollectionResponse,
} from '../../shared/infrastructure/base-response';

export interface SatelliteImageryResource extends BaseResource {
  plotId?: number | string | null;
  tileUrl?: string;
  captureDate?: string;
  ndviMean?: number;
  cloudPercentage?: number;
}

export interface SatelliteImageryResponse extends BaseResponse {
  satelliteImagery: SatelliteImageryResource[];
}

export type SatelliteImageryCollectionResponse = CollectionResponse<
  SatelliteImageryResource,
  'satelliteImagery'
>;

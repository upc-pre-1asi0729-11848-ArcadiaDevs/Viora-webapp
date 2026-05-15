/**
 * @file iot-device-summaries-response.ts
 * @description API resource payload definition for Iot Device Summaries data.
 */
import {
  BaseResource,
  BaseResponse,
  CollectionResponse
} from '../../shared/infrastructure/base-response';

export interface IotSensorCardResource extends BaseResource {
  plotId?: number | string | null;
  title?: string;
  sourceLabel?: string;
  metricLabel?: string;
  metricValue?: number;
  metricUnit?: string;
  trend?: string;
  riskLevel?: string;
  recommendation?: string;
}

export interface IotDeviceSummaryResource extends BaseResource {
  totalOnlineDevices?: number;
  plotsWithIot?: number;
  lastSync?: string;
  sensorCards?: IotSensorCardResource[];
}

export interface IotDeviceSummariesResponse extends BaseResponse {
  iotDeviceSummaries: IotDeviceSummaryResource[];
}

export type IotDeviceSummaryCollectionResponse = CollectionResponse<
  IotDeviceSummaryResource,
  'iotDeviceSummaries'
>;
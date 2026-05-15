/**
 * @file iot-devices-response.ts
 * @description API resource payload definition for Iot Devices data.
 */
import {
  BaseResource,
  BaseResponse,
  CollectionResponse
} from '../../shared/infrastructure/base-response';

export interface IotDeviceResource extends BaseResource {
  name?: string;
  plotId?: number | string | null;
  soilMoisture?: number;
  temperature?: number;
  leafHumidity?: number;
  status?: string;
  lastUpdate?: string;
}

export interface IotDevicesResponse extends BaseResponse {
  iotDevices: IotDeviceResource[];
}

export type IotDeviceCollectionResponse = CollectionResponse<
  IotDeviceResource,
  'iotDevices'
>;
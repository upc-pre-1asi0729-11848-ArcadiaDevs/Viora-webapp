/**
 * @file alerts-response.ts
 * @description API resource payload definition for Alerts data.
 */
import {
  BaseResource,
  BaseResponse,
  CollectionResponse,
} from '../../shared/infrastructure/base-response';

export interface AlertPlotResource {
  name?: string;
  location?: string;
  hectares?: number;
}

export interface AlertResource extends BaseResource {
  type?: string;
  description?: string;
  severity?: string;
  date?: string;
  status?: string;
  plot?: AlertPlotResource;
}

export interface AlertsResponse extends BaseResponse {
  alerts: AlertResource[];
}

export type AlertCollectionResponse = CollectionResponse<AlertResource, 'alerts'>;
/**
 * @file alerts-response.ts
 * @description API resource payload definition for Alerts data.
 */
import {
  BaseResource,
  BaseResponse,
  CollectionResponse,
} from '../../shared/infrastructure/base-response';

export interface AlertPlotResource {
  name?: string;
  location?: string;
  hectares?: number;
}

export interface AlertResource extends BaseResource {
  type?: string;
  description?: string;
  severity?: string;
  date?: string;
  status?: string;
  plot?: AlertPlotResource;
}

export interface AlertsResponse extends BaseResponse {
  alerts: AlertResource[];
}

export type AlertCollectionResponse = CollectionResponse<AlertResource, 'alerts'>;

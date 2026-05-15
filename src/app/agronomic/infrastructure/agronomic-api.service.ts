import { Injectable } from '@angular/core';
import { Observable, map, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  ApiQueryParams,
  BaseApi
} from '../../shared/infrastructure/base-api';

import { Plot } from '../domain/model/plot.entity';
import { AgronomicRecord } from '../domain/model/agronomic-record.entity';
import { MonitoringSummary } from '../domain/model/monitoring-summary.entity';
import { WeatherSummary } from '../domain/model/weather-summary.entity';
import { YieldForecast } from '../domain/model/yield-forecast.entity';
import { IotDeviceSummary } from '../domain/model/iot-device-summary.entity';

import {
  PlotCollectionResponse,
  PlotResource
} from './plots-response';
import {
  AgronomicRecordCollectionResponse
} from './agronomic-record-response';
import {
  MonitoringSummaryCollectionResponse
} from './monitoring-summaries-response';
import {
  WeatherSummaryCollectionResponse
} from './weather-summaries-response';
import {
  YieldForecastCollectionResponse
} from './yield-forecasts-response';
import {
  IotDeviceSummaryCollectionResponse
} from './iot-device-summaries-response';


import { PlotAssembler } from './plot.assembler';
import { AgronomicRecordAssembler } from './agronomic-record.assembler';
import { MonitoringSummaryAssembler } from './monitoring-summary.assembler';
import { WeatherSummaryAssembler } from './weather-summary.assembler';
import { YieldForecastAssembler } from './yield-forecast.assembler';
import { IotDeviceSummaryAssembler } from './iot-device-summary.assembler';

import { AgronomicStatistics } from '../domain/model/agronomic-statistics.entity';
import {
  AgronomicStatisticsCollectionResponse
} from './agronomic-statistics-response';
import { AgronomicStatisticsAssembler } from './agronomic-statistics.assembler';

import { IotDevice } from '../domain/model/iot-device.entity';
import {
  IotDeviceCollectionResponse,
  IotDeviceResource
} from './iot-devices-response';
import { IotDeviceAssembler } from './iot-device.assembler';

type AgronomicQueryParams = ApiQueryParams;

@Injectable({
  providedIn: 'root'
})
/**
 * Infrastructure service gateway for the Agronomic bounded-context endpoints.
 * Manages multiple specific endpoints for agronomic entities.
 * 
 * @class AgronomicApiService
 * @extends BaseApi
 */
export class AgronomicApiService extends BaseApi {
  private readonly plotsEndpoint = this.endpoint(environment.endpoints.plots);
  private readonly recordsEndpoint = this.endpoint(environment.endpoints.agronomicRecords);
  private readonly summariesEndpoint = this.endpoint(environment.endpoints.monitoringSummaries);
  private readonly weatherEndpoint = this.endpoint(environment.endpoints.weatherSummaries);
  private readonly forecastsEndpoint = this.endpoint(environment.endpoints.yieldForecasts);
  private readonly iotDeviceSummariesEndpoint = this.endpoint(environment.endpoints.iotDeviceSummaries);
  private readonly statisticsEndpoint = this.endpoint(environment.endpoints.agronomicStatistics);
  private readonly iotDevicesEndpoint = this.endpoint(environment.endpoints.iotDevices);

  /**
   * Fetches IotDeviceSummary resources.
   * @returns {Observable<IotDeviceSummary | null>}
   */
  getIotDeviceSummary(): Observable<IotDeviceSummary | null> {
    return this.http
      .get<IotDeviceSummaryCollectionResponse>(this.iotDeviceSummariesEndpoint.collectionUrl)
      .pipe(
        map(response => this.collectionFrom(response, 'iotDeviceSummaries')),
        map(resources => IotDeviceSummaryAssembler.toFirstEntityFromResources(resources))
      );
  }

  /**
   * Fetches Plots resources.
   * @returns {Observable<Plot[]>}
   */
  getPlots(): Observable<Plot[]> {
    return this.http
      .get<PlotCollectionResponse>(this.plotsEndpoint.collectionUrl)
      .pipe(
        map(response => this.collectionFrom(response, 'plots')),
        map(resources => PlotAssembler.toEntitiesFromResources(resources))
      );
  }

  /**
   * Fetches PlotById resources.
   * @returns {Observable<Plot>}
   */
  getPlotById(id: number | string): Observable<Plot> {
    return this.http
      .get<PlotResource>(this.plotsEndpoint.resourceUrl(id))
      .pipe(map(resource => PlotAssembler.toEntityFromResource(resource)));
  }

  /**
   * Fetches Records resources.
   * @returns {Observable<AgronomicRecord[]>}
   */
  getRecords(params: AgronomicQueryParams = {}): Observable<AgronomicRecord[]> {
    return this.http
      .get<AgronomicRecordCollectionResponse>(this.recordsEndpoint.collectionUrl, {
        params: this.queryParams(params)
      })
      .pipe(
        map(response => this.collectionFrom(response, 'records')),
        map(resources => AgronomicRecordAssembler.toEntitiesFromResources(resources))
      );
  }

  /**
   * Fetches Summaries resources.
   * @returns {Observable<MonitoringSummary[]>}
   */
  getSummaries(period: string = 'current'): Observable<MonitoringSummary[]> {
    return this.http
      .get<MonitoringSummaryCollectionResponse>(this.summariesEndpoint.collectionUrl, {
        params: this.queryParams({ period })
      })
      .pipe(
        map(response => this.collectionFrom(response, 'summaries')),
        map(resources => MonitoringSummaryAssembler.toEntitiesFromResources(resources))
      );
  }

  /**
   * Fetches CurrentSummary resources.
   * @returns {Observable<MonitoringSummary | null>}
   */
  getCurrentSummary(period: string = 'current'): Observable<MonitoringSummary | null> {
    return this.http
      .get<MonitoringSummaryCollectionResponse>(this.summariesEndpoint.collectionUrl, {
        params: this.queryParams({ period })
      })
      .pipe(
        map(response => this.collectionFrom(response, 'summaries')),
        map(resources => MonitoringSummaryAssembler.toFirstEntityFromResources(resources))
      );
  }

  /**
   * Fetches Weather resources.
   * @returns {Observable<WeatherSummary[]>}
   */
  getWeather(params: AgronomicQueryParams = {}): Observable<WeatherSummary[]> {
    return this.http
      .get<WeatherSummaryCollectionResponse>(this.weatherEndpoint.collectionUrl, {
        params: this.queryParams(params)
      })
      .pipe(
        map(response => this.collectionFrom(response, 'weatherSummaries')),
        map(resources => WeatherSummaryAssembler.toEntitiesFromResources(resources))
      );
  }

  /**
   * Fetches CurrentWeather resources.
   * @returns {Observable<WeatherSummary | null>}
   */
  getCurrentWeather(params: AgronomicQueryParams = {}): Observable<WeatherSummary | null> {
    return this.getWeather(params).pipe(
      map(weatherSummaries => weatherSummaries.at(0) ?? null)
    );
  }

  /**
   * Fetches YieldForecastsByPlot resources.
   * @returns {Observable<YieldForecast[]>}
   */
  getYieldForecastsByPlot(plotId: number | string): Observable<YieldForecast[]> {
    return this.http
      .get<YieldForecastCollectionResponse>(this.forecastsEndpoint.collectionUrl, {
        params: this.queryParams({ plotId })
      })
      .pipe(
        map(response => this.collectionFrom(response, 'yieldForecasts')),
        map(resources => YieldForecastAssembler.toEntitiesFromResources(resources))
      );
  }

  getAgronomicStatistics(
    params: AgronomicQueryParams = {}
  ): Observable<AgronomicStatistics | null> {
    return this.http
      .get<AgronomicStatisticsCollectionResponse>(this.statisticsEndpoint.collectionUrl, {
        params: this.queryParams(params)
      })
      .pipe(
        map(response => this.collectionFrom(response, 'statistics')),
        map(resources => AgronomicStatisticsAssembler.toFirstEntityFromResources(resources))
      );
  }

  /**
   * Fetches IotDevices resources.
   * @returns {Observable<IotDevice[]>}
   */
  getIotDevices(): Observable<IotDevice[]> {
    return this.http
      .get<IotDeviceCollectionResponse>(this.iotDevicesEndpoint.collectionUrl)
      .pipe(
        map(response => this.collectionFrom(response, 'iotDevices')),
        map(resources => IotDeviceAssembler.toEntitiesFromResources(resources))
      );
  }

  /**
   * Fetches IotDeviceById resources.
   * @returns {Observable<IotDevice>}
   */
  getIotDeviceById(id: number | string): Observable<IotDevice> {
    return this.http
      .get<IotDeviceResource>(this.iotDevicesEndpoint.resourceUrl(id))
      .pipe(map(resource => IotDeviceAssembler.toEntityFromResource(resource)));
  }

  /**
   * Creates a new IotDevice resource.
   * @returns {Observable<IotDevice>}
   */
  createIotDevice(device: IotDevice): Observable<IotDevice> {
    return this.http
      .post<IotDeviceResource>(
        this.iotDevicesEndpoint.collectionUrl,
        IotDeviceAssembler.toResourceFromEntity(device)
      )
      .pipe(map(resource => IotDeviceAssembler.toEntityFromResource(resource)));
  }

  /**
   * Updates an existing IotDevice resource.
   * @returns {Observable<IotDevice>}
   */
  updateIotDevice(device: IotDevice): Observable<IotDevice> {
    if (device.id === null) {
      return throwError(() => new Error('Cannot update an IoT device without an id.'));
    }

    return this.http
      .put<IotDeviceResource>(
        this.iotDevicesEndpoint.resourceUrl(device.id),
        IotDeviceAssembler.toResourceFromEntity(device)
      )
      .pipe(map(resource => IotDeviceAssembler.toEntityFromResource(resource)));
  }

  /**
   * Deletes an existing IotDevice resource.
   * @returns {Observable<void>}
   */
  deleteIotDevice(id: number | string): Observable<void> {
    return this.http.delete<void>(this.iotDevicesEndpoint.resourceUrl(id));
  }

}

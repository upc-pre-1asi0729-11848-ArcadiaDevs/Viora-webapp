/**
 * Application service store for the `Agronomic` bounded context.
 * It coordinates plots, telemetry, weather, and yield forecast use cases and keeps a UI-facing state.
 *
 * @module AgronomicStore
 */
import { computed, inject, Injectable, signal } from '@angular/core';
import { finalize, take } from 'rxjs';

import { AgronomicApiService } from '../infrastructure/agronomic-api.service';

import { Plot } from '../domain/model/plot.entity';
import { AgronomicRecord } from '../domain/model/agronomic-record.entity';
import { WeatherSummary } from '../domain/model/weather-summary.entity';
import { YieldForecast } from '../domain/model/yield-forecast.entity';
import { ChillHourRecord } from '../domain/model/chill-hour-record.entity';
import { MonitoringSummary } from '../domain/model/monitoring-summary.entity';
import { AgronomicStatistics } from '../domain/model/agronomic-statistics.entity';
import { IotDevice } from '../domain/model/iot-device.entity';
import { IotRiskLevel, IotSensorCard } from '../domain/model/iot-device-summary.entity';

export type DashboardScope = number | string;
export type DashboardTimeRange = 'current' | '7days' | '30days';
export type TrendAnalysisTimeRange = '7days' | '30days' | 'campaign';

export interface AgronomicLoadingState {
  plots: boolean;
  records: boolean;
  mapRecords: boolean;
  weather: boolean;
  yieldForecast: boolean;
  summary: boolean;
  statistics: boolean;
  devices: boolean;
  saving: boolean;
  deleting: boolean;
}

/**
 * Reactive store that exposes Agronomic commands and queries.
 *
 * @returns {AgronomicStore} Store state and actions.
 */
@Injectable({
  providedIn: 'root',
})
export class AgronomicStore {
  private readonly agronomicApi = inject(AgronomicApiService);

  /**
   * List of plot entities.
   * @type {import('@angular/core').WritableSignal<Plot[]>}
   */
  readonly plots = signal<Plot[]>([]);

  /**
   * Selected scope for dashboard.
   * @type {import('@angular/core').WritableSignal<DashboardScope>}
   */
  readonly selectedDashboardScope = signal<DashboardScope>('all');
  /**
   * Selected time range for dashboard.
   * @type {import('@angular/core').WritableSignal<DashboardTimeRange>}
   */
  readonly selectedDashboardTimeRange = signal<DashboardTimeRange>('current');
  /**
   * Selected plot identifier for map.
   * @type {import('@angular/core').WritableSignal<number | string | null>}
   */
  readonly selectedMapPlotId = signal<number | string | null>(null);
  /**
   * Selected plot identifier for trend analysis.
   * @type {import('@angular/core').WritableSignal<DashboardScope>}
   */
  readonly selectedTrendPlotId = signal<DashboardScope>('all');
  /**
   * Selected time range for trend analysis.
   * @type {import('@angular/core').WritableSignal<TrendAnalysisTimeRange>}
   */
  readonly selectedTrendTimeRange = signal<TrendAnalysisTimeRange>('7days');

  /**
   * List of telemetry record entities.
   * @type {import('@angular/core').WritableSignal<AgronomicRecord[]>}
   */
  readonly agronomicRecords = signal<AgronomicRecord[]>([]);
  /**
   * List of telemetry record entities for map.
   * @type {import('@angular/core').WritableSignal<AgronomicRecord[]>}
   */
  readonly mapAgronomicRecords = signal<AgronomicRecord[]>([]);
  /**
   * Current weather summary entity.
   * @type {import('@angular/core').WritableSignal<WeatherSummary | null>}
   */
  readonly weatherSummary = signal<WeatherSummary | null>(null);
  /**
   * Current yield forecast entity.
   * @type {import('@angular/core').WritableSignal<YieldForecast | null>}
   */
  readonly yieldForecast = signal<YieldForecast | null>(null);
  /**
   * Current chill hour accumulation entity.
   * @type {import('@angular/core').WritableSignal<ChillHourRecord | null>}
   */
  readonly chillHourRecord = signal<ChillHourRecord | null>(null);
  /**
   * Global monitoring summary for the dashboard.
   * @type {import('@angular/core').WritableSignal<MonitoringSummary | null>}
   */
  readonly monitoringSummary = signal<MonitoringSummary | null>(null);

  /**
   * List of IoT devices from the agronomic bounded context.
   * @type {import('@angular/core').WritableSignal<IotDevice[]>}
   */
  readonly devices = signal<IotDevice[]>([]);
  /**
   * Whether IoT devices have been loaded.
   * @type {import('@angular/core').WritableSignal<boolean>}
   */
  readonly devicesLoaded = signal<boolean>(false);
  /**
   * Currently selected IoT device identifier.
   * @type {import('@angular/core').WritableSignal<number|string|null>}
   */
  readonly selectedDeviceId = signal<number | string | null>(null);

  /**
   * List of errors encountered during API operations.
   * @type {import('@angular/core').WritableSignal<unknown[]>}
   */
  readonly errors = signal<unknown[]>([]);

  /**
   * Whether plots have been loaded from the API.
   * @type {import('@angular/core').WritableSignal<boolean>}
   */
  readonly plotsLoaded = signal<boolean>(false);
  /**
   * Whether the monitoring summary has been loaded.
   * @type {import('@angular/core').WritableSignal<boolean>}
   */
  readonly summaryLoaded = signal<boolean>(false);

  /**
   * Pre-calculated analysis data fetched from the backend.
   * @type {import('@angular/core').WritableSignal<AgronomicStatistics | null>}
   */
  readonly agronomicStatistics = signal<AgronomicStatistics | null>(null);
  /**
   * Pre-calculated trend analysis data fetched from the backend.
   * @type {import('@angular/core').WritableSignal<AgronomicStatistics | null>}
   */
  readonly trendAgronomicStatistics = signal<AgronomicStatistics | null>(null);

  readonly selectedPlotId = this.selectedDashboardScope;
  readonly selectedStatisticsRange = this.selectedDashboardTimeRange;

  readonly loading = signal<AgronomicLoadingState>({
    plots: false,
    records: false,
    mapRecords: false,
    weather: false,
    yieldForecast: false,
    summary: false,
    statistics: false,
    devices: false,
    saving: false,
    deleting: false,
  });

  /**
   * Returns the full Plot entity based on the current selected ID.
   * @type {import('@angular/core').Signal<Plot | null>}
   */
  readonly selectedDashboardPlot = computed<Plot | null>(() => {
    const selectedScope = this.selectedDashboardScope();

    if (selectedScope === 'all') {
      return null;
    }

    return this.plots().find((plot) => String(plot.id) === String(selectedScope)) ?? null;
  });

  /**
   * Returns the full Plot entity based on the current selected map ID.
   * @type {import('@angular/core').Signal<Plot | null>}
   */
  readonly selectedMapPlot = computed<Plot | null>(() => {
    const selectedId = this.selectedMapPlotId();

    if (selectedId === null) {
      return null;
    }

    return this.plots().find((plot) => String(plot.id) === String(selectedId)) ?? null;
  });

  readonly selectedPlot = this.selectedMapPlot;

  /**
   * Returns the full IoT Device entity based on the current selected ID.
   * @type {import('@angular/core').Signal<IotDevice|null>}
   */
  readonly selectedDevice = computed<IotDevice | null>(() => {
    const selectedId = this.selectedDeviceId();

    if (selectedId === null) return null;

    return this.devices().find((device) => String(device.id) === String(selectedId)) ?? null;
  });

  /**
   * Whether any IoT devices are available.
   * @type {import('@angular/core').Signal<boolean>}
   */
  readonly hasDevices = computed<boolean>(() => this.devices().length > 0);

  readonly dashboardScopeDevices = computed<IotDevice[]>(() => {
    return this.getDevicesForScope(this.selectedDashboardScope());
  });

  readonly onlineDevicesCount = computed<number>(() => {
    return this.dashboardScopeDevices().filter((device) => device.status !== 'inactive').length;
  });

  readonly plotsWithIotCount = computed<number>(() => {
    const plotIds = this.dashboardScopeDevices()
      .map((device) => device.plotId)
      .filter((plotId): plotId is number | string => plotId !== null && plotId !== undefined);

    return new Set(plotIds.map((plotId) => String(plotId))).size;
  });

  readonly lastSyncLabel = computed<string>(() => {
    const latestTimestamp = this.dashboardScopeDevices()
      .map((device) => Date.parse(device.lastUpdate))
      .filter((timestamp) => Number.isFinite(timestamp))
      .sort((first, second) => second - first)
      .at(0);

    if (latestTimestamp === undefined) {
      return 'No sync yet';
    }

    return this.formatRelativeSync(latestTimestamp);
  });

  readonly dashboardInsightCards = computed<IotSensorCard[]>(() => {
    const devices = this.dashboardScopeDevices().filter((device) => device.status !== 'inactive');

    if (devices.length === 0) {
      return [];
    }

    return [this.createSoilMoistureCard(devices), this.createSoilTemperatureCard(devices)];
  });

  readonly dashboardTitle = computed<string>(() => {
    const selectedPlot = this.selectedDashboardPlot();

    return selectedPlot
      ? `Dashboard / Overview / ${selectedPlot.name}`
      : 'Dashboard / Overview / All plots';
  });

  readonly selectedDashboardLatestRecord = computed<AgronomicRecord | null>(() => {
    const statisticsRecord = this.createDashboardRecordFromStatistics();

    if (statisticsRecord) {
      return statisticsRecord;
    }

    const selectedScope = this.selectedDashboardScope();

    if (selectedScope === 'all') {
      return this.monitoringSummary()?.latestNdvi ?? null;
    }

    const records = this.agronomicRecords().filter(
      (record) => String(record.plotId) === String(selectedScope),
    );

    return this.getLatestRecord(records);
  });

  readonly selectedMapPlotLatestRecord = computed<AgronomicRecord | null>(() => {
    const selectedId = this.selectedMapPlotId();

    if (selectedId === null) {
      return null;
    }

    const records = this.mapAgronomicRecords().filter(
      (record) => String(record.plotId) === String(selectedId),
    );

    return this.getLatestRecord(records);
  });

  readonly selectedPlotLatestRecord = this.selectedMapPlotLatestRecord;

  readonly latestAgronomicRecord = computed<AgronomicRecord | null>(() => {
    return this.selectedDashboardLatestRecord();
  });

  readonly selectedPlotNdviLabel = computed<string>(() => {
    const record = this.selectedMapPlotLatestRecord();
    const plot = this.selectedMapPlot();

    const ndviValue = record?.ndviIndex ?? plot?.currentImagery?.ndviMean ?? 0;

    return ndviValue.toFixed(2);
  });

  readonly selectedPlotNdviTrend = computed<string>(() => {
    const trend = this.selectedMapPlotLatestRecord()?.ndviTrend ?? 'stable';

    if (trend === 'up') {
      return '↑';
    }

    if (trend === 'down') {
      return '↓';
    }

    return '→';
  });

  readonly selectedPlotLastUpdateLabel = computed<string>(() => {
    const plot = this.selectedMapPlot();
    const record = this.selectedMapPlotLatestRecord();

    const candidateDates = [
      plot?.lastUpdate ? Date.parse(plot.lastUpdate) : Number.NaN,
      record?.recordedAt?.getTime() ?? Number.NaN,
    ].filter((timestamp) => Number.isFinite(timestamp));

    if (candidateDates.length === 0) {
      return 'Pending';
    }

    return this.formatRelativeTime(Math.max(...candidateDates));
  });

  readonly selectedYieldForecast = computed<YieldForecast | null>(() => {
    if (this.selectedDashboardScope() === 'all') {
      return this.monitoringSummary()?.yieldForecast ?? this.yieldForecast();
    }

    return this.yieldForecast() ?? this.monitoringSummary()?.yieldForecast ?? null;
  });

  readonly selectedChillHourRecord = computed<ChillHourRecord | null>(() => {
    const statisticsChillRecord = this.createChillRecordFromStatistics();

    if (statisticsChillRecord) {
      return statisticsChillRecord;
    }

    return this.chillHourRecord() ?? this.monitoringSummary()?.chillHourRecord ?? null;
  });

  /**
   * Number of loaded plots.
   * @type {import('@angular/core').Signal<number>}
   */
  readonly plotsCount = computed<number>(() => {
    return this.plotsLoaded() ? this.plots().length : 0;
  });

  /**
   * Number of loaded telemetry records.
   * @type {import('@angular/core').Signal<number>}
   */
  readonly recordsCount = computed<number>(() => {
    return this.agronomicRecords().length;
  });

  readonly hasErrors = computed<boolean>(() => {
    return this.errors().length > 0;
  });

  /**
   * Fetches pre-calculated agronomic statistics from the infrastructure layer.
   * @param {number|string} plotId - Plot identifier.
   * @param {DashboardTimeRange} timeRange - Time range.
   * @returns {void}
   */
  fetchAgronomicStatistics(
    plotId: number | string = this.selectedDashboardScope(),
    timeRange: DashboardTimeRange = this.selectedDashboardTimeRange(),
  ): void {
    this.setLoading('statistics', true);

    this.agronomicApi
      .getAgronomicStatistics({
        plotId,
        timeRange: this.toStatisticsTimeRange(timeRange),
      })
      .pipe(
        take(1),
        finalize(() => this.setLoading('statistics', false)),
      )
      .subscribe({
        next: (statistics) => {
          if (!statistics) {
            this.fetchFallbackAgronomicStatistics(plotId, timeRange);
            return;
          }

          this.agronomicStatistics.set(this.toDashboardStatistics(statistics, timeRange));
        },
        error: (error) => this.registerError(error),
      });
  }

  fetchTrendStatistics(
    plotId: number | string = this.selectedTrendPlotId(),
    timeRange: TrendAnalysisTimeRange = this.selectedTrendTimeRange(),
  ): void {
    this.setLoading('statistics', true);

    this.agronomicApi
      .getAgronomicStatistics({
        plotId,
        timeRange,
      })
      .pipe(
        take(1),
        finalize(() => this.setLoading('statistics', false)),
      )
      .subscribe({
        next: (statistics) => {
          if (statistics) {
            this.trendAgronomicStatistics.set(statistics);
            return;
          }

          this.fetchFallbackTrendStatistics(plotId, timeRange);
        },
        error: (error) => this.registerError(error),
      });
  }

  /**
   * Fetches all IoT devices.
   */
  fetchDevices(): void {
    this.setLoading('devices', true);

    this.agronomicApi
      .getIotDevices()
      .pipe(
        take(1),
        finalize(() => this.setLoading('devices', false)),
      )
      .subscribe({
        next: (devices) => {
          this.devices.set(devices);
          this.devicesLoaded.set(true);
        },
        error: (error) => this.registerError(error),
      });
  }

  fetchDeviceById(id: number | string): void {
    this.selectedDeviceId.set(id);

    this.agronomicApi
      .getIotDeviceById(id)
      .pipe(take(1))
      .subscribe({
        next: (device) => {
          this.devices.update((devices) => {
            const exists = devices.some((item) => String(item.id) === String(device.id));

            return exists
              ? devices.map((item) => (String(item.id) === String(device.id) ? device : item))
              : [...devices, device];
          });
        },
        error: (error) => this.registerError(error),
      });
  }

  /**
   * Adds a new IoT device.
   * @param {IotDevice} device
   * @param {()=>void} [onSuccess]
   */
  addDevice(device: IotDevice, onSuccess?: () => void): void {
    this.setLoading('saving', true);

    this.agronomicApi
      .createIotDevice(device)
      .pipe(
        take(1),
        finalize(() => this.setLoading('saving', false)),
      )
      .subscribe({
        next: (createdDevice) => {
          this.devices.update((devices) => [...devices, createdDevice]);
          onSuccess?.();
        },
        error: (error) => this.registerError(error),
      });
  }

  /**
   * Updates an existing IoT device.
   * @param {IotDevice} device
   * @param {()=>void} [onSuccess]
   */
  updateDevice(device: IotDevice, onSuccess?: () => void): void {
    this.setLoading('saving', true);

    this.agronomicApi
      .updateIotDevice(device)
      .pipe(
        take(1),
        finalize(() => this.setLoading('saving', false)),
      )
      .subscribe({
        next: (updatedDevice) => {
          this.devices.update((devices) =>
            devices.map((item) =>
              String(item.id) === String(updatedDevice.id) ? updatedDevice : item,
            ),
          );

          onSuccess?.();
        },
        error: (error) => this.registerError(error),
      });
  }

  /**
   * Deletes an IoT device.
   * @param {number|string} id
   */
  deleteDevice(id: number | string): void {
    this.setLoading('deleting', true);

    this.agronomicApi
      .deleteIotDevice(id)
      .pipe(
        take(1),
        finalize(() => this.setLoading('deleting', false)),
      )
      .subscribe({
        next: () => {
          this.devices.update((devices) =>
            devices.filter((device) => String(device.id) !== String(id)),
          );
        },
        error: (error) => this.registerError(error),
      });
  }

  /**
   * Loads plots from infrastructure and updates the application state.
   * @returns {void}
   */
  fetchPlots(): void {
    this.setLoading('plots', true);

    this.agronomicApi
      .getPlots()
      .pipe(
        take(1),
        finalize(() => this.setLoading('plots', false)),
      )
      .subscribe({
        next: (plots) => {
          this.plots.set(plots);
          this.plotsLoaded.set(true);

          if (plots.length > 0 && this.selectedMapPlotId() === null) {
            this.selectMapPlot(plots[0].id);
          }
        },
        error: (error) => this.registerError(error),
      });
  }

  /**
   * Loads the global farm summary from infrastructure.
   * @param {string} [period='current'] - Filter period.
   * @param {boolean} [fallbackToCurrent=false] - Whether to fallback.
   * @returns {void}
   */
  fetchMonitoringSummary(period: string = 'current', fallbackToCurrent = false): void {
    this.setLoading('summary', true);

    this.agronomicApi
      .getCurrentSummary(period)
      .pipe(
        take(1),
        finalize(() => this.setLoading('summary', false)),
      )
      .subscribe({
        next: (summary) => {
          if (!summary && fallbackToCurrent && period !== 'current') {
            this.fetchMonitoringSummary('current');
            return;
          }

          this.monitoringSummary.set(summary);
          this.summaryLoaded.set(Boolean(summary));

          this.chillHourRecord.set(summary?.chillHourRecord ?? null);
        },
        error: (error) => this.registerError(error),
      });
  }

  /**
   * Loads telemetry records for a plot and calculates yield based on area.
   * @param {number|string|null} plotId - Target plot identifier.
   * @param {string} [period] - Time span.
   * @returns {void}
   */
  fetchRecords(plotId: number | string | null, period?: string): void {
    if (plotId === null || plotId === 'all') {
      this.agronomicRecords.set([]);
      return;
    }

    this.setLoading('records', true);

    const params = period ? { plotId, period } : { plotId };

    this.agronomicApi
      .getRecords(params)
      .pipe(
        take(1),
        finalize(() => this.setLoading('records', false)),
      )
      .subscribe({
        next: (records) => this.agronomicRecords.set(records),
        error: (error) => this.registerError(error),
      });
  }

  fetchMapRecords(plotId: number | string | null, period?: string): void {
    if (plotId === null) {
      this.mapAgronomicRecords.set([]);
      return;
    }

    this.setLoading('mapRecords', true);

    const params = period ? { plotId, period } : { plotId };

    this.agronomicApi
      .getRecords(params)
      .pipe(
        take(1),
        finalize(() => this.setLoading('mapRecords', false)),
      )
      .subscribe({
        next: (records) => this.mapAgronomicRecords.set(records),
        error: (error) => this.registerError(error),
      });
  }

  /**
   * Loads current weather information for the specified city.
   * @param {string} [city='Tacna'] - Target city.
   * @returns {void}
   */
  fetchWeather(city: string = 'Tacna'): void {
    this.setLoading('weather', true);

    this.agronomicApi
      .getCurrentWeather({ city })
      .pipe(
        take(1),
        finalize(() => this.setLoading('weather', false)),
      )
      .subscribe({
        next: (weatherSummary) => this.weatherSummary.set(weatherSummary),
        error: (error) => this.registerError(error),
      });
  }

  fetchDashboardWeather(city: string = 'Tacna'): void {
    const selectedScope = this.selectedDashboardScope();

    if (selectedScope === 'all') {
      this.fetchWeather(city);
      return;
    }

    this.setLoading('weather', true);

    this.agronomicApi
      .getCurrentWeather({ plotId: selectedScope })
      .pipe(
        take(1),
        finalize(() => this.setLoading('weather', false)),
      )
      .subscribe({
        next: (weatherSummary) => {
          if (weatherSummary) {
            this.weatherSummary.set(weatherSummary);
            return;
          }

          this.fetchWeather(city);
        },
        error: (error) => {
          this.registerError(error);
          this.fetchWeather(city);
        },
      });
  }

  refreshDashboardData(city: string = 'Tacna'): void {
    this.fetchPlots();
    this.fetchMonitoringSummary(this.toSummaryPeriod(this.selectedDashboardTimeRange()), true);
    this.fetchDashboardWeather(city);
    this.fetchAgronomicStatistics(this.selectedDashboardScope(), this.selectedDashboardTimeRange());
    this.fetchTrendStatistics(this.selectedTrendPlotId(), this.selectedTrendTimeRange());
    this.fetchDevices();

    const selectedScope = this.selectedDashboardScope();

    if (selectedScope !== 'all') {
      this.fetchRecords(selectedScope, this.toRecordsPeriod(this.selectedDashboardTimeRange()));
      this.fetchYieldForecast(selectedScope);
      return;
    }

    this.agronomicRecords.set([]);
    this.yieldForecast.set(null);
  }

  /**
   * Loads yield predictions for a specific plot.
   * @param {number|string|null} plotId - Plot identifier.
   * @returns {void}
   */
  fetchYieldForecast(plotId: number | string | null): void {
    if (plotId === null || plotId === 'all') {
      this.yieldForecast.set(null);
      return;
    }

    this.setLoading('yieldForecast', true);

    this.agronomicApi
      .getYieldForecastsByPlot(plotId)
      .pipe(
        take(1),
        finalize(() => this.setLoading('yieldForecast', false)),
      )
      .subscribe({
        next: (yieldForecasts) => {
          this.yieldForecast.set(yieldForecasts.at(0) ?? null);
        },
        error: (error) => this.registerError(error),
      });
  }

  /**
   * Loads thermal accumulation summary for the dashboard.
   * @param {string} [period='current'] - Filter period.
   * @returns {void}
   */
  fetchChillHourSummary(period: string = 'current'): void {
    this.setLoading('summary', true);

    this.agronomicApi
      .getCurrentSummary(period)
      .pipe(
        take(1),
        finalize(() => this.setLoading('summary', false)),
      )
      .subscribe({
        next: (summary) => {
          this.monitoringSummary.set(summary);
          this.chillHourRecord.set(summary?.chillHourRecord ?? null);
          this.summaryLoaded.set(Boolean(summary));
        },
        error: (error) => this.registerError(error),
      });
  }

  /**
   * Updates the selected dashboard scope.
   * @param {DashboardScope} scope - Plot identifier or all.
   */
  selectDashboardScope(scope: DashboardScope): void {
    this.selectedDashboardScope.set(scope);
    this.agronomicRecords.set([]);
    this.yieldForecast.set(null);
    this.agronomicStatistics.set(null);

    this.fetchMonitoringSummary(this.toSummaryPeriod(this.selectedDashboardTimeRange()), true);
    this.fetchDashboardWeather();
    this.fetchAgronomicStatistics(scope, this.selectedDashboardTimeRange());

    if (scope !== 'all') {
      this.fetchRecords(scope, this.toRecordsPeriod(this.selectedDashboardTimeRange()));
      this.fetchYieldForecast(scope);
    }
  }

  /**
   * Updates the selected map plot identifier.
   * @param {number|string|null} id - Plot identifier.
   */
  selectMapPlot(id: number | string | null): void {
    this.selectedMapPlotId.set(id);
    this.mapAgronomicRecords.set([]);
    this.fetchMapRecords(id);
  }

  selectTrendPlot(id: DashboardScope): void {
    this.selectedTrendPlotId.set(id);
    this.trendAgronomicStatistics.set(null);
    this.fetchTrendStatistics(id, this.selectedTrendTimeRange());
  }

  selectTrendTimeRange(timeRange: TrendAnalysisTimeRange): void {
    this.selectedTrendTimeRange.set(timeRange);
    this.trendAgronomicStatistics.set(null);
    this.fetchTrendStatistics(this.selectedTrendPlotId(), timeRange);
  }

  selectPlot(id: number | string | null): void {
    this.selectMapPlot(id);
  }

  selectDashboardTimeRange(timeRange: DashboardTimeRange): void {
    this.selectedDashboardTimeRange.set(timeRange);
    this.agronomicStatistics.set(null);

    this.fetchMonitoringSummary(this.toSummaryPeriod(timeRange), true);
    this.fetchAgronomicStatistics(this.selectedDashboardScope(), timeRange);

    const selectedScope = this.selectedDashboardScope();

    if (selectedScope !== 'all') {
      this.fetchRecords(selectedScope, this.toRecordsPeriod(timeRange));
      this.fetchYieldForecast(selectedScope);
    }
  }

  selectStatisticsRange(timeRange: string): void {
    this.selectDashboardTimeRange(this.toDashboardTimeRange(timeRange));
  }

  refreshSelectedPlotData(period: string = '30d'): void {
    const selectedScope = this.selectedDashboardScope();

    if (selectedScope !== 'all') {
      this.fetchRecords(selectedScope, period);
      this.fetchYieldForecast(selectedScope);
    }
  }

  /**
   * Resets temporary telemetry and summary states.
   * @returns {void}
   */
  clearTelemetry(): void {
    this.agronomicRecords.set([]);
    this.mapAgronomicRecords.set([]);
    this.chillHourRecord.set(null);
    this.yieldForecast.set(null);
    this.monitoringSummary.set(null);
    this.summaryLoaded.set(false);
  }

  clearErrors(): void {
    this.errors.set([]);
  }

  /**
   * Gets an IoT device by ID from the local state.
   * @param {number|string} id
   * @returns {IotDevice|null}
   */
  getDeviceById(id: number | string): IotDevice | null {
    return this.devices().find((device) => String(device.id) === String(id)) ?? null;
  }

  getDevicesForScope(scope: DashboardScope): IotDevice[] {
    if (scope === 'all') {
      return this.devices();
    }

    return this.devices().filter((device) => String(device.plotId) === String(scope));
  }

  private getLatestRecord(records: AgronomicRecord[]): AgronomicRecord | null {
    if (records.length === 0) {
      return null;
    }

    return [...records].sort((firstRecord, secondRecord) => {
      const firstDate = firstRecord.recordedAt?.getTime() ?? 0;
      const secondDate = secondRecord.recordedAt?.getTime() ?? 0;

      return secondDate - firstDate;
    })[0];
  }

  private formatRelativeTime(timestamp: number): string {
    const diffInMinutes = Math.max(0, Math.round((Date.now() - timestamp) / 60000));

    if (diffInMinutes < 1) {
      return 'just now';
    }

    if (diffInMinutes < 60) {
      return `${diffInMinutes} min ago`;
    }

    const diffInHours = Math.round(diffInMinutes / 60);

    if (diffInHours < 24) {
      return `${diffInHours} h ago`;
    }

    const diffInDays = Math.round(diffInHours / 24);

    return `${diffInDays} days ago`;
  }

  private createSoilMoistureCard(devices: IotDevice[]): IotSensorCard {
    const averageValue = this.average(devices.map((device) => device.soilMoisture));
    const riskLevel = this.highestRisk(
      devices.map((device) => this.getSoilMoistureRisk(device.soilMoisture)),
    );

    return new IotSensorCard({
      id: 'water-stress-soil-moisture',
      title: 'Water Stress',
      sourceLabel: 'IoT',
      metricLabel: 'Soil moisture',
      metricValue: averageValue,
      metricUnit: '%',
      trend: riskLevel === 'High' ? 'down' : 'stable',
      riskLevel,
      recommendation: this.getSoilMoistureRecommendation(riskLevel),
    });
  }

  private createSoilTemperatureCard(devices: IotDevice[]): IotSensorCard {
    const averageValue = this.average(devices.map((device) => device.temperature));
    const riskLevel = this.highestRisk(
      devices.map((device) => this.getSoilTemperatureRisk(device.temperature)),
    );

    return new IotSensorCard({
      id: 'water-stress-soil-temperature',
      title: 'Water Stress',
      sourceLabel: 'IoT',
      metricLabel: 'Soil temperature',
      metricValue: averageValue,
      metricUnit: '\u00b0C',
      trend: riskLevel === 'High' ? 'up' : 'stable',
      riskLevel,
      recommendation: this.getSoilTemperatureRecommendation(riskLevel),
    });
  }

  private average(values: number[]): number {
    if (values.length === 0) {
      return 0;
    }

    const total = values.reduce((sum, value) => sum + value, 0);

    return Math.round(total / values.length);
  }

  private getSoilMoistureRisk(value: number): IotRiskLevel {
    if (value < 20) {
      return 'High';
    }

    if (value <= 35) {
      return 'Medium';
    }

    return 'Low';
  }

  private getSoilTemperatureRisk(value: number): IotRiskLevel {
    if (value > 30) {
      return 'High';
    }

    if (value >= 25) {
      return 'Medium';
    }

    return 'Low';
  }

  private highestRisk(riskLevels: IotRiskLevel[]): IotRiskLevel {
    const riskWeight: Record<IotRiskLevel, number> = {
      Low: 1,
      Medium: 2,
      High: 3,
    };

    return (
      riskLevels.sort((first, second) => riskWeight[second] - riskWeight[first]).at(0) ?? 'Low'
    );
  }

  private getSoilMoistureRecommendation(riskLevel: IotRiskLevel): string {
    if (riskLevel === 'High') {
      return 'Irrigation attention required.';
    }

    if (riskLevel === 'Medium') {
      return 'Monitor soil moisture trend.';
    }

    return 'Moisture conditions are stable.';
  }

  private getSoilTemperatureRecommendation(riskLevel: IotRiskLevel): string {
    if (riskLevel === 'High') {
      return 'Temperature may increase water stress.';
    }

    if (riskLevel === 'Medium') {
      return 'Watch temperature exposure.';
    }

    return 'Temperature is within expected range.';
  }

  private formatRelativeSync(timestamp: number): string {
    const diffInMinutes = Math.max(0, Math.round((Date.now() - timestamp) / 60000));

    if (diffInMinutes < 1) {
      return 'Last sync: just now';
    }

    if (diffInMinutes < 60) {
      return `Last sync: ${diffInMinutes} min ago`;
    }

    const diffInHours = Math.round(diffInMinutes / 60);

    if (diffInHours < 24) {
      return `Last sync: ${diffInHours} h ago`;
    }

    const diffInDays = Math.round(diffInHours / 24);

    return `Last sync: ${diffInDays} days ago`;
  }

  private toDashboardTimeRange(timeRange: string): DashboardTimeRange {
    const validRanges: DashboardTimeRange[] = ['current', '7days', '30days'];

    return validRanges.includes(timeRange as DashboardTimeRange)
      ? (timeRange as DashboardTimeRange)
      : 'current';
  }

  private toStatisticsTimeRange(timeRange: DashboardTimeRange): string {
    if (timeRange === 'current') {
      return '30days';
    }

    return timeRange;
  }

  private toSummaryPeriod(timeRange: DashboardTimeRange): string {
    return timeRange;
  }

  private toRecordsPeriod(timeRange: DashboardTimeRange): string | undefined {
    if (timeRange === 'current') {
      return undefined;
    }

    return timeRange;
  }

  private fetchFallbackAgronomicStatistics(
    plotId: number | string,
    timeRange: DashboardTimeRange,
  ): void {
    if (timeRange === '30days') {
      this.agronomicStatistics.set(null);
      return;
    }

    this.setLoading('statistics', true);

    this.agronomicApi
      .getAgronomicStatistics({
        plotId,
        timeRange: '30days',
      })
      .pipe(
        take(1),
        finalize(() => this.setLoading('statistics', false)),
      )
      .subscribe({
        next: (statistics) => {
          this.agronomicStatistics.set(
            statistics ? this.toDashboardStatistics(statistics, timeRange, true) : null,
          );
        },
        error: (error) => this.registerError(error),
      });
  }

  private fetchFallbackTrendStatistics(
    plotId: number | string,
    timeRange: TrendAnalysisTimeRange,
  ): void {
    if (timeRange === '30days') {
      this.trendAgronomicStatistics.set(null);
      return;
    }

    if (timeRange === 'campaign') {
      this.trendAgronomicStatistics.set(null);
      return;
    }

    this.setLoading('statistics', true);

    this.agronomicApi
      .getAgronomicStatistics({
        plotId,
        timeRange: '30days',
      })
      .pipe(
        take(1),
        finalize(() => this.setLoading('statistics', false)),
      )
      .subscribe({
        next: (statistics) => {
          this.trendAgronomicStatistics.set(
            statistics
              ? this.sliceStatistics(
                  statistics,
                  timeRange,
                  2,
                  '7-day view based on the latest available trend data.',
                )
              : null,
          );
        },
        error: (error) => this.registerError(error),
      });
  }

  private toDashboardStatistics(
    statistics: AgronomicStatistics,
    timeRange: DashboardTimeRange,
    fromFallback = false,
  ): AgronomicStatistics {
    if (timeRange === 'current') {
      return this.sliceStatistics(
        statistics,
        timeRange,
        1,
        'Current state based on the latest available trend data.',
      );
    }

    if (timeRange === '7days' && fromFallback) {
      return this.sliceStatistics(
        statistics,
        timeRange,
        2,
        '7-day view based on the latest available trend data.',
      );
    }

    return statistics;
  }

  private sliceStatistics(
    statistics: AgronomicStatistics,
    timeRange: DashboardTimeRange | TrendAnalysisTimeRange,
    points: number,
    description: string,
  ): AgronomicStatistics {
    const labels = statistics.labels.slice(-points);
    const ndviSeries = statistics.ndviSeries.slice(-points);
    const cpSeries = statistics.cpSeries.slice(-points);
    const trend = this.toStatisticsTrend(ndviSeries);

    return new AgronomicStatistics({
      id: `${statistics.id ?? statistics.plotId ?? 'statistics'}-${timeRange}`,
      plotId: statistics.plotId,
      timeRange,
      labels,
      ndviSeries,
      cpSeries,
      threshold: statistics.threshold,
      observation: statistics.observation,
      description,
      trend,
      statusLabel: statistics.statusLabel,
    });
  }

  private createDashboardRecordFromStatistics(): AgronomicRecord | null {
    if (this.selectedDashboardTimeRange() === 'current') {
      return null;
    }

    const statistics = this.agronomicStatistics();

    if (!statistics?.hasNdviData) {
      return null;
    }

    return new AgronomicRecord({
      plotId: this.selectedDashboardScope(),
      ndviIndex: statistics.currentNdviValue,
      ndviTrend: this.toNdviTrend(statistics.ndviSeries),
      ndviStatusLabel: statistics.statusLabel || statistics.trend,
    });
  }

  private createChillRecordFromStatistics(): ChillHourRecord | null {
    if (this.selectedDashboardTimeRange() === 'current') {
      return null;
    }

    const statistics = this.agronomicStatistics();
    const currentCp = statistics?.cpSeries.at(-1);

    if (currentCp === undefined) {
      return null;
    }

    const previousCp = statistics?.cpSeries.at(0) ?? currentCp;

    return new ChillHourRecord({
      plotId: this.selectedDashboardScope(),
      accumulatedChillPortions: currentCp,
      weeklyDiff: currentCp - previousCp,
      threshold: statistics?.threshold ?? 600,
    });
  }

  private toNdviTrend(values: number[]): 'up' | 'down' | 'stable' {
    const first = values.at(0);
    const last = values.at(-1);

    if (first === undefined || last === undefined || first === last) {
      return 'stable';
    }

    return last > first ? 'up' : 'down';
  }

  private toStatisticsTrend(values: number[]): 'Stable' | 'Up' | 'Down' {
    const trend = this.toNdviTrend(values);

    if (trend === 'up') {
      return 'Up';
    }

    if (trend === 'down') {
      return 'Down';
    }

    return 'Stable';
  }

  private setLoading(key: keyof AgronomicLoadingState, value: boolean): void {
    this.loading.update((state) => ({
      ...state,
      [key]: value,
    }));
  }

  private registerError(error: unknown): void {
    this.errors.update((errors) => [...errors, error]);
  }
}

import { computed, inject, Injectable, signal } from '@angular/core';
import { finalize, take } from 'rxjs';

import { AgronomicApiService, AgronomicQueryParams } from '../infrastructure/agronomic-api.service';

import { Plot } from '../domain/model/plot.entity';
import { AgronomicRecord } from '../domain/model/agronomic-record.entity';
import { WeatherSummary } from '../domain/model/weather-summary.entity';
import { YieldForecast } from '../domain/model/yield-forecast.entity';
import { ChillHourRecord } from '../domain/model/chill-hour-record.entity';
import { MonitoringSummary } from '../domain/model/monitoring-summary.entity';
import { IotDeviceSummary, IotSensorCard } from '../domain/model/iot-device-summary.entity';

export interface AgronomicLoadingState {
  plots: boolean;
  records: boolean;
  weather: boolean;
  yieldForecast: boolean;
  summary: boolean;
  iotDevices: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AgronomicStore {
  private readonly agronomicApi = inject(AgronomicApiService);

  readonly plots = signal<Plot[]>([]);
  readonly selectedPlotId = signal<number | string | null>(null);

  readonly agronomicRecords = signal<AgronomicRecord[]>([]);
  readonly weatherSummary = signal<WeatherSummary | null>(null);
  readonly yieldForecast = signal<YieldForecast | null>(null);
  readonly chillHourRecord = signal<ChillHourRecord | null>(null);
  readonly monitoringSummary = signal<MonitoringSummary | null>(null);

  readonly errors = signal<unknown[]>([]);

  readonly plotsLoaded = signal<boolean>(false);
  readonly summaryLoaded = signal<boolean>(false);

  readonly iotDeviceSummary = signal<IotDeviceSummary | null>(null);

  /**
   * Selected plot identifier for map.
   * @type {import('@angular/core').WritableSignal<number | string | null>}
   */
  readonly selectedMapPlotId = signal<number | string | null>(null);

  readonly loading = signal<AgronomicLoadingState>({
    iotDevices: false,
    plots: false,
    records: false,
    weather: false,
    yieldForecast: false,
    summary: false,
  });

  readonly selectedPlot = computed<Plot | null>(() => {
    const selectedId = this.selectedPlotId();

    if (selectedId === null) {
      return null;
    }

    return this.plots().find((plot) => String(plot.id) === String(selectedId)) ?? null;
  });

  readonly selectedPlotIotSensorCards = computed<IotSensorCard[]>(() => {
    const selectedId = this.selectedPlotId();
    const summary = this.iotDeviceSummary();

    if (selectedId === null || !summary) {
      return [];
    }

    return summary.sensorCards.filter((card) => String(card.plotId) === String(selectedId));
  });

  readonly selectedPlotLatestRecord = computed<AgronomicRecord | null>(() => {
    const selectedId = this.selectedPlotId();

    if (selectedId === null) {
      return null;
    }

    const records = this.agronomicRecords().filter(
      (record) => String(record.plotId) === String(selectedId),
    );

    if (records.length === 0) {
      return null;
    }

    return [...records].sort((firstRecord, secondRecord) => {
      const firstDate = firstRecord.recordedAt?.getTime() ?? 0;
      const secondDate = secondRecord.recordedAt?.getTime() ?? 0;

      return secondDate - firstDate;
    })[0];
  });

  readonly latestAgronomicRecord = computed<AgronomicRecord | null>(() => {
    const selectedRecord = this.selectedPlotLatestRecord();

    if (selectedRecord) {
      return selectedRecord;
    }

    const records = this.agronomicRecords();

    if (records.length === 0) {
      return null;
    }

    return [...records].sort((firstRecord, secondRecord) => {
      const firstDate = firstRecord.recordedAt?.getTime() ?? 0;
      const secondDate = secondRecord.recordedAt?.getTime() ?? 0;

      return secondDate - firstDate;
    })[0];
  });

  readonly selectedPlotNdviLabel = computed<string>(() => {
    const record = this.selectedPlotLatestRecord();
    const plot = this.selectedPlot();

    const ndviValue = record?.ndviIndex ?? plot?.currentImagery?.ndviMean ?? 0;

    return ndviValue.toFixed(2);
  });

  readonly selectedPlotNdviTrend = computed<string>(() => {
    const trend = this.selectedPlotLatestRecord()?.ndviTrend ?? 'stable';

    if (trend === 'up') {
      return '↑';
    }

    if (trend === 'down') {
      return '↓';
    }

    return '→';
  });

  readonly selectedPlotLastUpdateLabel = computed<string>(() => {
    const plot = this.selectedPlot();

    if (!plot?.lastUpdate) {
      return 'Pending';
    }

    const lastUpdateTimestamp = Date.parse(plot.lastUpdate);

    if (Number.isNaN(lastUpdateTimestamp)) {
      return 'Pending';
    }

    const diffInMinutes = Math.max(0, Math.round((Date.now() - lastUpdateTimestamp) / 60000));

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
  });

  readonly selectedYieldForecast = computed<YieldForecast | null>(() => {
    return this.yieldForecast() ?? this.monitoringSummary()?.yieldForecast ?? null;
  });

  readonly plotsCount = computed<number>(() => {
    return this.plotsLoaded() ? this.plots().length : 0;
  });

  readonly recordsCount = computed<number>(() => {
    return this.agronomicRecords().length;
  });

  readonly hasErrors = computed<boolean>(() => {
    return this.errors().length > 0;
  });

  fetchIotDeviceSummary(): void {
    this.setLoading('iotDevices', true);

    this.agronomicApi
      .getIotDeviceSummary()
      .pipe(
        take(1),
        finalize(() => this.setLoading('iotDevices', false)),
      )
      .subscribe({
        next: (summary) => this.iotDeviceSummary.set(summary),
        error: (error) => this.registerError(error),
      });
  }

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

          if (plots.length > 0 && this.selectedPlotId() === null) {
            this.selectPlot(plots[0].id);
          }
        },
        error: (error) => this.registerError(error),
      });
  }

  fetchMonitoringSummary(period: string = 'current'): void {
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
          this.summaryLoaded.set(Boolean(summary));

          this.chillHourRecord.set(summary?.chillHourRecord ?? null);

          if (!this.yieldForecast()) {
            this.yieldForecast.set(summary?.yieldForecast ?? null);
          }
        },
        error: (error) => this.registerError(error),
      });
  }

  fetchRecords(plotId: number | string | null, period: string = '30d'): void {
    if (plotId === null) {
      return;
    }

    this.setLoading('records', true);

    const params: AgronomicQueryParams = {
      plotId,
      period,
    };

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

  fetchYieldForecast(plotId: number | string | null): void {
    if (plotId === null) {
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

  selectPlot(id: number | string | null): void {
    this.selectedPlotId.set(id);
    this.agronomicRecords.set([]);
    this.yieldForecast.set(null);

    if (id !== null) {
      this.fetchRecords(id);
      this.fetchYieldForecast(id);
    }
  }

  refreshSelectedPlotData(period: string = '30d'): void {
    const selectedId = this.selectedPlotId();

    if (selectedId === null) {
      return;
    }

    this.fetchRecords(selectedId, period);
    this.fetchYieldForecast(selectedId);
  }

  clearTelemetry(): void {
    this.agronomicRecords.set([]);
    this.chillHourRecord.set(null);
    this.yieldForecast.set(null);
    this.monitoringSummary.set(null);
    this.summaryLoaded.set(false);
  }

  clearErrors(): void {
    this.errors.set([]);
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

  /**
   * Updates the selected map plot identifier.
   * @param {number|string|null} id - Plot identifier.
   */
  selectMapPlot(id: number | string | null): void {
    this.selectedMapPlotId.set(id);
    this.mapAgronomicRecords.set([]);
    this.fetchMapRecords(id);
  }
}

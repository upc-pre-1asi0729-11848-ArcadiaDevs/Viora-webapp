import { AgronomicRecord } from './agronomic-record.entity';
import { ChillHourRecord } from './chill-hour-record.entity';
import { YieldForecast } from './yield-forecast.entity';
import { OverallPlotHealth } from './overall-plot-health.entity';

export type MonitoringSummaryId = number | string | null;

export interface MonitoringSummaryProperties {
  id?: MonitoringSummaryId;
  period?: string;
  ndvi?: AgronomicRecord | Record<string, unknown> | null;
  chillAccumulation?: ChillHourRecord | Record<string, unknown> | null;
  yieldForecast?: YieldForecast | Record<string, unknown> | null;
  overallHealth?: OverallPlotHealth | Record<string, unknown> | null;
  updatedAt?: string;
}

export class MonitoringSummary {
  readonly id: MonitoringSummaryId;
  readonly period: string;
  readonly latestNdvi: AgronomicRecord;
  readonly chillHourRecord: ChillHourRecord;
  readonly yieldForecast: YieldForecast;
  readonly overallPlotHealth: OverallPlotHealth;
  readonly updatedAt: string;

  constructor({
    id = null,
    period = 'current',
    ndvi = null,
    chillAccumulation = null,
    yieldForecast = null,
    overallHealth = null,
    updatedAt = '',
  }: MonitoringSummaryProperties = {}) {
    this.id = id;
    this.period = period;

    this.latestNdvi = ndvi instanceof AgronomicRecord ? ndvi : new AgronomicRecord(ndvi ?? {});

    this.chillHourRecord =
      chillAccumulation instanceof ChillHourRecord
        ? chillAccumulation
        : new ChillHourRecord(chillAccumulation ?? {});

    this.yieldForecast =
      yieldForecast instanceof YieldForecast
        ? yieldForecast
        : new YieldForecast(yieldForecast ?? {});

    this.overallPlotHealth =
      overallHealth instanceof OverallPlotHealth
        ? overallHealth
        : new OverallPlotHealth(overallHealth ?? {});

    this.updatedAt = updatedAt;
  }

  get hasUpdatedAt(): boolean {
    return Boolean(this.updatedAt);
  }

  get updatedAtDate(): Date | null {
    if (!this.updatedAt) {
      return null;
    }

    const parsedDate = new Date(this.updatedAt);

    return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
  }

  get isCurrentPeriod(): boolean {
    return this.period === 'current';
  }
}

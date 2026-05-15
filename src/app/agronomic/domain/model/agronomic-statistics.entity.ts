/**
 * @file agronomic-statistics.entity.ts
 * @description Domain entity representing historical agronomic performance data.
 */

export type AgronomicStatisticsId = number | string | null;
export type AgronomicStatisticsPlotId = number | string | null;
export type AgronomicTimeRange = 'current' | '7days' | '30days' | 'campaign';
export type AgronomicTrend = 'Stable' | 'Up' | 'Down' | 'Review';

export interface AgronomicStatisticsProperties {
  id?: AgronomicStatisticsId;
  plotId?: AgronomicStatisticsPlotId;
  timeRange?: AgronomicTimeRange;
  labels?: string[];
  ndviSeries?: number[];
  cpSeries?: number[];
  threshold?: number;
  observation?: string;
  description?: string;
  trend?: AgronomicTrend;
  statusLabel?: string;
}

export class AgronomicStatistics {
  readonly id: AgronomicStatisticsId;
  readonly plotId: AgronomicStatisticsPlotId;
  readonly timeRange: AgronomicTimeRange;
  readonly labels: string[];
  readonly ndviSeries: number[];
  readonly cpSeries: number[];
  readonly threshold: number;
  readonly observation: string;
  readonly description: string;
  readonly trend: AgronomicTrend;
  readonly statusLabel: string;

  /**
   * @param {AgronomicStatisticsProperties} params - Entity data.
   * @param {AgronomicStatisticsId} [params.id] - Unique identifier.
   * @param {AgronomicStatisticsPlotId} [params.plotId] - Associated plot ID.
   * @param {AgronomicTimeRange} [params.timeRange] - Selection range.
   * @param {string[]} [params.labels] - Date labels for the chart.
   * @param {number[]} [params.ndviSeries] - NDVI values for the bars.
   * @param {number[]} [params.cpSeries] - Chill Portions values for the line.
   * @param {number} [params.threshold] - CP threshold for reference.
   * @param {string} [params.observation] - Observation note.
   * @param {string} [params.description] - Summary description.
   * @param {AgronomicTrend} [params.trend] - Trend description.
   * @param {string} [params.statusLabel] - Status label.
   */
  constructor({
    id = null,
    plotId = null,
    timeRange = '30days',
    labels = [],
    ndviSeries = [],
    cpSeries = [],
    threshold = 600,
    observation = '',
    description = '',
    trend = 'Stable',
    statusLabel = 'Stable',
  }: AgronomicStatisticsProperties = {}) {
    this.id = id;
    this.plotId = plotId;
    this.timeRange = timeRange;
    this.labels = labels;
    this.ndviSeries = ndviSeries;
    this.cpSeries = cpSeries;
    this.threshold = threshold;
    this.observation = observation;
    this.description = description;
    this.trend = trend;
    this.statusLabel = statusLabel;
  }

  get currentNdviValue(): number {
    return this.ndviSeries.at(-1) ?? 0;
  }

  get currentNdviLabel(): string {
    return this.currentNdviValue.toFixed(2);
  }

  get hasNdviData(): boolean {
    return this.labels.length > 0 && this.ndviSeries.length > 0;
  }

  get trendLabel(): string {
    const rangeLabel =
      this.timeRange === 'current'
        ? 'Current state'
        : this.timeRange === '7days'
          ? '7-day trend'
          : this.timeRange === '30days'
            ? '30-day trend'
            : 'Campaign trend';

    return `${rangeLabel}: ${this.statusLabel}`;
  }
}

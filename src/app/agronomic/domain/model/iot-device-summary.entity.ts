/**
 * @file iot-device-summary.entity.ts
 * @description Domain entity representing the summary of IoT devices and sensor cards.
 */

export type IotRiskLevel = 'Low' | 'Medium' | 'High';
export type IotTrend = 'up' | 'down' | 'stable';
export type IotSensorCardId = number | string | null;
export type IotDeviceSummaryId = number | string | null;
export type IotSensorPlotId = number | string | null;

export interface IotSensorCardProperties {
  id?: IotSensorCardId;
  plotId?: IotSensorPlotId;
  title?: string;
  sourceLabel?: string;
  metricLabel?: string;
  metricValue?: number;
  metricUnit?: string;
  trend?: IotTrend;
  riskLevel?: IotRiskLevel;
  recommendation?: string;
}

export interface IotDeviceSummaryProperties {
  id?: IotDeviceSummaryId;
  totalOnlineDevices?: number;
  plotsWithIot?: number;
  lastSync?: string;
  sensorCards?: IotSensorCard[];
}

export class IotSensorCard {
  readonly id: IotSensorCardId;
  readonly plotId: IotSensorPlotId;
  readonly title: string;
  readonly sourceLabel: string;
  readonly metricLabel: string;
  readonly metricValue: number;
  readonly metricUnit: string;
  readonly trend: IotTrend;
  readonly riskLevel: IotRiskLevel;
  readonly recommendation: string;

  /**
   * @param {IotSensorCardProperties} params - Entity data.
   * @param {IotSensorCardId} [params.id] - Unique identifier.
   * @param {IotSensorPlotId} [params.plotId] - Associated plot ID.
   * @param {string} [params.title] - Sensor title.
   * @param {string} [params.sourceLabel] - Source label.
   * @param {string} [params.metricLabel] - Metric label.
   * @param {number} [params.metricValue] - Sensor reading value.
   * @param {string} [params.metricUnit] - Unit of measurement.
   * @param {IotTrend} [params.trend] - Trend of the metric.
   * @param {IotRiskLevel} [params.riskLevel] - Risk level.
   * @param {string} [params.recommendation] - Recommended action.
   */
  constructor({
                id = null,
                plotId = null,
                title = '',
                sourceLabel = 'IoT',
                metricLabel = '',
                metricValue = 0,
                metricUnit = '',
                trend = 'stable',
                riskLevel = 'Low',
                recommendation = ''
              }: IotSensorCardProperties = {}) {
    this.id = id;
    this.plotId = plotId;
    this.title = title;
    this.sourceLabel = sourceLabel;
    this.metricLabel = metricLabel;
    this.metricValue = metricValue;
    this.metricUnit = metricUnit;
    this.trend = trend;
    this.riskLevel = riskLevel;
    this.recommendation = recommendation;
  }

  get metricValueLabel(): string {
    return `${this.metricValue}${this.metricUnit}`;
  }

  get trendSymbol(): string {
    if (this.trend === 'up') {
      return '\u2191';
    }

    if (this.trend === 'down') {
      return '\u2193';
    }

    return '\u2192';
  }

  get requiresAttention(): boolean {
    return this.riskLevel === 'Medium' || this.riskLevel === 'High';
  }
}

export class IotDeviceSummary {
  readonly id: IotDeviceSummaryId;
  readonly totalOnlineDevices: number;
  readonly plotsWithIot: number;
  readonly lastSync: string;
  readonly sensorCards: IotSensorCard[];

  /**
   * @param {IotDeviceSummaryProperties} params - Entity data.
   * @param {IotDeviceSummaryId} [params.id] - Unique identifier.
   * @param {number} [params.totalOnlineDevices] - Total active devices.
   * @param {number} [params.plotsWithIot] - Plots with connected sensors.
   * @param {string} [params.lastSync] - Last synchronization timestamp.
   * @param {IotSensorCard[]} [params.sensorCards] - List of sensor cards.
   */
  constructor({
                id = null,
                totalOnlineDevices = 0,
                plotsWithIot = 0,
                lastSync = '',
                sensorCards = []
              }: IotDeviceSummaryProperties = {}) {
    this.id = id;
    this.totalOnlineDevices = totalOnlineDevices;
    this.plotsWithIot = plotsWithIot;
    this.lastSync = lastSync;
    this.sensorCards = sensorCards;
  }

  get hasConnectedDevices(): boolean {
    return this.totalOnlineDevices > 0;
  }

  get lastSyncLabel(): string {
    if (!this.lastSync) {
      return 'No sync yet';
    }

    const timestamp = Date.parse(this.lastSync);

    if (Number.isNaN(timestamp)) {
      return 'Sync unavailable';
    }

    const diffInMinutes = Math.max(0, Math.round((Date.now() - timestamp) / 60000));

    if (diffInMinutes < 1) {
      return 'Last sync: just now';
    }

    if (diffInMinutes < 60) {
      return `Last sync: ${diffInMinutes} min ago`;
    }

    const hours = Math.round(diffInMinutes / 60);

    return `Last sync: ${hours} h ago`;
  }
}
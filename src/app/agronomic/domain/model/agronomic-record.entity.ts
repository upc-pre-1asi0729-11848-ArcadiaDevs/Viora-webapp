export type NdviTrend = 'up' | 'down' | 'stable';

export type AgronomicRecordId = number | string | null;

export type AgronomicRecordPlotId = number | string | null;

export interface AgronomicRecordProperties {
  id?: AgronomicRecordId;
  plotId?: AgronomicRecordPlotId;
  date?: string;
  ndviIndex?: number;
  ndviTrend?: NdviTrend;
  ndviStatusLabel?: string;
  temp?: number;
  cp?: number;
  yieldValue?: number;
}

export class AgronomicRecord {
  readonly id: AgronomicRecordId;
  readonly plotId: AgronomicRecordPlotId;
  readonly date: string;
  readonly ndviIndex: number;
  readonly ndviTrend: NdviTrend;
  readonly ndviStatusLabel: string;
  readonly temp: number;
  readonly cp: number;
  readonly yieldValue: number;

  constructor({
    id = null,
    plotId = null,
    date = '',
    ndviIndex = 0,
    ndviTrend = 'stable',
    ndviStatusLabel = '',
    temp = 0,
    cp = 0,
    yieldValue = 0,
  }: AgronomicRecordProperties = {}) {
    this.id = id;
    this.plotId = plotId;
    this.date = date;
    this.ndviIndex = ndviIndex;
    this.ndviTrend = ndviTrend;
    this.ndviStatusLabel = ndviStatusLabel;
    this.temp = temp;
    this.cp = cp;
    this.yieldValue = yieldValue;
  }

  hasAlternanceRisk(threshold: number = 600): boolean {
    return this.cp < threshold;
  }

  calculateYieldFromArea(areaSize: number): number {
    if (!Number.isFinite(areaSize) || !Number.isFinite(this.ndviIndex)) {
      return 0;
    }

    return Number((areaSize * this.ndviIndex).toFixed(2));
  }

  get ndviLabel(): string {
    return this.ndviIndex.toFixed(2);
  }

  get temperatureLabel(): string {
    return `${this.temp.toFixed(1)}°C`;
  }

  get chillPortionsLabel(): string {
    return `${this.cp} CP`;
  }

  get isNdviImproving(): boolean {
    return this.ndviTrend === 'up';
  }

  get isNdviDecreasing(): boolean {
    return this.ndviTrend === 'down';
  }

  get recordedAt(): Date | null {
    if (!this.date) {
      return null;
    }

    const parsedDate = new Date(this.date);

    return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
  }
}

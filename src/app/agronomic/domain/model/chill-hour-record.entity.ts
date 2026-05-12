export type ChillHourRecordId = number | string | null;

export type ChillHourRecordPlotId = number | string | null;

export interface ChillHourRecordProperties {
  id?: ChillHourRecordId;
  plotId?: ChillHourRecordPlotId;
  accumulatedChillPortions?: number;
  weeklyDiff?: number;
  threshold?: number;
  generatedAt?: string;
}

export class ChillHourRecord {
  readonly id: ChillHourRecordId;
  readonly plotId: ChillHourRecordPlotId;
  readonly accumulatedChillPortions: number;
  readonly weeklyDiff: number;
  readonly threshold: number;
  readonly generatedAt: string;

  constructor({
                id = null,
                plotId = null,
                accumulatedChillPortions = 0,
                weeklyDiff = 0,
                threshold = 600,
                generatedAt = ''
              }: ChillHourRecordProperties = {}) {
    this.id = id;
    this.plotId = plotId;
    this.accumulatedChillPortions = accumulatedChillPortions;
    this.weeklyDiff = weeklyDiff;
    this.threshold = threshold;
    this.generatedAt = generatedAt;
  }

  get chillPortionsLabel(): string {
    return `${this.accumulatedChillPortions} CP`;
  }

  get weeklyDiffLabel(): string {
    const sign = this.weeklyDiff >= 0 ? '+' : '-';
    const value = Math.abs(this.weeklyDiff);

    return `${sign}${value} from last week`;
  }

  get isImproving(): boolean {
    return this.weeklyDiff > 0;
  }

  get isDeclining(): boolean {
    return this.weeklyDiff < 0;
  }

  get progressPercentage(): number {
    if (this.threshold <= 0) {
      return 0;
    }

    return Math.min(
      Math.round((this.accumulatedChillPortions / this.threshold) * 100),
      100
    );
  }

  get remainingChillPortions(): number {
    return Math.max(this.threshold - this.accumulatedChillPortions, 0);
  }

  get hasReachedThreshold(): boolean {
    return this.accumulatedChillPortions >= this.threshold;
  }

  get generatedAtDate(): Date | null {
    if (!this.generatedAt) {
      return null;
    }

    const parsedDate = new Date(this.generatedAt);

    return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
  }
}

/**
 * @file satellite-imagery.entity.ts
 * @description Domain entity representing satellite imagery data.
 */

export type SatelliteImageryId = number | string | null;

export type SatelliteImageryPlotId = number | string | null;

export interface SatelliteImageryProperties {
  id?: SatelliteImageryId;
  plotId?: SatelliteImageryPlotId;
  tileUrl?: string;
  captureDate?: string;
  ndviMean?: number;
  cloudPercentage?: number;
}

export class SatelliteImagery {
  readonly id: SatelliteImageryId;
  readonly plotId: SatelliteImageryPlotId;
  readonly tileUrl: string;
  readonly captureDate: string;
  readonly ndviMean: number;
  readonly cloudPercentage: number;

  /**
   * @param {SatelliteImageryProperties} params - Entity data.
   * @param {SatelliteImageryId} [params.id] - Unique identifier.
   * @param {SatelliteImageryPlotId} [params.plotId] - Associated plot ID.
   * @param {string} [params.tileUrl] - URL of the map tile.
   * @param {string} [params.captureDate] - Capture date.
   * @param {number} [params.ndviMean] - Mean NDVI value.
   * @param {number} [params.cloudPercentage] - Percentage of cloud cover.
   */
  constructor({
                id = null,
                plotId = null,
                tileUrl = '',
                captureDate = '',
                ndviMean = 0,
                cloudPercentage = 0
              }: SatelliteImageryProperties = {}) {
    this.id = id;
    this.plotId = plotId;
    this.tileUrl = tileUrl;
    this.captureDate = captureDate;
    this.ndviMean = ndviMean;
    this.cloudPercentage = cloudPercentage;
  }

  get isReliable(): boolean {
    return this.cloudPercentage < 10;
  }

  get recommendedOpacity(): number {
    return this.cloudPercentage > 20 ? 0.4 : 0.8;
  }

  get ndviLabel(): string {
    return this.ndviMean.toFixed(2);
  }

  get cloudPercentageLabel(): string {
    return `${this.cloudPercentage.toFixed(1)}%`;
  }

  get captureDateValue(): Date | null {
    if (!this.captureDate) {
      return null;
    }

    const parsedDate = new Date(this.captureDate);

    return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
  }
}

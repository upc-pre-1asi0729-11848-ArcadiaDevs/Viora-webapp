export type YieldForecastId = number | string | null;

export type YieldForecastPlotId = number | string | null;

export type YieldRiskLevel = 'Low' | 'Medium' | 'High';

export interface YieldForecastProperties {
  id?: YieldForecastId;
  plotId?: YieldForecastPlotId;
  tonnes?: number;
  riskLevel?: YieldRiskLevel;
  description?: string;
}

export class YieldForecast {
  readonly id: YieldForecastId;
  readonly plotId: YieldForecastPlotId;
  readonly tonnes: number;
  readonly riskLevel: YieldRiskLevel;
  readonly description: string;

  constructor({
                id = null,
                plotId = null,
                tonnes = 0,
                riskLevel = 'Low',
                description = ''
              }: YieldForecastProperties = {}) {
    this.id = id;
    this.plotId = plotId;
    this.tonnes = tonnes;
    this.riskLevel = riskLevel;
    this.description = description;
  }

  get tonnesLabel(): string {
    return `${this.tonnes.toFixed(1)} t`;
  }

  get hasAlternateBearingRisk(): boolean {
    return this.riskLevel === 'Medium' || this.riskLevel === 'High';
  }

  get isHighRisk(): boolean {
    return this.riskLevel === 'High';
  }
}

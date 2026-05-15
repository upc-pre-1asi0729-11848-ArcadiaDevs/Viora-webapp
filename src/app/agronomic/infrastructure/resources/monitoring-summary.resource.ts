import { AgronomicRecordResource } from './agronomic-record.resource';
import { ChillHourRecordResource } from './chill-hour-record.resource';
import { YieldForecastResource } from './yield-forecast.resource';
import { OverallPlotHealthResource } from './overall-plot-health.resource';

export interface MonitoringSummaryResource {
  id?: number | string | null;
  period?: string;
  updatedAt?: string;
  ndvi?: AgronomicRecordResource | null;
  chillAccumulation?: ChillHourRecordResource | null;
  yieldForecast?: YieldForecastResource | null;
  overallHealth?: OverallPlotHealthResource | null;
}

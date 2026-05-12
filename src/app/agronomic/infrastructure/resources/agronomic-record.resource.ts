export interface AgronomicRecordResource {
  id?: number | string | null;
  plotId?: number | string | null;
  date?: string;
  ndviIndex?: number;
  ndviTrend?: string;
  ndviStatusLabel?: string;
  temp?: number;
  cp?: number;
  yieldValue?: number;
}

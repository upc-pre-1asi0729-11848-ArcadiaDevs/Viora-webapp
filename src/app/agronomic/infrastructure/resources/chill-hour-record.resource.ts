export interface ChillHourRecordResource {
  id?: number | string | null;
  plotId?: number | string | null;
  accumulatedChillPortions?: number;
  weeklyDiff?: number;
  threshold?: number;
  generatedAt?: string;
}

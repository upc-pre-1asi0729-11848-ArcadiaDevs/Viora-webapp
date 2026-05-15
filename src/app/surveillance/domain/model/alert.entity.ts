/**
 * @file alert.entity.ts
 * @description Domain entity representing a surveillance alert.
 */
export type AlertId = number | string | null;

export type AlertSeverity = 'Low' | 'Medium' | 'High' | 'Critical';

export type AlertStatus =
  | 'Pending'
  | 'Active'
  | 'Suggest'
  | 'Under review'
  | 'In Progress'
  | 'Resolved';

export interface AlertPlotInfo {
  name: string;
  location: string;
  hectares: number;
}

export interface AlertProperties {
  id?: AlertId;
  type?: string;
  description?: string;
  severity?: AlertSeverity;
  date?: string;
  status?: AlertStatus;
  plot?: AlertPlotInfo;
}

export class Alert {
  readonly id: AlertId;
  readonly type: string;
  readonly description: string;
  readonly severity: AlertSeverity;
  readonly date: string;
  readonly status: AlertStatus;
  readonly plot: AlertPlotInfo;

  /**
   * @param {AlertProperties} params - Entity data.
   * @param {AlertId} [params.id] - Unique identifier.
   * @param {string} [params.type] - Alert type.
   * @param {string} [params.description] - Detailed description of the alert.
   * @param {AlertSeverity} [params.severity] - Level of urgency.
   * @param {string} [params.date] - Date string for the alert.
   * @param {AlertStatus} [params.status] - Current status.
   * @param {AlertPlotInfo} [params.plot] - Associated plot information.
   */
  constructor({
    id = null,
    type = '',
    description = '',
    severity = 'Low',
    date = '',
    status = 'Pending',
    plot = {
      name: '',
      location: '',
      hectares: 0,
    },
  }: AlertProperties = {}) {
    this.id = id;
    this.type = type;
    this.description = description;
    this.severity = severity;
    this.date = date;
    this.status = status;
    this.plot = plot;
  }

  get requiresUrgentAction(): boolean {
    const isSevere = this.severity === 'Critical' || this.severity === 'High';
    const isOpen = this.status === 'Active' || this.status === 'Pending';

    return isSevere && isOpen;
  }

  get dateValue(): Date | null {
    if (!this.date) {
      return null;
    }

    const parsedDate = new Date(this.date);

    return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
  }

  get formattedDate(): string {
    const parsedDate = this.dateValue;

    if (!parsedDate) {
      return 'No date';
    }

    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    }).format(parsedDate);
  }

  get plotSummaryLabel(): string {
    return `${this.plot.location} · ${this.plot.hectares} ha`;
  }

  get descriptionPreview(): string {
    if (this.description.length <= 34) {
      return this.description;
    }

    return `${this.description.slice(0, 34)}...`;
  }
}

export interface PlotInfo {
  name: string;
  location: string;
  hectares: number;
}

export class Alert {
  id: number | null;
  type: string;
  description: string;
  severity: string;
  date: string;
  status: string;
  plot: PlotInfo;

  constructor(
    id: number | null = null,
    type: string = '',
    description: string = '',
    severity: string = 'Low',
    date: string = '',
    status: string = 'Pending',
    plot: PlotInfo = { name: '', location: '', hectares: 0 },
  ) {
    this.id = id;
    this.type = type;
    this.description = description;
    this.severity = severity;
    this.date = date;
    this.status = status;
    this.plot = plot;
  }

  get requiresUrgentAction(): boolean {
    return this.severity === 'High' && this.status === 'Pending';
  }
}

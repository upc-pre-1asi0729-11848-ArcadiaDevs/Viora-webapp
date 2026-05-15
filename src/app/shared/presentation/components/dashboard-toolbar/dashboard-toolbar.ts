import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { RouterLink, UrlTree } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

export interface DashboardScopeOption {
  value: number | string;
  label: string;
  labelKey?: string;
  badge?: number;
}

export type DashboardTimeRange = 'current' | '7days' | '30days';

export interface DashboardToolbarViewOption {
  id: string;
  label: string;
  labelKey?: string;
  route?: string | readonly unknown[] | UrlTree;
  icon?: string;
  iconPath?: string;
  active?: boolean;
  disabled?: boolean;
}

export interface DashboardToolbarTimeRangeOption {
  value: DashboardTimeRange;
  label: string;
  labelKey?: string;
}

@Component({
  selector: 'app-dashboard-toolbar',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatSelectModule, RouterLink, TranslatePipe],
  templateUrl: './dashboard-toolbar.html',
  styleUrl: './dashboard-toolbar.css'
})
export class DashboardToolbar {
  @Input() selectedScope: number | string = 'all';
  @Input() selectedTimeRange: DashboardTimeRange = 'current';
  @Input() scopeOptions: DashboardScopeOption[] = [];
  @Input() viewOptions: DashboardToolbarViewOption[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      labelKey: 'toolbar.dashboard',
      iconPath: '/assets/icons/dashboard/grid-outline.svg'
    },
    {
      id: 'plot-overview',
      label: 'Plot Overview',
      labelKey: 'toolbar.plotOverview',
      icon: 'map'
    },
    {
      id: 'weather',
      label: 'Weather',
      labelKey: 'toolbar.weather',
      icon: 'cloud'
    }
  ];
  @Input() timeRangeOptions: DashboardToolbarTimeRangeOption[] = [
    {
      value: 'current',
      label: 'Current',
      labelKey: 'time.current'
    },
    {
      value: '7days',
      label: '7 days',
      labelKey: 'time.7days'
    },
    {
      value: '30days',
      label: '30 days',
      labelKey: 'time.30days'
    }
  ];

  @Output() viewChange = new EventEmitter<string>();
  @Output() scopeChange = new EventEmitter<number | string>();
  @Output() timeRangeChange = new EventEmitter<DashboardTimeRange>();

  protected getIconMask(iconPath: string): string {
    return `url("${iconPath}")`;
  }

  protected selectView(option: DashboardToolbarViewOption): void {
    if (!option.disabled) {
      this.viewChange.emit(option.id);
    }
  }

  protected onScopeSelected(event: MatSelectChange): void {
    this.scopeChange.emit(event.value);
  }

  protected selectTimeRange(timeRange: DashboardTimeRange): void {
    this.timeRangeChange.emit(timeRange);
  }
}

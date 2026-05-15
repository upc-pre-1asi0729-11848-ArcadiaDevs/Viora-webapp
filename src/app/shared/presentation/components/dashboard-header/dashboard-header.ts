import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, UrlTree } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { LanguageSwitcher } from '../language-switcher/language-switcher';

export interface DashboardBreadcrumbItem {
  label: string;
  labelKey?: string;
  route?: string | readonly unknown[] | UrlTree;
  disabled?: boolean;
}

@Component({
  selector: 'app-dashboard-header',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, RouterLink, TranslatePipe, LanguageSwitcher],
  templateUrl: './dashboard-header.html',
  styleUrl: './dashboard-header.css'
})
export class DashboardHeader {
  @Input() title = 'Dashboard / Overview / All plots';
  @Input() subtitle = 'Monitor your plots, health indicators, and active agricultural risks.';
  @Input() updatedLabel = 'No sync yet';
  @Input() breadcrumbs: DashboardBreadcrumbItem[] = [];

  @Output() refresh = new EventEmitter<void>();
  @Output() breadcrumbSelected = new EventEmitter<DashboardBreadcrumbItem>();

  protected get breadcrumbTrail(): DashboardBreadcrumbItem[] {
    if (this.breadcrumbs.length > 0) {
      return this.breadcrumbs;
    }

    return this.title
      .split('/')
      .map(label => label.trim())
      .filter(Boolean)
      .map(label => ({ label }));
  }

  protected onBreadcrumbSelected(item: DashboardBreadcrumbItem): void {
    if (!item.disabled) {
      this.breadcrumbSelected.emit(item);
    }
  }

  protected onRefresh(): void {
    this.refresh.emit();
  }
}

import { Component, OnInit, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';

import { SurveillanceStore } from '../../../application/surveillance.store';
import { Alert } from '../../../domain/model/alert.entity';

@Component({
  selector: 'app-recent-alerts-card',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatButtonModule, TranslatePipe],
  templateUrl: './recent-alerts-card.html',
  styleUrl: './recent-alerts-card.css',
})
export class RecentAlertsCard implements OnInit {
  protected readonly store = inject(SurveillanceStore);

  ngOnInit(): void {
    this.store.fetchRecentAlerts(3);
  }

  protected getSeverityClass(alert: Alert): string {
    return `severity-${alert.severity.toLowerCase()}`;
  }

  protected getStatusClass(alert: Alert): string {
    return `status-${alert.status.toLowerCase().replaceAll(' ', '-')}`;
  }

  protected getAlertIcon(alert: Alert): string {
    const type = alert.type.toLowerCase();

    if (type.includes('pest')) {
      return '/assets/icons/dashboard/bug-outline.svg';
    }

    if (type.includes('ndvi')) {
      return '/assets/icons/dashboard/leaf-outline.svg';
    }

    return '/assets/icons/general/cloud.svg';
  }

  protected getAlertTypeClass(alert: Alert): string {
    const type = alert.type.toLowerCase();

    if (type.includes('pest')) {
      return 'type-pest';
    }

    if (type.includes('ndvi')) {
      return 'type-ndvi';
    }

    return 'type-phenological';
  }
}

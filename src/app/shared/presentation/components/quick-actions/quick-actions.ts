import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AgronomicStore } from '../../../../agronomic/application/agronomic.store';

interface QuickAction {
  label: string;
  iconPath: string;
  route: string;
}

@Component({
  selector: 'app-quick-actions',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './quick-actions.html',
  styleUrl: './quick-actions.css',
})
export class QuickActions {
  private readonly store = inject(AgronomicStore);

  protected readonly queryParams = computed(() => {
    const selectedScope = this.store.selectedDashboardScope();

    return selectedScope === 'all' ? null : { plotId: selectedScope };
  });

  protected readonly actions: QuickAction[] = [
    {
      label: 'View plot details',
      iconPath: '/assets/icons/dashboard/file-tray-stacked-outline.svg',
      route: '/agronomic/plots',
    },
    {
      label: 'Report symptoms',
      iconPath: '/assets/icons/dashboard/bug-outline.svg',
      route: '/surveillance/pest-surveillance/report-symptoms',
    },
    {
      label: 'Open nutrition plan',
      iconPath: '/assets/icons/dashboard/leaf-outline.svg',
      route: '/agronomic/dynamic-nutrition/plan',
    },
    {
      label: 'Request expert',
      iconPath: '/assets/icons/dashboard/people-outline.svg',
      route: '/assistance/expert-assistance/request',
    },
  ];
}

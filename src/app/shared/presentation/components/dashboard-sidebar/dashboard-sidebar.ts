import { Component, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

interface SidebarItem {
  labelKey: string;
  route: string;
  iconPath?: string;
  icon?: string;
  exact?: boolean;
}

@Component({
  selector: 'app-dashboard-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatIconModule, TranslatePipe],
  templateUrl: './dashboard-sidebar.html',
  styleUrl: './dashboard-sidebar.css'
})
export class DashboardSidebar {
  protected readonly collapsed = signal<boolean>(false);

  protected readonly mainItems: SidebarItem[] = [
    {
      labelKey: 'sidebar.dashboard',
      route: '/producer/dashboard',
      iconPath: '/assets/icons/dashboard/grid-outline.svg',
      exact: true
    },
    {
      labelKey: 'sidebar.myPlots',
      route: '/producer/plot',
      iconPath: '/assets/icons/dashboard/file-tray-stacked-outline.svg'
    },
    {
      labelKey: 'sidebar.iotDevices',
      route: '/producer/iot-devices',
      icon: 'memory'
    },
    {
      labelKey: 'sidebar.alerts',
      route: '/producer/alerts',
      iconPath: '/assets/icons/dashboard/megaphone-outline.svg'
    },
    {
      labelKey: 'sidebar.dynamicNutrition',
      route: '/producer/dynamic-nutrition',
      iconPath: '/assets/icons/dashboard/leaf-outline.svg'
    },
    {
      labelKey: 'sidebar.pestSurveillance',
      route: '/producer/pest-surveillance',
      iconPath: '/assets/icons/dashboard/bug-outline.svg'
    },
    {
      labelKey: 'sidebar.expertAssistance',
      route: '/producer/expert-assistance',
      iconPath: '/assets/icons/dashboard/people-outline.svg'
    },
    {
      labelKey: 'sidebar.expenseHistory',
      route: '/producer/expense-history',
      iconPath: '/assets/icons/dashboard/sync-outline.svg'
    }
  ];

  protected readonly secondaryItems: SidebarItem[] = [
    {
      labelKey: 'sidebar.settings',
      route: '/producer/settings',
      iconPath: '/assets/icons/dashboard/settings-outline.svg'
    },
    {
      labelKey: 'sidebar.subscription',
      route: '/producer/subscription',
      iconPath: '/assets/icons/dashboard/diamond-outline.svg'
    },
    {
      labelKey: 'sidebar.support',
      route: '/producer/support',
      iconPath: '/assets/icons/dashboard/information-circle-outline.svg'
    }
  ];

  protected toggleSidebar(): void {
    this.collapsed.update(value => !value);
  }

  protected getIconMask(iconPath: string): string {
    return `url("${iconPath}")`;
  }
}

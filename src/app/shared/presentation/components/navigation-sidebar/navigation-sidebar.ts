import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navigation-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navigation-sidebar.html',
  styleUrls: ['./navigation-sidebar.css']
})
export class NavigationSidebarComponent {
  @Input() collapsed = false;
  @Output() collapsedChange = new EventEmitter<boolean>();

  constructor(private router: Router, private translate: TranslateService) {}

  /** Toggle the sidebar state */
  toggleSidebar() {
    this.collapsedChange.emit(!this.collapsed);
  }

  /** Sidebar navigation structure */
  get mainItems() {
    return [
      {
        label: this.translate.instant('dashboard.sidebar.dashboard'),
        route: '/dashboard',
        iconPath: '/assets/icons/dashboard/grid-outline.svg'
      },
      {
        label: this.translate.instant('dashboard.sidebar.my-plots'),
        route: '/plots',
        iconPath: '/assets/icons/dashboard/file-tray-stacked-outline.svg'
      },
      {
        label: this.translate.instant('dashboard.sidebar.iot-devices'),
        route: '/agronomic/iot-devices',
        iconPath: '/assets/icons/dashboard/construct-outline.svg'
      },
      {
        label: this.translate.instant('dashboard.sidebar.alerts'),
        route: '/alerts',
        iconPath: '/assets/icons/dashboard/megaphone-outline.svg'
      },
      {
        label: this.translate.instant('dashboard.sidebar.dynamic-nutrition'),
        route: '/dynamic-nutrition',
        iconPath: '/assets/icons/dashboard/leaf-outline.svg'
      },
      {
        label: this.translate.instant('dashboard.sidebar.pest-surveillance'),
        route: '/pest-surveillance',
        iconPath: '/assets/icons/dashboard/bug-outline.svg'
      },
      {
        label: this.translate.instant('dashboard.sidebar.expert-assistance'),
        route: '/expert-assistance',
        iconPath: '/assets/icons/dashboard/people-outline.svg'
      },
      {
        label: this.translate.instant('dashboard.sidebar.expense-history'),
        route: '/expense-history',
        iconPath: '/assets/icons/dashboard/sync-outline.svg'
      }
    ];
  }

  get secondaryItems() {
    return [
      {
        label: this.translate.instant('dashboard.sidebar.settings'),
        route: '/settings',
        iconPath: '/assets/icons/dashboard/settings-outline.svg'
      },
      {
        label: this.translate.instant('dashboard.sidebar.subscription'),
        route: '/subscription',
        iconPath: '/assets/icons/dashboard/diamond-outline.svg'
      },
      {
        label: this.translate.instant('dashboard.sidebar.support'),
        route: '/support',
        iconPath: '/assets/icons/dashboard/information-circle-outline.svg'
      }
    ];
  }

  /** Utility to generate icon mask style */
  getIconStyle(path: string) {
    return {
      '--icon-url': `url("${path}")`
    };
  }

  /** Active route check */
  isRouteActive(targetPath: string): boolean {
    return this.router.url === targetPath;
  }
}

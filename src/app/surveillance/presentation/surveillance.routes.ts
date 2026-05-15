import { Routes } from '@angular/router';

const comingSoonPage = () => import('../../shared/presentation/views/coming-soon-page/coming-soon-page').then(m => m.ComingSoonPage);

/**
 * Route tree for surveillance bounded-context views.
 */
export const surveillanceRoutes: Routes = [
  {
    path: '',
    redirectTo: 'alerts',
    pathMatch: 'full'
  },
  {
    path: 'alerts',
    title: 'Alerts',
    loadComponent: comingSoonPage,
    data: {
      pageTitle: 'Alerts',
      sectionLabel: 'Alerts',
      subtitle: 'Review field notifications and agronomic risk alerts.'
    }
  },
  {
    path: 'pest-surveillance',
    title: 'Pest Surveillance',
    loadComponent: comingSoonPage,
    data: {
      pageTitle: 'Pest Surveillance',
      sectionLabel: 'Pest Surveillance',
      subtitle: 'Track pest pressure and surveillance recommendations.'
    }
  },
  {
    path: 'pest-surveillance/report-symptoms',
    title: 'Report Symptoms',
    loadComponent: comingSoonPage,
    data: {
      pageTitle: 'Report Symptoms',
      sectionLabel: 'Pest Surveillance',
      subtitle: 'Register field symptoms for surveillance review.'
    }
  }
];

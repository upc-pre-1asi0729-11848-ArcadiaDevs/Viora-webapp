import { Routes } from '@angular/router';

const producerRoutes = () =>
  import('./shared/presentation/producer.routes').then((m) => m.producerRoutes);
const comingSoonPage = () =>
  import('./shared/presentation/pages/coming-soon-page/coming-soon-page').then(
    (m) => m.ComingSoonPage,
  );
const layout = () => import('./shared/presentation/components/layout/layout').then((m) => m.Layout);

/**
 * Root route configuration that composes layout and feature route trees.
 */
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'producer/dashboard',
    pathMatch: 'full',
  },
  {
    path: 'producer',
    loadComponent: layout,
    children: [
      {
        path: '',
        loadChildren: producerRoutes,
      },
    ],
  },
  {
    path: 'dashboard',
    redirectTo: 'producer/dashboard',
    pathMatch: 'full',
  },
  {
    path: 'plots',
    redirectTo: 'producer/plot',
    pathMatch: 'full',
  },
  {
    path: 'alerts',
    redirectTo: 'producer/alerts',
    pathMatch: 'full',
  },
  {
    path: 'dynamic-nutrition',
    redirectTo: 'producer/dynamic-nutrition',
    pathMatch: 'full',
  },
  {
    path: 'pest-surveillance',
    redirectTo: 'producer/pest-surveillance',
    pathMatch: 'full',
  },
  {
    path: 'expert-assistance',
    redirectTo: 'producer/expert-assistance',
    pathMatch: 'full',
  },
  {
    path: 'expense-history',
    redirectTo: 'producer/expense-history',
    pathMatch: 'full',
  },
  {
    path: 'settings',
    redirectTo: 'producer/settings',
    pathMatch: 'full',
  },
  {
    path: 'subscription',
    redirectTo: 'producer/subscription',
    pathMatch: 'full',
  },
  {
    path: 'support',
    redirectTo: 'producer/support',
    pathMatch: 'full',
  },
  {
    path: 'profile',
    loadComponent: layout,
    children: [
      {
        path: '',
        title: 'Profile',
        loadComponent: comingSoonPage,
        data: {
          pageTitle: 'Profile',
          sectionLabel: 'Profile',
          subtitle: 'Manage producer account details and preferences.',
        },
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'producer/dashboard',
  },
];

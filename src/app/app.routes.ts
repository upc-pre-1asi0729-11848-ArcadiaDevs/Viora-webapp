import { Routes } from '@angular/router';

const workspaceRoutes = () =>
  import('./shared/presentation/workspace.routes').then((m) => m.workspaceRoutes);
const agronomicRoutes = () =>
  import('./agronomic/presentation/agronomic.routes').then((m) => m.agronomicRoutes);
const surveillanceRoutes = () =>
  import('./surveillance/presentation/surveillance.routes').then((m) => m.surveillanceRoutes);
const layout = () => import('./shared/presentation/components/layout/layout').then((m) => m.Layout);

/**
 * Root route configuration that composes layout and feature route trees.
 */
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'agronomic',
    loadComponent: layout,
    children: [
      {
        path: '',
        loadChildren: agronomicRoutes,
      },
    ],
  },
  {
    path: 'surveillance',
    loadComponent: layout,
    children: [
      {
        path: '',
        loadChildren: surveillanceRoutes,
      },
    ],
  },
  {
    path: 'plots',
    redirectTo: 'agronomic/plots',
    pathMatch: 'full',
  },
  {
    path: 'plots/details',
    redirectTo: 'agronomic/plots',
    pathMatch: 'full',
  },
  {
    path: 'alerts',
    redirectTo: 'surveillance/alerts',
    pathMatch: 'full',
  },
  {
    path: 'dynamic-nutrition',
    redirectTo: 'agronomic/dynamic-nutrition',
    pathMatch: 'full',
  },
  {
    path: 'dynamic-nutrition/plan',
    redirectTo: 'agronomic/dynamic-nutrition/plan',
    pathMatch: 'full',
  },
  {
    path: 'pest-surveillance',
    redirectTo: 'surveillance/pest-surveillance',
    pathMatch: 'full',
  },
  {
    path: 'pest-surveillance/report-symptoms',
    redirectTo: 'surveillance/pest-surveillance/report-symptoms',
    pathMatch: 'full',
  },
  {
    path: 'expert-assistance',
    redirectTo: 'assistance/expert-assistance',
    pathMatch: 'full',
  },
  {
    path: 'expert-assistance/request',
    redirectTo: 'assistance/expert-assistance/request',
    pathMatch: 'full',
  },
  {
    path: 'expense-history',
    redirectTo: 'billing/expense-history',
    pathMatch: 'full',
  },
  {
    path: 'subscription',
    redirectTo: 'billing/subscription',
    pathMatch: 'full',
  },
  {
    path: '',
    loadComponent: layout,
    children: [
      {
        path: '',
        loadChildren: workspaceRoutes,
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];

import { Routes } from '@angular/router';

const comingSoonPage = () =>
  import('../../shared/presentation/views/coming-soon-page/coming-soon-page').then(
    (m) => m.ComingSoonPage,
  );
const iotDeviceList = () =>
  import('./views/iot-device-list/iot-device-list').then((m) => m.IotDeviceList);
const iotDeviceForm = () =>
  import('./views/iot-device-form/iot-device-form').then((m) => m.IotDeviceForm);

/**
 * Route tree for agronomic bounded-context views.
 */
export const agronomicRoutes: Routes = [
  {
    path: '',
    redirectTo: 'iot-devices',
    pathMatch: 'full',
  },
  {
    path: 'plots',
    title: 'My Plots',
    loadComponent: comingSoonPage,
    data: {
      pageTitle: 'My Plots',
      sectionLabel: 'My Plots',
      subtitle: 'Manage your registered production plots and field boundaries.',
    },
  },
  {
    path: 'dynamic-nutrition',
    title: 'Dynamic Nutrition',
    loadComponent: comingSoonPage,
    data: {
      pageTitle: 'Dynamic Nutrition',
      sectionLabel: 'Dynamic Nutrition',
      subtitle: 'Plan nutrition adjustments with dynamic crop indicators.',
    },
  },
  {
    path: 'dynamic-nutrition/plan',
    title: 'Nutrition Plan',
    loadComponent: comingSoonPage,
    data: {
      pageTitle: 'Nutrition Plan',
      sectionLabel: 'Dynamic Nutrition',
      subtitle: 'Plan nutrition adjustments with dynamic crop indicators.',
    },
  },
  {
    path: 'iot-devices',
    title: 'IoT Devices',
    loadComponent: iotDeviceList,
    data: {
      title: 'IoT Devices',
      subtitle: 'Manage connected field devices and telemetry readings.',
    },
  },
  {
    path: 'iot-devices/new',
    title: 'IoT Devices / New device',
    loadComponent: iotDeviceForm,
    data: {
      title: 'IoT Devices / New device',
      subtitle: 'Register an external IoT device connected to a monitored plot.',
    },
  },
  {
    path: 'iot-devices/:id/edit',
    title: 'IoT Devices / Edit device',
    loadComponent: iotDeviceForm,
    data: {
      title: 'IoT Devices / Edit device',
      subtitle: 'Update device telemetry configuration and monitoring status.',
    },
  },
];

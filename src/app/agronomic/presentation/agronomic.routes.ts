import { Routes } from '@angular/router';

const iotDeviceList = () => import('./pages/iot-device-list/iot-device-list').then(m => m.IotDeviceList);
const iotDeviceForm = () => import('./pages/iot-device-form/iot-device-form').then(m => m.IotDeviceForm);

/**
 * Route tree for agronomic bounded-context views.
 */
export const agronomicRoutes: Routes = [
  {
    path: 'iot-devices',
    title: 'IoT Devices',
    loadComponent: iotDeviceList,
    data: {
      title: 'IoT Devices',
      subtitle: 'Manage connected field devices and telemetry readings.'
    }
  },
  {
    path: 'iot-devices/new',
    title: 'IoT Devices / New device',
    loadComponent: iotDeviceForm,
    data: {
      title: 'IoT Devices / New device',
      subtitle: 'Register an external IoT device connected to a monitored plot.'
    }
  },
  {
    path: 'iot-devices/:id/edit',
    title: 'IoT Devices / Edit device',
    loadComponent: iotDeviceForm,
    data: {
      title: 'IoT Devices / Edit device',
      subtitle: 'Update device telemetry configuration and monitoring status.'
    }
  }
];

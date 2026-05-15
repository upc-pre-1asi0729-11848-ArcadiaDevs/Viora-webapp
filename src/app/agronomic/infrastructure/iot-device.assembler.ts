/**
 * @file iot-device.assembler.ts
 * @description specialized assembler for mapping Iot Device resources to domain entities.
 */
import {
  IotDevice,
  IotDeviceStatus
} from '../domain/model/iot-device.entity';

import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { IotDeviceResource } from './iot-devices-response';

export class IotDeviceAssembler extends BaseAssembler {
  /**
   * Transforms a single resource into an entity.
   * @param {Object} resource - Raw data point.
   * @returns {any}
   */
  static toEntityFromResource(resource: IotDeviceResource | null | undefined): IotDevice {
    return new IotDevice({
      id: resource?.id ?? null,
      name: resource?.name ?? '',
      plotId: resource?.plotId ?? null,
      soilMoisture: resource?.soilMoisture ?? 0,
      temperature: resource?.temperature ?? 0,
      leafHumidity: resource?.leafHumidity ?? 0,
      status: this.toStatus(resource?.status),
      lastUpdate: resource?.lastUpdate ?? ''
    });
  }

  /**
   * Transforms a collection of resources into entities.
   * @param {Object[]} resources - Array of raw data points.
   * @returns {any[]}
   */
  static toEntitiesFromResources(resources: IotDeviceResource[] = []): IotDevice[] {
    return this.toEntities(resources, resource => this.toEntityFromResource(resource));
  }

  static toResourceFromEntity(device: IotDevice): IotDeviceResource {
    return {
      id: device.id,
      name: device.name,
      plotId: device.plotId,
      soilMoisture: device.soilMoisture,
      temperature: device.temperature,
      leafHumidity: device.leafHumidity,
      status: device.status,
      lastUpdate: device.lastUpdate
    };
  }

  private static toStatus(value: string | undefined): IotDeviceStatus {
    const validStatuses: IotDeviceStatus[] = ['active', 'warning', 'critical', 'inactive'];

    return validStatuses.includes(value as IotDeviceStatus)
      ? value as IotDeviceStatus
      : 'active';
  }
}
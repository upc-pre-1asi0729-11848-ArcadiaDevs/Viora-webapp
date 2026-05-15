/**
 * @file iot-device-summary.assembler.ts
 * @description specialized assembler for mapping Iot Device Summary resources to domain entities.
 */
import {
  IotDeviceSummary,
  IotRiskLevel,
  IotSensorCard,
  IotTrend,
} from '../domain/model/iot-device-summary.entity';

import { IotDeviceSummaryResource, IotSensorCardResource } from './iot-device-summaries-response';
import { BaseAssembler } from '../../shared/infrastructure/base-assembler';

export class IotDeviceSummaryAssembler extends BaseAssembler {
  /**
   * Transforms a single resource into an entity.
   * @param {Object} resource - Raw data point.
   * @returns {any}
   */
  static toEntityFromResource(
    resource: IotDeviceSummaryResource | null | undefined,
  ): IotDeviceSummary {
    return new IotDeviceSummary({
      id: resource?.id ?? null,
      totalOnlineDevices: resource?.totalOnlineDevices ?? 0,
      plotsWithIot: resource?.plotsWithIot ?? 0,
      lastSync: resource?.lastSync ?? '',
      sensorCards: this.toSensorCards(resource?.sensorCards ?? []),
    });
  }

  /**
   * Transforms a collection of resources into entities.
   * @param {Object[]} resources - Array of raw data points.
   * @returns {any[]}
   */
  static toEntitiesFromResources(resources: IotDeviceSummaryResource[] = []): IotDeviceSummary[] {
    return this.toEntities(resources, (resource) => this.toEntityFromResource(resource));
  }

  /**
   * Transforms the first resource of a collection into an entity.
   * @param {Object[]} resources - Array of raw data points.
   * @returns {any | null}
   */
  static toFirstEntityFromResources(
    resources: IotDeviceSummaryResource[] = [],
  ): IotDeviceSummary | null {
    return this.toFirstEntity(resources, (resource) => this.toEntityFromResource(resource));
  }

  private static toSensorCards(resources: IotSensorCardResource[]): IotSensorCard[] {
    return resources.map(
      (resource) =>
        new IotSensorCard({
          id: resource.id ?? null,
          plotId: resource.plotId ?? null,
          title: resource.title ?? '',
          sourceLabel: resource.sourceLabel ?? 'IoT',
          metricLabel: resource.metricLabel ?? '',
          metricValue: resource.metricValue ?? 0,
          metricUnit: resource.metricUnit ?? '',
          trend: this.toIotTrend(resource.trend),
          riskLevel: this.toIotRiskLevel(resource.riskLevel),
          recommendation: resource.recommendation ?? '',
        }),
    );
  }

  private static toIotRiskLevel(value: string | undefined): IotRiskLevel {
    const validRiskLevels: IotRiskLevel[] = ['Low', 'Medium', 'High'];

    return validRiskLevels.includes(value as IotRiskLevel) ? (value as IotRiskLevel) : 'Low';
  }

  private static toIotTrend(value: string | undefined): IotTrend {
    const validTrends: IotTrend[] = ['up', 'down', 'stable'];

    return validTrends.includes(value as IotTrend) ? (value as IotTrend) : 'stable';
  }
}

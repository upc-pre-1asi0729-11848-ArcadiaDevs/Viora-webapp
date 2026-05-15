/**
 * @file alert.assembler.ts
 * @description specialized assembler for mapping Alert resources to domain entities.
 */
import { Alert, AlertSeverity, AlertStatus } from '../domain/model/alert.entity';

import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { AlertResource } from './alerts-response';

export class AlertAssembler extends BaseAssembler {
  /**
   * Transforms a single resource into an entity.
   * @param {Object} resource - Raw data point.
   * @returns {any}
   */
  static toEntityFromResource(resource: AlertResource | null | undefined): Alert {
    return new Alert({
      id: resource?.id ?? null,
      type: resource?.type ?? '',
      description: resource?.description ?? '',
      severity: this.toSeverity(resource?.severity),
      date: resource?.date ?? '',
      status: this.toStatus(resource?.status),
      plot: {
        name: resource?.plot?.name ?? '',
        location: resource?.plot?.location ?? '',
        hectares: resource?.plot?.hectares ?? 0,
      },
    });
  }

  /**
   * Transforms a collection of resources into entities.
   * @param {Object[]} resources - Array of raw data points.
   * @returns {any[]}
   */
  static toEntitiesFromResources(resources: AlertResource[] = []): Alert[] {
    return this.toEntities(resources, (resource) => this.toEntityFromResource(resource));
  }

  private static toSeverity(value: string | undefined): AlertSeverity {
    const validSeverities: AlertSeverity[] = ['Low', 'Medium', 'High', 'Critical'];

    return validSeverities.includes(value as AlertSeverity) ? (value as AlertSeverity) : 'Low';
  }

  private static toStatus(value: string | undefined): AlertStatus {
    const validStatuses: AlertStatus[] = [
      'Pending',
      'Active',
      'Suggest',
      'Under review',
      'In Progress',
      'Resolved',
    ];

    return validStatuses.includes(value as AlertStatus) ? (value as AlertStatus) : 'Pending';
  }
}

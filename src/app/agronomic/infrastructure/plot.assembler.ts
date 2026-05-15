/**
 * @file plot.assembler.ts
 * @description specialized assembler for mapping Plot resources to domain entities.
 */
import {
  PhenologicalRiskLevel,
  Plot,
  PlotHealthStatus
} from '../domain/model/plot.entity';

import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { PlotResource } from './plots-response';
import { SatelliteImageryAssembler } from './satellite-imagery.assembler';

export class PlotAssembler extends BaseAssembler {
  /**
   * Transforms a single resource into an entity.
   * @param {Object} resource - Raw data point.
   * @returns {any}
   */
  static toEntityFromResource(resource: PlotResource | null | undefined): Plot {
    const currentImagery = resource?.currentImagery
      ? SatelliteImageryAssembler.toEntityFromResource(resource.currentImagery)
      : null;

    return new Plot({
      id: resource?.id ?? null,
      name: resource?.name ?? '',
      polygonCoordinates: resource?.polygonCoordinates ?? [],
      areaSize: resource?.areaSize ?? 0,
      lastUpdate: resource?.lastUpdate ?? '',
      currentImagery,
      healthStatus: this.toPlotHealthStatus(resource?.healthStatus),
      phenologicalRisk: this.toPhenologicalRiskLevel(resource?.phenologicalRisk)
    });
  }

  /**
   * Transforms a collection of resources into entities.
   * @param {Object[]} resources - Array of raw data points.
   * @returns {any[]}
   */
  static toEntitiesFromResources(resources: PlotResource[] = []): Plot[] {
    return this.toEntities(resources, resource => this.toEntityFromResource(resource));
  }

  private static toPlotHealthStatus(value: string | undefined): PlotHealthStatus {
    const validStatuses: PlotHealthStatus[] = ['Healthy', 'Under Review', 'Critical'];

    return validStatuses.includes(value as PlotHealthStatus)
      ? value as PlotHealthStatus
      : 'Healthy';
  }

  private static toPhenologicalRiskLevel(value: string | undefined): PhenologicalRiskLevel {
    const validRiskLevels: PhenologicalRiskLevel[] = ['Low', 'Medium', 'High'];

    return validRiskLevels.includes(value as PhenologicalRiskLevel)
      ? value as PhenologicalRiskLevel
      : 'Low';
  }
}

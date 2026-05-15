import { inject, Injectable } from '@angular/core';
import { Map as MapboxMap } from 'mapbox-gl';

import { MapboxService } from '../../shared/infrastructure/mapbox.service';
import { Plot } from '../domain/model/plot.entity';
import { AgronomicMapAdapter } from '../infrastructure/agronomic-map.adapter';

@Injectable()
export class PlotMapService {
  private readonly mapboxService = inject(MapboxService);

  private map: MapboxMap | null = null;
  private adapter: AgronomicMapAdapter | null = null;
  private pendingPlot: Plot | null = null;
  private resizeTimeouts: ReturnType<typeof setTimeout>[] = [];

  init(container: HTMLElement | null | undefined, initialPlot: Plot | null = null): void {
    if (!container) {
      return;
    }

    this.cleanup();

    this.pendingPlot = initialPlot;

    const center = initialPlot?.polygonCoordinates.at(0) ?? [0, 0];

    this.mapboxService
      .createMapInstance({
        container,
        zoom: 14,
        center,
      })
      .then((mapInstance) => {
        this.map = mapInstance;

        const handleMapReady = (): void => {
          this.adapter = new AgronomicMapAdapter(mapInstance);

          if (this.pendingPlot) {
            this.render(this.pendingPlot);
          }

          this.scheduleResize(mapInstance);
        };

        if (mapInstance.loaded()) {
          handleMapReady();
        } else {
          mapInstance.once('load', handleMapReady);
        }
      })
      .catch((error) => {
        console.error('[PlotMapService] Failed to initialize Mapbox.', error);
      });
  }

  render(plot: Plot | null | undefined): void {
    if (!plot) {
      return;
    }

    this.pendingPlot = plot;

    if (!this.adapter) {
      return;
    }

    this.adapter.renderPlotSurveillance(plot);
  }

  resize(): void {
    this.map?.resize();
  }

  cleanup(): void {
    this.resizeTimeouts.forEach((timeoutId) => clearTimeout(timeoutId));
    this.resizeTimeouts = [];

    if (this.map) {
      this.map.remove();
      this.map = null;
    }

    this.adapter = null;
    this.pendingPlot = null;
  }

  private scheduleResize(mapInstance: MapboxMap): void {
    [300, 800, 1600].forEach((delay) => {
      const timeoutId = setTimeout(() => {
        mapInstance.resize();
      }, delay);

      this.resizeTimeouts.push(timeoutId);
    });
  }
}

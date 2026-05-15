import mapboxgl from 'mapbox-gl';
import type { Map as MapboxMap } from 'mapbox-gl';

export type MapCoordinate = [longitude: number, latitude: number];

export class MapboxBaseAdapter {
  protected readonly map: MapboxMap;

  constructor(mapInstance: MapboxMap) {
    this.map = mapInstance;
  }

  fitToCoordinates(coordinates: MapCoordinate[]): void {
    if (!coordinates.length) {
      return;
    }

    const bounds = new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]);

    coordinates.forEach((coordinate) => bounds.extend(coordinate));

    this.map.fitBounds(bounds, {
      padding: 50,
      duration: 1500,
    });
  }

  addPolygon(id: string, coordinates: MapCoordinate[], color: string = '#FFFFFF'): void {
    if (!coordinates.length) {
      return;
    }

    this.removeSourceAndLayers(id);

    this.map.addSource(id, {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Polygon',
          coordinates: [coordinates],
        },
      },
    });

    this.map.addLayer({
      id: `${id}-layer`,
      type: 'line',
      source: id,
      paint: {
        'line-color': color,
        'line-width': 2,
      },
    });
  }

  addRasterLayer(id: string, tileUrl: string, opacity: number = 0.8): void {
    if (!tileUrl) {
      return;
    }

    this.removeSourceAndLayers(id);

    this.map.addSource(id, {
      type: 'raster',
      tiles: [tileUrl],
      tileSize: 256,
    });

    this.map.addLayer({
      id: `${id}-layer`,
      type: 'raster',
      source: id,
      paint: {
        'raster-opacity': opacity,
      },
    });
  }

  removeSourceAndLayers(id: string): void {
    const layerId = `${id}-layer`;

    if (this.map.getLayer(layerId)) {
      this.map.removeLayer(layerId);
    }

    if (this.map.getSource(id)) {
      this.map.removeSource(id);
    }
  }
}

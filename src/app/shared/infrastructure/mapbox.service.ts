import { Injectable } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import type {
  LngLatLike,
  Map as MapboxMap,
  MapboxOptions
} from 'mapbox-gl';

import { environment } from '../../../environments/environment';

export interface CreateMapInstanceOptions
  extends Omit<MapboxOptions, 'style' | 'accessToken'> {
  container: HTMLElement;
  center?: LngLatLike;
  zoom?: number;
  style?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MapboxService {
  private readonly defaultStyle = 'mapbox://styles/mapbox/satellite-v9';

  constructor() {
    mapboxgl.accessToken = environment.mapbox.accessToken;
  }

  createMapInstance(options: CreateMapInstanceOptions): Promise<MapboxMap> {
    if (!environment.mapbox.accessToken) {
      return Promise.reject(
        new Error('[MapboxService] Mapbox access token is missing.')
      );
    }

    const map = new mapboxgl.Map({
      attributionControl: false,
      style: options.style ?? this.defaultStyle,
      zoom: options.zoom ?? 14,
      center: options.center ?? [0, 0],
      ...options
    });

    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return Promise.resolve(map);
  }
}

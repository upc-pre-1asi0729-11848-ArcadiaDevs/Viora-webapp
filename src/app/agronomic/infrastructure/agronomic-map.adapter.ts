import { MapboxBaseAdapter } from '../../shared/infrastructure/mapbox-base.adapter';
import { Plot } from '../domain/model/plot.entity';

export class AgronomicMapAdapter extends MapboxBaseAdapter {
  renderPlotSurveillance(plot: Plot | null | undefined): void {
    if (!plot?.hasValidPolygon) {
      return;
    }

    this.fitToCoordinates(plot.polygonCoordinates);

    if (plot.currentImagery?.tileUrl) {
      this.addRasterLayer(
        'ndvi-imagery',
        plot.currentImagery.tileUrl,
        plot.currentImagery.recommendedOpacity,
      );
    }

    this.addPolygon('plot-boundary', plot.polygonCoordinates, '#FFFFFF');
  }
}

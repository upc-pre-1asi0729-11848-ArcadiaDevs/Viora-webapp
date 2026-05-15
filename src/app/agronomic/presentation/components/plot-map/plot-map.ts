import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
  inject,
} from '@angular/core';

import { Plot } from '../../../domain/model/plot.entity';
import { PlotMapService } from '../../../application/plot-map.service';

@Component({
  selector: 'app-plot-map',
  standalone: true,
  imports: [],
  providers: [PlotMapService],
  templateUrl: './plot-map.html',
  styleUrl: './plot-map.css',
})
export class PlotMap implements AfterViewInit, OnChanges, OnDestroy {
  @Input() plot: Plot | null = null;

  @ViewChild('mapContainer')
  private readonly mapContainer?: ElementRef<HTMLElement>;

  private readonly plotMapService = inject(PlotMapService);
  private viewInitialized = false;

  ngAfterViewInit(): void {
    this.viewInitialized = true;
    this.initializeMap();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.viewInitialized || !changes['plot']) {
      return;
    }

    if (this.plot) {
      this.plotMapService.render(this.plot);
    }
  }

  ngOnDestroy(): void {
    this.plotMapService.cleanup();
  }

  private initializeMap(): void {
    const container = this.mapContainer?.nativeElement;

    if (!container) {
      return;
    }

    this.plotMapService.init(container, this.plot);
  }
}

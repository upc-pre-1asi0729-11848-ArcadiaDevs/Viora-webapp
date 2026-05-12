import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';

import { AgronomicStore } from '../../../application/agronomic.store';

@Component({
  selector: 'app-overall-plot-health-card',
  standalone: true,
  imports: [MatCardModule, MatChipsModule],
  templateUrl: './overall-plot-health-card.html',
  styleUrl: './overall-plot-health-card.css',
})
export class OverallPlotHealthCard {
  protected readonly store = inject(AgronomicStore);
}

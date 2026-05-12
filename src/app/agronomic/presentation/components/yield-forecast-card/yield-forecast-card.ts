import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { AgronomicStore } from '../../../application/agronomic.store';

@Component({
  selector: 'app-yield-forecast-card',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './yield-forecast-card.html',
  styleUrl: './yield-forecast-card.css'
})
export class YieldForecastCard {
  protected readonly store = inject(AgronomicStore);
}

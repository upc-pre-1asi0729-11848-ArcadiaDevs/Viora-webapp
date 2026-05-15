import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { TranslatePipe } from '@ngx-translate/core';

import { AgronomicStore } from '../../../application/agronomic.store';

@Component({
  selector: 'app-yield-forecast-card',
  standalone: true,
  imports: [MatCardModule, TranslatePipe],
  templateUrl: './yield-forecast-card.html',
  styleUrl: './yield-forecast-card.css',
})
export class YieldForecastCard {
  protected readonly store = inject(AgronomicStore);
}

import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TranslatePipe } from '@ngx-translate/core';

import { AgronomicStore } from '../../../application/agronomic.store';

@Component({
  selector: 'app-chill-accumulation-card',
  standalone: true,
  imports: [MatCardModule, MatProgressBarModule, TranslatePipe],
  templateUrl: './chill-accumulation-card.html',
  styleUrl: './chill-accumulation-card.css',
})
export class ChillAccumulationCard {
  protected readonly store = inject(AgronomicStore);
}

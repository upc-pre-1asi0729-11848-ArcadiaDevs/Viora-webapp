import { Component, computed, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { AgronomicStore } from '../../../../application/agronomic.store';

@Component({
  selector: 'app-ndvi-status-card',
  standalone: true,
  imports: [MatCardModule, MatProgressBarModule],
  templateUrl: './ndvi-status-card.html',
  styleUrl: './ndvi-status-card.css',
})
export class NdviStatusCard {
  protected readonly store = inject(AgronomicStore);

  protected readonly ndviProgress = computed(() => {
    const ndvi = this.store.latestAgronomicRecord()?.ndviIndex ?? 0;
    return Math.round(ndvi * 100);
  });
}

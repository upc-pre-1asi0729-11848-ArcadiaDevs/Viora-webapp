import { Component, computed, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

import { AgronomicStore } from '../../../application/agronomic.store';

@Component({
  selector: 'app-iot-devices-card',
  standalone: true,
  imports: [MatCardModule, MatIconModule, TranslatePipe],
  templateUrl: './iot-devices-card.html',
  styleUrl: './iot-devices-card.css'
})
export class IotDevicesCard {
  protected readonly agronomicStore = inject(AgronomicStore);

  protected readonly onlineDevicesLabel = computed<string>(() => {
    if (!this.agronomicStore.devicesLoaded()) {
      return 'Loading devices';
    }

    const selectedScope = this.agronomicStore.selectedDashboardScope();
    const count = this.agronomicStore.onlineDevicesCount();

    return selectedScope === 'all'
      ? `${count} devices online`
      : `${count} sensors online`;
  });

  protected readonly plotsWithIotLabel = computed<string>(() => {
    if (!this.agronomicStore.devicesLoaded()) {
      return 'Loading plots';
    }

    const selectedScope = this.agronomicStore.selectedDashboardScope();

    if (selectedScope === 'all') {
      return `${this.agronomicStore.plotsWithIotCount()} plots with IoT`;
    }

    return this.agronomicStore.selectedDashboardPlot()
      ? `${this.agronomicStore.selectedDashboardPlot()?.name} IoT scope`
      : 'Selected plot IoT scope';
  });
}

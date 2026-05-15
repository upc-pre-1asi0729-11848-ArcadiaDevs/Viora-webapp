import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

import { IotSensorCard as IotSensorCardEntity } from '../../../domain/model/iot-device-summary.entity';

@Component({
  selector: 'app-iot-sensor-card',
  standalone: true,
  imports: [MatCardModule, MatIconModule, TranslatePipe],
  templateUrl: './iot-sensor-card.html',
  styleUrl: './iot-sensor-card.css'
})
export class IotSensorCard {
  @Input() sensor: IotSensorCardEntity | null = null;

  protected getMetricLabel(sensor: IotSensorCardEntity): string {
    return sensor.metricLabel.toLowerCase().includes('temperature')
      ? 'cards.iot.soilTemperature'
      : 'cards.iot.soilMoisture';
  }

  protected getRecommendationKey(sensor: IotSensorCardEntity): string {
    if (sensor.metricLabel.toLowerCase().includes('temperature')) {
      return sensor.riskLevel === 'High'
        ? 'cards.iot.temperatureHigh'
        : sensor.riskLevel === 'Medium'
          ? 'cards.iot.temperatureMedium'
          : 'cards.iot.temperatureLow';
    }

    return sensor.riskLevel === 'High'
      ? 'cards.iot.moistureHigh'
      : sensor.riskLevel === 'Medium'
        ? 'cards.iot.moistureMedium'
        : 'cards.iot.moistureLow';
  }
}

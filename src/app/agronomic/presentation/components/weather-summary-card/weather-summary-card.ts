import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

import { AgronomicStore } from '../../../application/agronomic.store';
import { WeatherForecastDay } from '../../../domain/model/weather-summary.entity';

@Component({
  selector: 'app-weather-summary-card',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, MatIconModule, TranslatePipe],
  templateUrl: './weather-summary-card.html',
  styleUrl: './weather-summary-card.css'
})
export class WeatherSummaryCard {
  protected readonly store = inject(AgronomicStore);

  protected readonly todayForecast = computed<WeatherForecastDay | null>(() => {
    return this.store.weatherSummary()?.forecast3Days.at(0) ?? null;
  });

  protected readonly temperatureProgress = computed<number>(() => {
    const weather = this.store.weatherSummary();
    const forecast = this.todayForecast();

    if (!weather || !forecast || forecast.maxTemp <= forecast.minTemp) {
      return 0;
    }

    const progress = ((weather.currentTemp - forecast.minTemp) / (forecast.maxTemp - forecast.minTemp)) * 100;

    return Math.min(100, Math.max(0, Math.round(progress)));
  });

  protected heroBackgroundImage(): string {
    const backgroundImage = this.store.weatherSummary()?.backgroundImage;

    return backgroundImage ? `url("${backgroundImage}")` : 'none';
  }
}

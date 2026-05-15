/**
 * Application service store for the `Surveillance` bounded context.
 * It coordinates fetching and managing alert notifications.
 *
 * @module SurveillanceStore
 */
import { computed, inject, Injectable, signal } from '@angular/core';
import { finalize, take } from 'rxjs';

import { SurveillanceApiService } from '../infrastructure/surveillance-api.service';

import { Alert } from '../domain/model/alert.entity';

export interface SurveillanceLoadingState {
  alerts: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class SurveillanceStore {
  private readonly surveillanceApi = inject(SurveillanceApiService);

  /**
   * List of surveillance alerts.
   * @type {import('@angular/core').WritableSignal<Alert[]>}
   */
  readonly alerts = signal<Alert[]>([]);
  /**
   * Currently selected alert identifier.
   * @type {import('@angular/core').WritableSignal<number|string|null>}
   */
  readonly selectedAlertId = signal<number | string | null>(null);

  /**
   * Whether alerts have been loaded.
   * @type {import('@angular/core').WritableSignal<boolean>}
   */
  readonly alertsLoaded = signal<boolean>(false);
  /**
   * List of errors encountered during API operations.
   * @type {import('@angular/core').WritableSignal<unknown[]>}
   */
  readonly errors = signal<unknown[]>([]);

  readonly loading = signal<SurveillanceLoadingState>({
    alerts: false,
  });

  /**
   * Returns the most recent alerts.
   * @type {import('@angular/core').Signal<Alert[]>}
   */
  readonly recentAlerts = computed<Alert[]>(() => {
    return [...this.alerts()]
      .sort((firstAlert, secondAlert) => {
        const firstDate = firstAlert.dateValue?.getTime() ?? 0;
        const secondDate = secondAlert.dateValue?.getTime() ?? 0;

        return secondDate - firstDate;
      })
      .slice(0, 3);
  });

  /**
   * Returns alerts requiring urgent action.
   * @type {import('@angular/core').Signal<Alert[]>}
   */
  readonly urgentAlerts = computed<Alert[]>(() => {
    return this.alerts().filter((alert) => alert.requiresUrgentAction);
  });

  readonly selectedAlert = computed<Alert | null>(() => {
    const selectedId = this.selectedAlertId();

    if (selectedId === null) {
      return null;
    }

    return this.alerts().find((alert) => String(alert.id) === String(selectedId)) ?? null;
  });

  readonly hasAlerts = computed<boolean>(() => {
    return this.alerts().length > 0;
  });

  readonly hasErrors = computed<boolean>(() => {
    return this.errors().length > 0;
  });

  /**
   * Fetches recent alerts with a limit.
   * @param {number} limit
   */
  fetchRecentAlerts(limit: number = 3): void {
    this.setLoading('alerts', true);

    const params = {
      _limit: limit,
      _sort: 'date',
      _order: 'desc',
    };

    this.surveillanceApi
      .getAlerts(params)
      .pipe(
        take(1),
        finalize(() => this.setLoading('alerts', false)),
      )
      .subscribe({
        next: (alerts) => {
          this.alerts.set(alerts);
          this.alertsLoaded.set(true);
        },
        error: (error) => this.registerError(error),
      });
  }

  /**
   * Fetches all alerts.
   */
  fetchAlerts(): void {
    this.setLoading('alerts', true);

    this.surveillanceApi
      .getAlerts({
        _sort: 'date',
        _order: 'desc',
      })
      .pipe(
        take(1),
        finalize(() => this.setLoading('alerts', false)),
      )
      .subscribe({
        next: (alerts) => {
          this.alerts.set(alerts);
          this.alertsLoaded.set(true);
        },
        error: (error) => this.registerError(error),
      });
  }

  /**
   * Updates the selected alert identifier.
   * @param {number|string|null} id
   */
  selectAlert(id: number | string | null): void {
    this.selectedAlertId.set(id);
  }

  clearAlerts(): void {
    this.alerts.set([]);
    this.alertsLoaded.set(false);
    this.selectedAlertId.set(null);
  }

  clearErrors(): void {
    this.errors.set([]);
  }

  private setLoading(key: keyof SurveillanceLoadingState, value: boolean): void {
    this.loading.update((state) => ({
      ...state,
      [key]: value,
    }));
  }

  private registerError(error: unknown): void {
    this.errors.update((errors) => [...errors, error]);
  }
}

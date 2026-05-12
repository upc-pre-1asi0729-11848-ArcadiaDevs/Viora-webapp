import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AlertResource } from './alert.assembler';

export type AlertQueryParams = Record<string, string | number | boolean | null | undefined>;

@Injectable({
  providedIn: 'root',
})
export class SurveillanceApiService {
  private readonly baseUrl = environment.platformApiUrl ?? '';
  private readonly alertsEndpointPath = environment.alertsEndpointPath ?? 'alerts';

  constructor(private readonly http: HttpClient) {}

  getAlerts(params: AlertQueryParams = {}): Observable<HttpResponse<AlertResource[]>> {
    return this.http.get<AlertResource[]>(this.buildUrl(this.alertsEndpointPath), {
      params: this.toHttpParams(params),
      observe: 'response',
    });
  }

  getAlertById(id: number | string): Observable<HttpResponse<AlertResource>> {
    return this.http.get<AlertResource>(this.buildUrl(`${this.alertsEndpointPath}/${id}`), {
      observe: 'response',
    });
  }

  private buildUrl(path: string): string {
    const normalizedBaseUrl = this.baseUrl.replace(/\/$/, '');
    const normalizedPath = path.replace(/^\//, '');
    return `${normalizedBaseUrl}/${normalizedPath}`;
  }

  private toHttpParams(params: AlertQueryParams): HttpParams {
    let httpParams = new HttpParams();

    for (const [key, value] of Object.entries(params)) {
      if (value !== null && value !== undefined) {
        httpParams = httpParams.set(key, String(value));
      }
    }

    return httpParams;
  }
}

import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink, ActivatedRoute } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

import { DashboardHeader } from '../../components/dashboard-header/dashboard-header';

@Component({
  selector: 'app-coming-soon-page',
  standalone: true,
  imports: [
    RouterLink,
    MatButtonModule,
    MatIconModule,
    DashboardHeader,
    TranslatePipe
  ],
  templateUrl: './coming-soon-page.html',
  styleUrl: './coming-soon-page.css'
})
export class ComingSoonPage {
  private readonly route = inject(ActivatedRoute);
  private readonly routeData = toSignal(this.route.data, {
    initialValue: this.route.snapshot.data
  });

  protected readonly title = computed<string>(() => {
    return String(this.routeData()['pageTitle'] ?? 'Coming Soon');
  });

  protected readonly subtitle = computed<string>(() => {
    return String(this.routeData()['subtitle'] ?? 'This producer workspace is being prepared.');
  });

  protected readonly sectionLabel = computed<string>(() => {
    return String(this.routeData()['sectionLabel'] ?? 'This section');
  });

  protected readonly breadcrumbs = computed(() => [
    {
      label: this.sectionLabel(),
      disabled: true
    }
  ]);
}

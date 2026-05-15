import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

interface RecommendedAction {
  labelKey: string;
  iconPath: string;
  route: string;
}

@Component({
  selector: 'app-recommended-actions-card',
  standalone: true,
  imports: [RouterLink, TranslatePipe],
  templateUrl: './recommended-actions-card.html',
  styleUrl: './recommended-actions-card.css',
})
export class RecommendedActionsCard {
  protected readonly actions: RecommendedAction[] = [
    {
      labelKey: 'recommended.nutrition',
      iconPath: '/assets/icons/dashboard/leaf-outline.svg',
      route: '/dynamic-nutrition',
    },
    {
      labelKey: 'recommended.expert',
      iconPath: '/assets/icons/dashboard/people-outline.svg',
      route: '/expert-assistance',
    },
    {
      labelKey: 'recommended.inspect',
      iconPath: '/assets/icons/dashboard/information-circle-outline.svg',
      route: '/plots',
    },
    {
      labelKey: 'recommended.symptoms',
      iconPath: '/assets/icons/dashboard/megaphone-outline.svg',
      route: '/pest-surveillance',
    },
  ];
}

import { Injectable, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';

@Injectable()
export class DashboardTitleStrategy extends TitleStrategy {
  private readonly titleService = inject(Title);

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const title = this.buildTitle(snapshot);

    this.titleService.setTitle(title ? `Dashboard - ${title}` : 'Dashboard');
  }
}

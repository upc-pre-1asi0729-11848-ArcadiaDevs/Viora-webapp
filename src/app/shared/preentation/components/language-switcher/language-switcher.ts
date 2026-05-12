import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './language-switcher.html',
  styleUrls: ['./language-switcher.css'],
})
export class LanguageSwitcher {
  locale = 'en';
  availableLocales: string[] = ['en', 'es'];

  constructor(private translate: TranslateService) {
    this.translate.addLangs(this.availableLocales);

    const savedLanguage = localStorage.getItem('language');
    this.locale = savedLanguage || this.translate.getDefaultLang() || 'en';

    this.translate.use(this.locale);
  }

  useLanguage(language: string): void {
    this.locale = language;
    this.translate.use(language);
    localStorage.setItem('language', language);
  }
}

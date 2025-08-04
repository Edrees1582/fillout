import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SurveyService } from './survey.service';

import 'survey-core/i18n/arabic';
import 'survey-core/survey-core.css';
import 'survey-creator-core/i18n/arabic';
import 'survey-creator-core/survey-creator-core.css';

// Enable Ace Editor in the JSON Editor tab
import 'ace-builds/src-noconflict/ace';
import 'ace-builds/src-noconflict/ext-searchbox';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  private _surveyService = inject(SurveyService);

  get currentLocale(): string {
    return this._surveyService.currentLocale;
  }

  toggleLocale() {
    const newLocale = this.currentLocale === 'ar' ? 'en' : 'ar';
    this._surveyService.setLocale(newLocale);
  }
}

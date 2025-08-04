import { Component, inject } from '@angular/core';
import { Serializer, SurveyModel } from 'survey-core';
import { SurveyCreatorModule } from 'survey-creator-angular';
import { SurveyService } from '../survey.service';

Serializer.addProperty('question', {
  name: 'isRequiredForComplete',
  type: 'boolean',
  category: 'general',
  default: false,
  visibleIndex: 6,
  onSetValue: (survey: SurveyModel, value) => {
    survey.setPropertyValue('isRequiredForComplete', value);
  },
});

// Serializer.addProperty('question', {
//   name: 'errorMessage',
//   type: 'string',
//   category: 'general',
//   default: '',
//   visibleIndex: 6,
//   onSetValue: (survey: SurveyModel, value) => {
//     survey.setPropertyValue('errorMessage', value);
//   },
// });

@Component({
  selector: 'app-survey-creator',
  standalone: true,
  imports: [SurveyCreatorModule],
  templateUrl: './survey-creator.component.html',
  styleUrl: './survey-creator.component.css',
})
export default class SurveyCreatorComponent {
  private _surveyService = inject(SurveyService);

  surveyCreatorModel = this._surveyService.surveyCreatorModel;
}

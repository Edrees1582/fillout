import { Component, inject, signal } from '@angular/core';
import { SurveyModule } from 'survey-angular-ui';
import { Model, Question, SurveyModel } from 'survey-core';
import { ICreatorOptions } from 'survey-creator-core';
import { SurveyService } from '../survey.service';

const creatorOptions: ICreatorOptions = {
  autoSaveEnabled: true,
  showTranslationTab: true,
  previewAllowSelectLanguage: true,
};

@Component({
  selector: 'app-survey',
  standalone: true,
  imports: [SurveyModule],
  templateUrl: './survey.component.html',
  styleUrl: './survey.component.css',
})
export default class SurveyComponent {
  private _surveyService = inject(SurveyService);

  surveyJSON = this._surveyService.surveyJSON;
  surveyModel = signal<SurveyModel | null>(null);

  ngOnInit() {
    const survey = new Model(this.surveyJSON());

    survey.onComplete.add(this.alertResults);
    survey.onCompleting.add((sender, options) => {
      const questions = this.surveyModel()?.getAllQuestions();
      questions?.forEach((question: Question) => {
        const _isRequiredForComplete = question['jsonObj']['isRequiredForComplete'];

        if (_isRequiredForComplete && !question.value) {
          question.focus();
          options.allow = false;
          question.addError(question['jsonObj']['errorMessage'] || "This is a required question for completion");
          return;
        }
      });
    });

    this.surveyModel.set(survey);
  }

  alertResults(sender: Model) {
    console.log('onComplete');
    // const isRequiredForCompleteQuestions = sender.data.questions.some((question: any) => question.isRequiredForComplete);
    //   if (isRequiredForCompleteQuestions) {
    //     alert('Survey is required for complete');
    //   }

    // get all questions that are required for complete

    // const results = JSON.stringify(sender.data);
    // alert(results);
  }
}

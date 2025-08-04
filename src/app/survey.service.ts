import { Injectable, signal } from '@angular/core';
import { Action, ComputedUpdater } from 'survey-core';
import {
  editorLocalization,
  getLocaleStrings,
  ICreatorOptions,
  SurveyCreatorModel,
} from 'survey-creator-core';

const creatorOptions: ICreatorOptions = {
  autoSaveEnabled: true,
  showTranslationTab: true,
  previewAllowSelectLanguage: true,
};

const defaultJson = {
  pages: [
    {
      name: 'Name',
      elements: [
        {
          name: 'FirstName',
          title: 'Enter your first name:',
          type: 'text',
        },
        {
          name: 'LastName',
          title: 'Enter your last name:',
          type: 'text',
        },
      ],
    },
  ],
};

@Injectable({
  providedIn: 'root',
})
export class SurveyService {
  private _surveyJSON = signal<string>('');
  private _surveyCreatorModel = signal<SurveyCreatorModel | null>(null);

  surveyJSON = this._surveyJSON.asReadonly();
  surveyCreatorModel = this._surveyCreatorModel.asReadonly();

  constructor() {
    const translations = getLocaleStrings('ar');
    translations.tabs.translation = 'الترجمات';
    translations.tabs.editor = 'JSON محرر';
    translations.qt.text = 'مُدخل فردي';

    editorLocalization.defaultLocale = 'ar';

    this._initSurveyJSON();
    this._initSurveyCreator();
  }

  setSurveyJSON(value: string) {
    this._surveyJSON.set(value);
  }

  setSurveyCreator(creator: SurveyCreatorModel) {
    this._surveyCreatorModel.set(creator);
  }

  setLocale(locale: string) {
    localStorage.setItem('survey-locale', locale);
    this._surveyCreatorModel()!.locale = locale;
  }

  get currentLocale(): string {
    return this._surveyCreatorModel()!.locale;
  }

  private _initSurveyJSON() {
    const surveyJSON = localStorage.getItem('survey-json');

    if (surveyJSON) {
      this.setSurveyJSON(surveyJSON);
    } else {
      this.setSurveyJSON(JSON.stringify(defaultJson));
    }
  }

  private _initSurveyCreator() {
    const creator = new SurveyCreatorModel(creatorOptions);

    creator.onElementGetActions.add((_, options) => {
      const question = options.element;
      // Hide the titles of built-in adorners, except for "Element Type" and "Input Type"
      options.actions.forEach((action) => {
        if (['convertTo', 'convertInputType'].indexOf(action?.id ?? '') < 0) {
          action.showTitle = false;
        }
      });

      const type = question.getType();

      if (type !== 'page') {
        const requireForCompleteAdorner =
          this._createRequireForCompleteAction(question);
        options.actions.push(requireForCompleteAdorner);
      }
    });

    creator.onPropertyShowing.add((_, options) => {
      if (options.element.getType() === 'question') {
        options.show = options.property.name !== 'isRequiredForComplete';
      }
    });

    creator.text =
      localStorage.getItem('survey-json') || JSON.stringify(defaultJson);

    creator.saveSurveyFunc = (saveNo: number, callback: Function) => {
      localStorage.setItem('survey-json', creator.text);
      callback(saveNo, true);

      creator.onModified.add((sender, options) => {
        console.log('onModified', sender, options);
        sender
      });

      this.setSurveyJSON(creator.text);
    };

    creator.locale = localStorage.getItem('survey-locale') || 'ar';

    localStorage.setItem('survey-locale', creator.locale);

    this.setSurveyCreator(creator);
  }

  private _createRequireForCompleteAction(question: any) {
    return new Action({
      id: 'isRequiredForComplete',
      active: new ComputedUpdater<boolean>(
        () => question.isRequiredForComplete
      ).updater(),
      title: 'Require for Complete',
      iconName: 'icon-required',
      css: 'required-for-complete',
      action: (context) => {
        question.isRequiredForComplete = !question.isRequiredForComplete;
        context.active = question.isRequiredForComplete;
        this._surveyCreatorModel()!.saveSurveyFunc(this._surveyCreatorModel()!.saveNo + 1, () => {});
        this._surveyCreatorModel()!.setModified({
          setState: "modified"
        });
      },
      visibleIndex: 10,
    });
  }
}

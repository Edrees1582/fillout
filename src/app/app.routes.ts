import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'creator',
    loadComponent: () => import('./survey-creator/survey-creator.component'),
  },
  {
    path: 'runtime',
    loadComponent: () => import('./survey/survey.component'),
  },
];

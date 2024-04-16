import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AllTemplateFrontComponent} from "./FrontOffice/all-template-front/all-template-front.component";
import {HomeFrontComponent} from "./FrontOffice/home-front/home-front.component";

import {
  FindAllJobOffersComponent
} from "./FrontOffice/pages/JobOffer/find-all-job-offers/find-all-job-offers.component";
import {WishlistComponent} from "./FrontOffice/pages/JobOffer/wishlist/wishlist.component";

import {SidebarBackComponent} from "./BackOffice/sidebar-back/sidebar-back.component";
import { AllTemplatBackComponent } from './BackOffice/all-templat-back/all-templat-back.component';
import {JobOfferDetailsComponent} from "./FrontOffice/pages/JobOffer/job-offer-details/job-offer-details.component";
import {
  FindAllJobCandidaciesComponent
} from "./FrontOffice/pages/JobOffer/find-all-job-candidacies/find-all-job-candidacies.component";
import {
  FindAllJobOffersBackComponent
} from "./BackOffice/Pages/JobOffer/find-all-job-offers-back/find-all-job-offers-back.component";
import {
  FindAllJobCandidaciesBackComponent
} from "./BackOffice/Pages/JobOffer/find-all-job-candidacies-back/find-all-job-candidacies-back.component";
import {StatisticsComponent} from "./BackOffice/Pages/JobOffer/statistics/statistics.component";
import {
  StatisticsCandidaciesComponent
} from "./BackOffice/Pages/JobOffer/statistics-candidacies/statistics-candidacies.component";
import {
  StatisticsInterviewComponent
} from "./BackOffice/Pages/JobOffer/statistics-interview/statistics-interview.component";
import {QuizComponent} from "./FrontOffice/pages/Quiz/quiz/quiz.component";
import {
  InterviewDetailsBackComponent
} from "./BackOffice/Pages/JobOffer/interview-details-back/interview-details-back.component";


const routes: Routes = [
  {
    path: "",
    component: AllTemplatBackComponent,
    children:[
      {path:"findAllJobOffersback", component:FindAllJobOffersBackComponent },
      { path: 'findAllJobCandidaciesBack/:id', component: FindAllJobCandidaciesBackComponent },
      { path: 'statisticsHR', component: StatisticsComponent },
      { path: 'statisticsCandidacies', component: StatisticsCandidaciesComponent },
      { path: 'statisticsInterviews', component: StatisticsInterviewComponent },
      { path: 'findInterviewBack/:id', component: InterviewDetailsBackComponent },

    ]

  }, {
    path: "home",
    component: AllTemplateFrontComponent,
    children:[
      {path:"home", component:HomeFrontComponent }
    ]
  },
  {
    path: "JobOffer",
    component: AllTemplateFrontComponent,children:[
      { path: 'findAllJobOffersfront', component: FindAllJobOffersComponent },
      { path: 'job-offer-details/:id', component: JobOfferDetailsComponent },
      { path: 'wishlist', component: WishlistComponent },
      { path: 'findAllJobCandidacies/:id', component: FindAllJobCandidaciesComponent },
    ]},
  { path: 'quiz', component: QuizComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

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


const routes: Routes = [
  {
    path: "",
    component: AllTemplatBackComponent,

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
      { path: 'findAllJobCandidacies/:id', component: FindAllJobCandidaciesComponent }
    ]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

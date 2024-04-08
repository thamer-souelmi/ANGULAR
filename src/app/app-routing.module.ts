import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AllTemplateFrontComponent} from "./FrontOffice/all-template-front/all-template-front.component";
import {HomeFrontComponent} from "./FrontOffice/home-front/home-front.component";
import {
  FindAllJobOffersComponent
} from "./FrontOffice/pages/JobOffer/find-all-job-offers/find-all-job-offers.component";
import {WishlistComponent} from "./FrontOffice/pages/JobOffer/wishlist/wishlist.component";

const routes: Routes = [
  {
    path: "",
    component: AllTemplateFrontComponent,
    children:[
      {path:"home", component:HomeFrontComponent }
    ]
  },
  {
    path: "JobOffer",
    component: AllTemplateFrontComponent,children:[
      { path: 'findAllJobOffersfront', component: FindAllJobOffersComponent },
      { path: 'wishlist', component: WishlistComponent },

    ]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

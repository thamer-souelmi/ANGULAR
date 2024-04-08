import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AllTemplateFrontComponent} from "./FrontOffice/all-template-front/all-template-front.component";
import {HomeFrontComponent} from "./FrontOffice/home-front/home-front.component";
import {ActivityComponentF} from "./FrontOffice/pages/activity/activity.component";

const routes: Routes = [
  {
    path: "",
    component: AllTemplateFrontComponent,
    children:[
      {path:"home", component:HomeFrontComponent },
    ]
  },
  {

    path: "ActivityF",
    component: AllTemplateFrontComponent,children:[
      { path: 'getActivityF', component:ActivityComponentF },
    ]
  },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AllTemplateFrontComponent} from "./FrontOffice/all-template-front/all-template-front.component";
import {HomeFrontComponent} from "./FrontOffice/home-front/home-front.component";
import {ActivityComponentF} from "./FrontOffice/pages/activity/activity.component";

import {
  FindAllJobOffersComponent
} from "./FrontOffice/pages/JobOffer/find-all-job-offers/find-all-job-offers.component";
import {WishlistComponent} from "./FrontOffice/pages/JobOffer/wishlist/wishlist.component";

import {SidebarBackComponent} from "./BackOffice/sidebar-back/sidebar-back.component";
import { AllTemplatBackComponent } from './BackOffice/all-templat-back/all-templat-back.component';
import {EventBComponent} from "./BackOffice/Pages/event-b/event-b.component";
import { GetAllProjectComponent } from './FrontOffice/pages/Project/get-all-project/get-all-project.component';
import { ProjectDetailsComponent } from './FrontOffice/pages/Project/project-details/project-details.component';
import { UpdateprojectComponent } from './FrontOffice/pages/Project/updateproject/updateproject.component';
import { TasksByprojectComponent } from './FrontOffice/pages/Task/tasks-byproject/tasks-byproject.component';
import { AddTaskComponent } from './FrontOffice/pages/Task/add-task/add-task.component';
import { UpdateTaskComponent } from './FrontOffice/pages/Task/update-task/update-task.component';
import { KanbanBoardComponent } from './FrontOffice/pages/Task/kanban-board/kanban-board.component';
import { LoginComponent } from './BackOffice/Pages/login/login.component';
import {FindAllUsersComponent} from "./BackOffice/Pages/find-all-users/find-all-users.component";

import { FindAllProjectsComponent } from './BackOffice/Pages/Project/find-all-projects/find-all-projects.component';
import { ProjectChartComponent } from './BackOffice/Pages/Project/project-chart/project-chart.component';

import {EventComponent} from "./FrontOffice/pages/event/event.component";



const routes: Routes = [
  {
    path: "",
    component: LoginComponent,

  },

  {
    path: "back",
    component: AllTemplatBackComponent,
    children:[
      {path: "EventBack ", component: EventBComponent},

      {path:"findall", component:FindAllUsersComponent},
    ]},

  {
    path: "home",
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
  {

    path: "EventF",
    component: AllTemplateFrontComponent,children:[
      { path: 'EventF', component:EventComponent },
    ]
  },

  {
    path: "JobOffer",
    component: AllTemplateFrontComponent,children:[
      { path: 'findAllJobOffersfront', component: FindAllJobOffersComponent },
      { path: 'wishlist', component: WishlistComponent },

    ]},
    {
      path: "Project",
      component: AllTemplateFrontComponent,children:[
        { path: 'getAllProject', component: GetAllProjectComponent },
        { path: 'project/:id', component: ProjectDetailsComponent },
        { path: 'update-project/:id', component: UpdateprojectComponent },
        { path: 'task/:projectId', component: TasksByprojectComponent },



      ]
    },
    {
      path: "Task",
      component: AllTemplateFrontComponent,children:[
       // {path:'getAllTask', component:GetAllTasksComponent},
        { path: 'update-task/:id', component: UpdateTaskComponent },
        { path: 'kanban-task', component: KanbanBoardComponent},

      ]
    },
    {
      path: "Projectback",
      component: AllTemplatBackComponent,children:[
        { path: 'findProjects', component:FindAllProjectsComponent },
        { path: 'projectchart', component:ProjectChartComponent },
        { path: 'kanban-task', component: KanbanBoardComponent},
  
  
      ]
    },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

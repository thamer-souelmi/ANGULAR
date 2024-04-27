import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AllTemplateFrontComponent} from "./FrontOffice/all-template-front/all-template-front.component";
import {HomeFrontComponent} from "./FrontOffice/home-front/home-front.component";
import { ActivityComponentF } from './FrontOffice/Pages/activity/activity.component';
import { WishlistComponent } from './FrontOffice/Pages/JobOffer/wishlist/wishlist.component';

import {SidebarBackComponent} from "./BackOffice/sidebar-back/sidebar-back.component";
import { AllTemplatBackComponent } from './BackOffice/all-templat-back/all-templat-back.component';
import {EventBComponent} from "./BackOffice/Pages/event-b/event-b.component";
import { GetAllProjectComponent } from './FrontOffice/Pages/Project/get-all-project/get-all-project.component';
import { ProjectDetailsComponent } from './FrontOffice/Pages/Project/project-details/project-details.component';
import { UpdateprojectComponent } from './FrontOffice/Pages/Project/updateproject/updateproject.component';
import { TasksByprojectComponent } from './FrontOffice/Pages/Task/tasks-byproject/tasks-byproject.component';
import { AddTaskComponent } from './FrontOffice/Pages/Task/add-task/add-task.component';
import { UpdateTaskComponent } from './FrontOffice/Pages/Task/update-task/update-task.component';
import { KanbanBoardComponent } from './FrontOffice/Pages/Task/kanban-board/kanban-board.component';
import { LoginComponent } from './BackOffice/Pages/login/login.component';
import {FindAllUsersComponent} from "./BackOffice/Pages/find-all-users/find-all-users.component";

import { FindAllProjectsComponent } from './BackOffice/Pages/Project/find-all-projects/find-all-projects.component';
import { ProjectChartComponent } from './BackOffice/Pages/Project/project-chart/project-chart.component';

import { EventComponent } from './FrontOffice/Pages/event/event.component';
import {ActivityBComponent} from "./BackOffice/Pages/activity-b/activity-b.component";
import { FindAllJobOffersComponent } from './FrontOffice/Pages/JobOffer/find-all-job-offers/find-all-job-offers.component';
import { ForgotPasswordComponent } from './BackOffice/Pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './BackOffice/Pages/reset-password/reset-password.component';
import { UpdateUserComponent } from './BackOffice/Pages/update-user/update-user.component';
import { UserDetailComponent } from './BackOffice/Pages/user-detail/user-detail.component';
import { AddUserComponent } from './BackOffice/Pages/add-user/add-user.component';
import { LeavesComponent } from './BackOffice/Pages/leaves/leaves.component';
import { LeavesDetailsComponent } from './BackOffice/Pages/leaves-details/leaves-details.component';
import { LeaveComponent } from './FrontOffice/Pages/leave/leave.component';



const routes: Routes = [
  {
    path: "",
    component: LoginComponent,

  },
  {
    path: "reset",
    component: ForgotPasswordComponent,

  },
  { path: 'reset/:token', component: ResetPasswordComponent },
  {path:"ActivityB", component:AllTemplatBackComponent,
  children:[
    {path:"activityB", component:ActivityBComponent}
  ]},

  {
    path: "back",
    component: AllTemplatBackComponent,
    children:[
      {path:"EventBack", component:EventBComponent},
      {path:"activityB",component:ActivityBComponent},
      {path:"findall", component:FindAllUsersComponent},
      {path:"updateprofile/:", component:UpdateUserComponent},
      {path:"userdetails/:id", component:UserDetailComponent},
      {path:"adduser", component:AddUserComponent},
      {path:"leaves", component:LeavesComponent},
      {path:"leavedetails/:id", component:LeavesDetailsComponent},

    ]},

  {
    path: "home",
    component: AllTemplateFrontComponent,
    children:[
      {path:"home", component:HomeFrontComponent },
      {path:"leave", component:LeaveComponent},
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

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AllTemplateFrontComponent} from "./FrontOffice/all-template-front/all-template-front.component";
import {HomeFrontComponent} from "./FrontOffice/home-front/home-front.component";
import { ActivityComponentF } from './FrontOffice/pages/activity/activity.component';
import { WishlistComponent } from './FrontOffice/pages/JobOffer/wishlist/wishlist.component';

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
import {EventBComponent} from "./BackOffice/Pages/event-b/event-b.component";
import { GetAllProjectComponent } from './FrontOffice/pages/Project/get-all-project/get-all-project.component';
import { ProjectDetailsComponent } from './FrontOffice/pages/Project/project-details/project-details.component';
import { UpdateprojectComponent } from './FrontOffice/pages/Project/updateproject/updateproject.component';
import { TasksByprojectComponent } from './FrontOffice/pages/Task/tasks-byproject/tasks-byproject.component';
import { UpdateTaskComponent } from './FrontOffice/pages/Task/update-task/update-task.component';
import { KanbanBoardComponent } from './FrontOffice/pages/Task/kanban-board/kanban-board.component';
import { LoginComponent } from './BackOffice/Pages/login/login.component';
import {FindAllUsersComponent} from "./BackOffice/Pages/find-all-users/find-all-users.component";

import { FindAllProjectsComponent } from './BackOffice/Pages/Project/find-all-projects/find-all-projects.component';
import { ProjectChartComponent } from './BackOffice/Pages/Project/project-chart/project-chart.component';

import {EventComponent} from "./FrontOffice/pages/event/event.component";
import { TaskbackComponent } from './BackOffice/Pages/Task/taskback/taskback.component';
import { KanbanboardbackComponent } from './BackOffice/Pages/Task/kanbanboardback/kanbanboardback.component';
import { AppGanttChartComponent } from './BackOffice/Pages/Task/app-gantt-chart/app-gantt-chart.component';
import { TodolistComponent } from './BackOffice/Pages/Task/todolist/todolist.component';
import { DetailprojectbackComponent } from './BackOffice/Pages/Project/detailprojectback/detailprojectback.component';
import { PMstatisticComponent } from './BackOffice/Pages/Task/pmstatistic/pmstatistic.component';
import { PiecharttaskComponent } from './BackOffice/Pages/Task/piecharttask/piecharttask.component';

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
import {TrainingSessionComponent} from "./FrontOffice/pages/training-session/training-session.component";

import { FindAllJobOffersComponent } from './FrontOffice/pages/JobOffer/find-all-job-offers/find-all-job-offers.component';
import {FindAllQuizComponent} from "./BackOffice/Pages/Quiz/find-all-quiz/find-all-quiz.component";
import {RoomComponent} from "./BackOffice/Pages/room/room.component";




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
    path:"trainigSession", component:AllTemplateFrontComponent,
    children:[
      {path:"trainigSession", component:TrainingSessionComponent}
    ]
  },

  {path:"ActivityB", component:AllTemplatBackComponent,
  children:[
    {path:"activityB", component:ActivityBComponent}
  ]},

  {
    path: "back",
    component: AllTemplatBackComponent,
    children: [

      {path: "findAllJobOffersback", component: FindAllJobOffersBackComponent},
      {path: 'findAllJobCandidaciesBack/:id', component: FindAllJobCandidaciesBackComponent},
      {path: 'statisticsHR', component: StatisticsComponent},
      {path: 'statisticsCandidacies', component: StatisticsCandidaciesComponent},
      {path: 'statisticsInterviews', component: StatisticsInterviewComponent},
      {path: 'findInterviewBack/:id', component: InterviewDetailsBackComponent},
      {path: 'findQuiz', component: FindAllQuizComponent},

      {path:'room',component: RoomComponent},
      { path: 'taskback', component: TaskbackComponent},

      //{path:"findall", component:FindAllUsersComponent},

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

    path: "ActivityF", component: AllTemplateFrontComponent,children:[
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
      { path: 'job-offer-details/:id', component: JobOfferDetailsComponent },
      { path: 'wishlist', component: WishlistComponent },
      { path: 'findAllJobCandidacies/:id', component: FindAllJobCandidaciesComponent },
    ]},

  { path: 'quiz', component: QuizComponent },

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


        { path: 'kanbanback', component: KanbanboardbackComponent},
        { path: 'taskback', component: TaskbackComponent},
        { path: 'gantt', component: AppGanttChartComponent},
        { path: 'Todolist', component: TodolistComponent},
        { path: 'detailback', component: DetailprojectbackComponent},
        { path: 'emplyeestat', component: PMstatisticComponent},
        { path: 'taskpiechart/:projectId', component: PiecharttaskComponent},

      ]
    },

]
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

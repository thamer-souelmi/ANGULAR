import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AllTemplateFrontComponent} from "./FrontOffice/all-template-front/all-template-front.component";
import {HomeFrontComponent} from "./FrontOffice/home-front/home-front.component";

import {SidebarBackComponent} from "./BackOffice/sidebar-back/sidebar-back.component";
import { AllTemplatBackComponent } from './BackOffice/all-templat-back/all-templat-back.component';
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

import {
  InterviewDetailsBackComponent
} from "./BackOffice/Pages/JobOffer/interview-details-back/interview-details-back.component";
import {EventBComponent} from "./BackOffice/Pages/event-b/event-b.component";
import { LoginComponent } from './BackOffice/Pages/login/login.component';
import {FindAllUsersComponent} from "./BackOffice/Pages/find-all-users/find-all-users.component";

import { FindAllProjectsComponent } from './BackOffice/Pages/Project/find-all-projects/find-all-projects.component';
import { ProjectChartComponent } from './BackOffice/Pages/Project/project-chart/project-chart.component';

import { TaskbackComponent } from './BackOffice/Pages/Task/taskback/taskback.component';
import { KanbanboardbackComponent } from './BackOffice/Pages/Task/kanbanboardback/kanbanboardback.component';
import { AppGanttChartComponent } from './BackOffice/Pages/Task/app-gantt-chart/app-gantt-chart.component';
import { TodolistComponent } from './BackOffice/Pages/Task/todolist/todolist.component';
import { DetailprojectbackComponent } from './BackOffice/Pages/Project/detailprojectback/detailprojectback.component';
import { PMstatisticComponent } from './BackOffice/Pages/Task/pmstatistic/pmstatistic.component';
import { PiecharttaskComponent } from './BackOffice/Pages/Task/piecharttask/piecharttask.component';

import {ActivityBComponent} from "./BackOffice/Pages/activity-b/activity-b.component";
import { ForgotPasswordComponent } from './BackOffice/Pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './BackOffice/Pages/reset-password/reset-password.component';
import { UpdateUserComponent } from './BackOffice/Pages/update-user/update-user.component';
import { UserDetailComponent } from './BackOffice/Pages/user-detail/user-detail.component';
import { AddUserComponent } from './BackOffice/Pages/add-user/add-user.component';
import { LeavesComponent } from './BackOffice/Pages/leaves/leaves.component';
import { LeavesDetailsComponent } from './BackOffice/Pages/leaves-details/leaves-details.component';
// import { LeaveComponent } from './FrontOffice/Pages/leave/leave.component';
import { GetInvoicebyProjectComponent } from './BackOffice/Pages/Invoice/get-invoiceby-project/get-invoiceby-project.component';
import { InvoiceFrontComponent } from './FrontOffice/pages/Invoice/invoice-front/invoice-front.component';
import { ProjectsbackComponent } from './BackOffice/Pages/Project/projectsback/projectsback.component';
import { SavelistProjectComponent } from './FrontOffice/pages/Project/savelist-project/savelist-project.component';
import { ContractbyprojectComponent } from './FrontOffice/pages/contract/contractbyproject/contractbyproject.component';
import { AddcontractComponent } from './FrontOffice/pages/contract/addcontract/addcontract.component';
import { GetallcontractsComponent } from './FrontOffice/pages/contract/getallcontracts/getallcontracts.component';
import { EditContractComponent } from './FrontOffice/pages/contract/edit-contract/edit-contract.component';

import { FindAllJobOffersComponent } from './FrontOffice/pages/JobOffer/find-all-job-offers/find-all-job-offers.component';
import {FindAllQuizComponent} from "./BackOffice/Pages/Quiz/find-all-quiz/find-all-quiz.component";
import {RoomComponent} from "./BackOffice/Pages/room/room.component";
import {TrainingSessionBComponent} from "./BackOffice/Pages/training-session-b/training-session-b.component";

import { RecognizeFaceComponent } from './BackOffice/Pages/recognize-face/recognize-face.component';
import { DashboardComponent } from './BackOffice/Pages/dashboard/dashboard.component';
import { ActivityComponentF } from './FrontOffice/pages/activity/activity.component';
import { EventComponent } from './FrontOffice/pages/event/event.component';
import { JobOfferDetailsComponent } from './FrontOffice/pages/JobOffer/job-offer-details/job-offer-details.component';
import { WishlistComponent } from './FrontOffice/pages/JobOffer/wishlist/wishlist.component';
import { FindAllJobCandidaciesComponent } from './FrontOffice/pages/JobOffer/find-all-job-candidacies/find-all-job-candidacies.component';
import { QuizComponent } from './FrontOffice/pages/Quiz/quiz/quiz.component';
import { GetAllProjectComponent } from './FrontOffice/pages/Project/get-all-project/get-all-project.component';
import { ProjectDetailsComponent } from './FrontOffice/pages/Project/project-details/project-details.component';
import { UpdateprojectComponent } from './FrontOffice/pages/Project/updateproject/updateproject.component';
import { TasksByprojectComponent } from './FrontOffice/pages/Task/tasks-byproject/tasks-byproject.component';
import { UpdateTaskComponent } from './FrontOffice/pages/Task/update-task/update-task.component';
import { KanbanBoardComponent } from './FrontOffice/pages/Task/kanban-board/kanban-board.component';
import { TrainingSessionComponent } from './FrontOffice/pages/training-session/training-session.component';
import { ActionLogDiagramComponent } from './BackOffice/Pages/ProjectOffer/action-log-diagram/action-log-diagram.component';
import { AttendanceListComponent } from './BackOffice/Pages/attendance-list/attendance-list.component';
import { DataFlowLineageComponent } from './BackOffice/Pages/ProjectOffer/data-flow-lineage/data-flow-lineage.component';
import { InactiveEntitiesComponent } from './BackOffice/Pages/ProjectOffer/inactive-entities/inactive-entities.component';
import { GetProjectofferComponent } from './FrontOffice/pages/ProjectOffer/get-projectoffer/get-projectoffer.component';
import { AttendanceComponent } from './FrontOffice/pages/attendance/attendance.component';
import { UpdateQuoteComponent } from './FrontOffice/pages/Quote/update-quote/update-quote.component';
import { GetQuotesComponent } from './FrontOffice/pages/Quote/get-quotes/get-quotes.component';
import { AddQuoteComponent } from './FrontOffice/pages/Quote/add-quote/add-quote.component';
import { UpdateProjectofferComponent } from './FrontOffice/pages/ProjectOffer/update-projectoffer/update-projectoffer.component';
import { ScreenshotDisplayComponent } from './BackOffice/Pages/screenshot-display/screenshot-display.component';
import { AddProjectofferComponent } from './FrontOffice/pages/ProjectOffer/add-projectoffer/add-projectoffer.component';




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
  {  path:"trainigSession", component:AllTemplateFrontComponent,
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
    children:[
      { path: 'getprojectoffer', component: GetProjectofferComponent },
      { path: 'inactiveprojectoffer', component: InactiveEntitiesComponent },



      {path:"findall", component:FindAllUsersComponent},

      { path: 'dataflow', component: DataFlowLineageComponent },
      { path: 'projectofferflow', component: ActionLogDiagramComponent },
      { path: 'atte', component: AttendanceListComponent },
      { path: 'atte', component: AttendanceListComponent },
      { path: 'screenshots', component: ScreenshotDisplayComponent },



      {path: "findAllJobOffersback", component: FindAllJobOffersBackComponent},
      {path : "trainingSessionB",component: TrainingSessionBComponent},
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
      {path:"11", component:RecognizeFaceComponent},
      {path:"dashboard", component:DashboardComponent},


    ]},


  {
    path: "home",
    component: AllTemplateFrontComponent,
    children:[
      {path:"home", component:HomeFrontComponent },
      {path:"leave", component:LeavesComponent},
      { path: 'addquote', component: AddQuoteComponent },
      { path: 'getquote', component: GetQuotesComponent },
      { path: 'updatequote/:id', component: UpdateQuoteComponent }, // New route for updating job offers
      { path: 'getprojectoffers', component:GetProjectofferComponent },
      { path: 'update-project-offer/:id', component: UpdateProjectofferComponent }, // New route for updating job offers
      { path: 'add-project-offer', component: AddProjectofferComponent }, // New route for updating job offers

      { path: 'att', component: AttendanceComponent },


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
    
    
    // {

    //   path: "projectoffer",
    //   component: AllTemplateFrontComponent,children:[
    //     { path: 'getprojectoffers', component:GetProjectofferComponent },
    //     { path: 'update-project-offer/:id', component: UpdateProjectofferComponent }, // New route for updating job offers

    //   ]
    // },
    // {
    //   path: "quote",
    //   component: AllTemplateFrontComponent, children: [
    //     { path: 'addquote', component: AddQuoteComponent },
    //     { path: 'getquote', component: GetQuotesComponent },
    //     { path: 'updatequote/:id', component: UpdateQuoteComponent }, // New route for updating job offers
  
  
  
    //   ]
    // },
    // {
    //   path: "att",
    //   component: AllTemplateFrontComponent, children: [
    //     { path: 'att', component: AttendanceComponent },
    //   ]
    // },


  { path: 'quiz', component: QuizComponent },

    {
      path: "Project",
      component: AllTemplateFrontComponent,children:[
        { path: 'getAllProject', component: GetAllProjectComponent },
        { path: 'project/:id', component: ProjectDetailsComponent },
        { path: 'update-project/:id', component: UpdateprojectComponent },
        { path: 'task/:projectId', component: TasksByprojectComponent },
        { path: 'invoicefront/:projectId', component: InvoiceFrontComponent },
        { path: 'saveproject', component: SavelistProjectComponent },
        { path: 'Contract/:projectId', component: ContractbyprojectComponent },
        { path: 'addcontract', component: AddcontractComponent },
        { path: 'getallcontracts', component: GetallcontractsComponent },









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
        { path: 'taskback/:projectId', component: TaskbackComponent},
        { path: 'gantt', component: AppGanttChartComponent},
        { path: 'Todolist', component: TodolistComponent},
        { path: 'detailback', component: DetailprojectbackComponent},
        { path: 'emplyeestat', component: PMstatisticComponent},
        { path: 'taskpiechart/:projectId', component: PiecharttaskComponent},
        { path: 'invoice/:projectId', component: GetInvoicebyProjectComponent},
        { path: 'testt', component: ProjectsbackComponent},




      ]
    },

]
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

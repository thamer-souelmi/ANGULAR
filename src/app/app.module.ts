import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule, provideAnimations } from "@angular/platform-browser/animations";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AllTemplateFrontComponent } from './FrontOffice/all-template-front/all-template-front.component';
import { FooterFrontComponent } from "./FrontOffice/footer-front/footer-front.component";
import { HeaderFrontComponent } from "./FrontOffice/header-front/header-front.component";
import { HomeFrontComponent } from './FrontOffice/home-front/home-front.component';
import { ActivityComponentF } from './FrontOffice/pages/activity/activity.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from '@angular/common/http';
import { FindAllJobOffersComponent } from './FrontOffice/pages/JobOffer/find-all-job-offers/find-all-job-offers.component';
import { WishlistComponent } from './FrontOffice/pages/JobOffer/wishlist/wishlist.component';

import { CommonModule, DatePipe } from "@angular/common";
import { NgbDatepickerModule, NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatMenuModule } from "@angular/material/menu";
import { FeatherModule } from 'angular-feather';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { allIcons } from 'angular-feather/icons';
import { httpInterceptorProviders } from './Helpers/http-request-interceptor';
import { LoginComponent } from './BackOffice/Pages/login/login.component';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { SidebarBackComponent } from "./BackOffice/sidebar-back/sidebar-back.component";
import { NavbarBackComponent } from "./BackOffice/navbar-back/navbar-back.component";
import { FooterBackComponent } from "./BackOffice/footer-back/footer-back.component";
import { AllTemplatBackComponent } from "./BackOffice/all-templat-back/all-templat-back.component";
import { UpdateprojectComponent } from './FrontOffice/pages/Project/updateproject/updateproject.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { TasksByprojectComponent } from './FrontOffice/pages/Task/tasks-byproject/tasks-byproject.component';
import { UpdateTaskComponent } from './FrontOffice/pages/Task/update-task/update-task.component';
import { AddTaskComponent } from './FrontOffice/pages/Task/add-task/add-task.component';
import { KanbanBoardComponent } from './FrontOffice/pages/Task/kanban-board/kanban-board.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FullCalendarModule } from "@fullcalendar/angular";
import { AddProjectofferComponent } from './FrontOffice/pages/ProjectOffer/add-projectoffer/add-projectoffer.component';
import { GetProjectofferComponent } from './FrontOffice/pages/ProjectOffer/get-projectoffer/get-projectoffer.component';
import { FilterPipe } from './FrontOffice/pages/ProjectOffer/get-projectoffer/app-filter.pipe';
import { UpdateProjectofferComponent } from './FrontOffice/pages/ProjectOffer/update-projectoffer/update-projectoffer.component';
import { AddQuoteComponent } from './FrontOffice/pages/Quote/add-quote/add-quote.component';
import { GetQuotesComponent } from './FrontOffice/pages/Quote/get-quotes/get-quotes.component';
import { UpdateQuoteComponent } from './FrontOffice/pages/Quote/update-quote/update-quote.component';
import { DataFlowLineageComponent } from './BackOffice/Pages/ProjectOffer/data-flow-lineage/data-flow-lineage.component';
import { ActionLogDiagramComponent } from './BackOffice/Pages/ProjectOffer/action-log-diagram/action-log-diagram.component';
import { InactiveEntitiesComponent } from './BackOffice/Pages/ProjectOffer/inactive-entities/inactive-entities.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CustomSnackBarComponent } from './BackOffice/Pages/ProjectOffer/custom-snack-bar/custom-snack-bar.component'; // Import MatSnackBarModule
import { MapComponent } from './FrontOffice/pages/ProjectOffer/map/map.component';
import { AttendanceComponent } from './FrontOffice/pages/attendance/attendance.component';
import { AttendanceListComponent } from './BackOffice/Pages/attendance-list/attendance-list.component';
import { FindAllJobCandidaciesComponent } from './FrontOffice/pages/JobOffer/find-all-job-candidacies/find-all-job-candidacies.component';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { FindAllJobOffersBackComponent } from './BackOffice/Pages/JobOffer/find-all-job-offers-back/find-all-job-offers-back.component';
import { MatCardModule } from '@angular/material/card';
import { FindAllJobCandidaciesBackComponent } from './BackOffice/Pages/JobOffer/find-all-job-candidacies-back/find-all-job-candidacies-back.component';
import { StatisticsComponent } from './BackOffice/Pages/JobOffer/statistics/statistics.component';
import { StatisticsCandidaciesComponent } from './BackOffice/Pages/JobOffer/statistics-candidacies/statistics-candidacies.component';
import { StatisticsInterviewComponent } from './BackOffice/Pages/JobOffer/statistics-interview/statistics-interview.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { QuizComponent } from "./FrontOffice/pages/Quiz/quiz/quiz.component";
import { InterviewDetailsComponent } from './FrontOffice/pages/Interview/interview-details/interview-details.component';
import { UpdateInterviewComponent } from './FrontOffice/pages/Interview/update-interview/update-interview.component';
import { InterviewDetailsBackComponent } from './BackOffice/Pages/JobOffer/interview-details-back/interview-details-back.component';
import { UpdateJobOfferComponent } from './FrontOffice/pages/JobOffer/update-job-offer/update-job-offer.component';
import { CandiadateLinkedInDetailsComponent } from './FrontOffice/pages/JobOffer/candiadate-linked-in-details/candiadate-linked-in-details.component';
import { JobOfferDetailsBackComponent } from './BackOffice/Pages/JobOffer/job-offer-details-back/job-offer-details-back.component';
import { CandidateLinkedInDetailsBackComponent } from './BackOffice/Pages/JobOffer/candidate-linked-in-details-back/candidate-linked-in-details-back.component';
import { FindAllUsersComponent } from "./BackOffice/Pages/find-all-users/find-all-users.component";
import { FilterJobPipe } from './FrontOffice/pages/JobOffer/filter-job.pipe';

import { NgxCaptchaModule } from "ngx-captcha";


import { AvatarModule } from 'ngx-avatars';
import { FormsuggestComponent } from './FrontOffice/pages/Task/formsuggest/formsuggest.component';
import { UsersuggestinfoComponent } from './FrontOffice/pages/Task/usersuggestinfo/usersuggestinfo.component';
import { FindAllProjectsComponent } from './BackOffice/Pages/Project/find-all-projects/find-all-projects.component';
import { ChartModule } from 'angular-highcharts';
import { ProjectChartComponent } from './BackOffice/Pages/Project/project-chart/project-chart.component';


import { EventComponent } from './FrontOffice/pages/event/event.component';
import { TaskbackComponent } from './BackOffice/Pages/Task/taskback/taskback.component';
import { KanbanboardbackComponent } from './BackOffice/Pages/Task/kanbanboardback/kanbanboardback.component';
import { AppGanttChartComponent } from './BackOffice/Pages/Task/app-gantt-chart/app-gantt-chart.component';
import { TodolistComponent } from './BackOffice/Pages/Task/todolist/todolist.component';
import { MatSortModule } from '@angular/material/sort';
import { DetailprojectbackComponent } from './BackOffice/Pages/Project/detailprojectback/detailprojectback.component';
import { PMstatisticComponent } from './BackOffice/Pages/Task/pmstatistic/pmstatistic.component';
import { PiecharttaskComponent } from './BackOffice/Pages/Task/piecharttask/piecharttask.component'; import { ActivityBComponent } from './BackOffice/Pages/activity-b/activity-b.component';
import { RegistrationBComponent } from './BackOffice/Pages/registration-b/registration-b.component';
import {
  TrainingSessionComponent
} from './FrontOffice/pages/training-session/training-session.component';
import { MatGridListModule } from "@angular/material/grid-list";
import { EventBComponent } from './BackOffice/Pages/event-b/event-b.component';
import { ForgotPasswordComponent } from './BackOffice/Pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './BackOffice/Pages/reset-password/reset-password.component';
import { UpdateUserComponent } from './BackOffice/Pages/update-user/update-user.component';
import { UserDetailComponent } from './BackOffice/Pages/user-detail/user-detail.component';
import { AddUserComponent } from './BackOffice/Pages/add-user/add-user.component';
import { LeavesComponent } from './BackOffice/Pages/leaves/leaves.component';
import { LeavesDetailsComponent } from './BackOffice/Pages/leaves-details/leaves-details.component';
import { AddLeaveComponent } from './BackOffice/Pages/add-leave/add-leave.component';
import { AddInterviewComponent } from './FrontOffice/pages/Interview/add-interview/add-interview.component';
import { FindAllQuizComponent } from './BackOffice/Pages/Quiz/find-all-quiz/find-all-quiz.component';
import { ChunkPipe } from './BackOffice/Pages/Quiz/chunk.pipe';
import { MatBadgeModule } from '@angular/material/badge';
import { AddQuizQuestionComponent } from './BackOffice/Pages/Quiz/add-quiz-question/add-quiz-question.component';
import { EditQuizQuestionComponent } from './BackOffice/Pages/Quiz/edit-quiz-question/edit-quiz-question.component';
import { RoomComponent } from './BackOffice/Pages/room/room.component';
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { AddMarkComponent } from './FrontOffice/pages/JobOffer/add-mark/add-mark.component';
import { MatMenu } from '@angular/material/menu';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { JoinPipe } from "./join.pipe";
import { CustomizerComponent } from './customizer/customizer.component';
import { PickerComponent, PickerModule } from "@ctrl/ngx-emoji-mart";
import { EmojiModule } from "@ctrl/ngx-emoji-mart/ngx-emoji";
import { provideToastr } from 'ngx-toastr';
import { RecognizeFaceComponent } from './BackOffice/Pages/recognize-face/recognize-face.component';
import { DashboardComponent } from './BackOffice/Pages/dashboard/dashboard.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { JitsiComponent } from "./FrontOffice/pages/Interview/jitsi/jitsi.component";
import { InterviewCalendarComponent } from './FrontOffice/pages/Interview/interview-calendar/interview-calendar.component';

const socketConfig: SocketIoConfig = { url: 'http://localhost:5000', options: {} };

import { TrainingSessionBComponent } from './BackOffice/Pages/training-session-b/training-session-b.component';
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { JitsiMeetComponent } from './jitsi-meet/jitsi-meet.component';
import { FeedbackStatsChartD3Component } from './feedback-stats-chart-d3/feedback-stats-chart-d3.component';
import { ProjectFormComponent } from "./FrontOffice/pages/Project/project-form/project-form.component";
import { ProjectDetailsComponent } from "./FrontOffice/pages/Project/project-details/project-details.component";
import {
  ProjectCalendarModalComponent
} from "./FrontOffice/pages/Project/project-calendar-modal/project-calendar-modal.component";
import { GetAllProjectComponent } from "./FrontOffice/pages/Project/get-all-project/get-all-project.component";
import {
  GetInvoicebyProjectComponent
} from "./BackOffice/Pages/Invoice/get-invoiceby-project/get-invoiceby-project.component";
import { InvoiceFrontComponent } from "./FrontOffice/pages/Invoice/invoice-front/invoice-front.component";
import { EditInvoiceItemComponent } from "./FrontOffice/pages/Invoice/edit-invoice-item/edit-invoice-item.component";
import { AddInvoiceItemComponent } from "./FrontOffice/pages/Invoice/add-invoice-item/add-invoice-item.component";
import { ProjectsbackComponent } from "./BackOffice/Pages/Project/projectsback/projectsback.component";
import { AddlinkComponent } from "./BackOffice/Pages/Task/addlink/addlink.component";
import { TeamsmodalComponent } from "./BackOffice/Pages/Project/teamsmodal/teamsmodal.component";
import { SavelistProjectComponent } from "./FrontOffice/pages/Project/savelist-project/savelist-project.component";
import { ContractbyprojectComponent } from "./FrontOffice/pages/contract/contractbyproject/contractbyproject.component";
import { AddcontractComponent } from "./FrontOffice/pages/contract/addcontract/addcontract.component";
import { GetallcontractsComponent } from "./FrontOffice/pages/contract/getallcontracts/getallcontracts.component";
import { EditContractComponent } from "./FrontOffice/pages/contract/edit-contract/edit-contract.component";
import { FiltertaskpipePipe } from "./FrontOffice/pages/Task/filtertaskpipe.pipe";
import { ScreenshotComponent } from './FrontOffice/pages/screenshot/screenshot.component';
import { ScreenshotDisplayComponent } from './BackOffice/Pages/screenshot-display/screenshot-display.component';
import { FilterByDatePipe } from './BackOffice/Pages/attendance-list/filter-by-date.pipe';
import { AttendancePageComponent } from './BackOffice/Pages/attendance-page/attendance-page.component';
// import {UpdateJobOfferComponent} from "./FrontOffice/pages/JobOffer/update-job-offer/update-job-offer.component";
// import {UpdateJobOfferComponent} from "./FrontOffice/pages/JobOffer/update-job-offer/update-job-offer.component";
import { NgxPaginationModule } from 'ngx-pagination';
import { NotFoundComponent } from './BackOffice/Pages/not-found/not-found.component';


@NgModule({
  declarations: [
    AppComponent,
    AllTemplateFrontComponent,
    FooterFrontComponent,
    HeaderFrontComponent,
    UpdateprojectComponent,
    UpdateTaskComponent,
    HomeFrontComponent,
    ActivityComponentF,
    EventComponent,
    FindAllJobOffersComponent,
    WishlistComponent,
    SidebarBackComponent,
    NavbarBackComponent,
    FooterBackComponent,
    AllTemplatBackComponent,
    FilterJobPipe,
    EventBComponent,
    UpdateprojectComponent,
    ProjectDetailsComponent,
    ProjectCalendarModalComponent,
    ProjectFormComponent,
    GetAllProjectComponent,
    TasksByprojectComponent,
    UpdateTaskComponent,
    AddTaskComponent,
    KanbanBoardComponent,
    LoginComponent,
    FindAllUsersComponent,
    FilterJobPipe,
    ActivityBComponent,
    AddProjectofferComponent,
    GetProjectofferComponent,
    FilterPipe,
    UpdateProjectofferComponent,
    AddQuoteComponent,
    GetQuotesComponent,
    UpdateQuoteComponent,
    DataFlowLineageComponent,
    ActionLogDiagramComponent,
    InactiveEntitiesComponent,
    CustomSnackBarComponent,
    MapComponent,
    AttendanceComponent,
    AttendanceListComponent,

    FindAllJobCandidaciesComponent,
    FindAllJobOffersBackComponent,
    FindAllJobCandidaciesBackComponent,
    StatisticsComponent,
    StatisticsCandidaciesComponent,
    StatisticsInterviewComponent,
    QuizComponent,
    InterviewCalendarComponent,
    InterviewDetailsComponent,
    UpdateInterviewComponent,
    InterviewDetailsBackComponent,
    UpdateJobOfferComponent,
    CandiadateLinkedInDetailsComponent,
    JobOfferDetailsBackComponent,
    CandidateLinkedInDetailsBackComponent,

    LoginComponent,
    FindAllUsersComponent,
    FilterJobPipe,
    FindAllUsersComponent,
    FilterJobPipe,
    ActivityBComponent,
    FormsuggestComponent,
    UsersuggestinfoComponent,
    FindAllProjectsComponent,
    ProjectChartComponent,
    TaskbackComponent,
    KanbanboardbackComponent,
    AppGanttChartComponent,
    TodolistComponent,
    DetailprojectbackComponent,
    PMstatisticComponent,
    PiecharttaskComponent,
    RegistrationBComponent,
    TrainingSessionComponent,

    TasksByprojectComponent,
    KanbanBoardComponent,
    EventBComponent,
    ProjectFormComponent,
    ProjectDetailsComponent,
    ProjectCalendarModalComponent,
    GetAllProjectComponent,

    GetInvoicebyProjectComponent,
    InvoiceFrontComponent,
    AddInvoiceItemComponent,
    EditInvoiceItemComponent,
    ProjectsbackComponent,
    AddlinkComponent,
    TeamsmodalComponent,
    SavelistProjectComponent,
    ContractbyprojectComponent,
    AddcontractComponent,
    GetallcontractsComponent,
    EditContractComponent,
    FiltertaskpipePipe,

    ForgotPasswordComponent,
    ResetPasswordComponent,
    UpdateUserComponent,
    UserDetailComponent,
    AddUserComponent,
    LeavesComponent,
    LeavesDetailsComponent,
    AddLeaveComponent,

    JitsiComponent,
    AddInterviewComponent,
    FindAllQuizComponent,
    ChunkPipe,
    AddQuizQuestionComponent,
    EditQuizQuestionComponent,
    RoomComponent,

    AddMarkComponent,
    JoinPipe,
    CustomizerComponent,
    TrainingSessionBComponent,
    JitsiMeetComponent,
    FeedbackStatsChartD3Component,


    RecognizeFaceComponent,
    DashboardComponent,
    ScreenshotComponent,
    ScreenshotDisplayComponent,
    FilterByDatePipe,
    AttendancePageComponent,
    NotFoundComponent // Add the pipe to the declarations array

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatIconModule,
    MatDialogModule,
    MatTableModule,
    MatButtonModule,
    CommonModule,
    NgbModalModule,
    NgbDatepickerModule,
    MatSidenavModule,
    MatToolbarModule,
    MatRippleModule,
    MatMenuModule,
    MatSnackBarModule,
    ToastrModule.forRoot({
      timeOut: 2000,
      progressBar: true,
      progressAnimation: "increasing",
      preventDuplicates: true
    }),
    FeatherModule.pick(allIcons),
  // ToastrModule added
    MatCardModule,
    NgxChartsModule,
    MatTooltipModule,
    FullCalendarModule,
    HttpClientModule,
    NgxCaptchaModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    DragDropModule,
    AvatarModule,
    ChartModule,
    BsDropdownModule.forRoot(),
    SocketIoModule.forRoot(socketConfig),
    MatSortModule,
    MatCheckboxModule,
    MatGridListModule,
    MatNativeDateModule,
    MatBadgeModule,
    EmojiModule,
    PickerComponent,
    CKEditorModule,
    MatPaginatorModule,
    MatInputModule,
    MatDatepickerModule,
    NgxPaginationModule
  
  ],
  providers: [httpInterceptorProviders, DatePipe, provideAnimations(), // required animations providers
    provideToastr(),],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class AppModule { }
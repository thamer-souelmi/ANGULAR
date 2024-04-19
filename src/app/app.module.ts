import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule} from "@angular/platform-browser";
import { BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AllTemplateFrontComponent } from './FrontOffice/all-template-front/all-template-front.component';
import { FooterFrontComponent} from "./FrontOffice/footer-front/footer-front.component";
import { HeaderFrontComponent} from "./FrontOffice/header-front/header-front.component";
import { HomeFrontComponent } from './FrontOffice/home-front/home-front.component';
import { ActivityComponentF } from './FrontOffice/pages/activity/activity.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from '@angular/common/http';
import { EventComponent } from './FrontOffice/pages/event/event.component';
import { FindAllJobOffersComponent } from './FrontOffice/pages/JobOffer/find-all-job-offers/find-all-job-offers.component';
import { WishlistComponent } from './FrontOffice/pages/JobOffer/wishlist/wishlist.component';

import { CommonModule, DatePipe } from "@angular/common";
// import { FullCalendarModule } from '@fullcalendar/angular';
import { NgbDatepickerModule, NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatToolbarModule } from "@angular/material/toolbar";
import {MatNativeDateModule, MatRippleModule} from "@angular/material/core";
import { MatMenuModule } from "@angular/material/menu";
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { httpInterceptorProviders } from './Helpers/http-request-interceptor';
import { LoginComponent } from './BackOffice/Pages/login/login.component';

import {SidebarBackComponent} from "./BackOffice/sidebar-back/sidebar-back.component";
import {NavbarBackComponent} from "./BackOffice/navbar-back/navbar-back.component";
import {FooterBackComponent} from "./BackOffice/footer-back/footer-back.component";
import {AllTemplatBackComponent} from "./BackOffice/all-templat-back/all-templat-back.component";
import {FindAllUsersComponent} from "./BackOffice/Pages/find-all-users/find-all-users.component";
import { FilterJobPipe } from './FrontOffice/pages/JobOffer/filter-job.pipe';

import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { TasksByprojectComponent } from './FrontOffice/pages/Task/tasks-byproject/tasks-byproject.component';
import { UpdateTaskComponent } from './FrontOffice/pages/Task/update-task/update-task.component';
import { KanbanBoardComponent } from './FrontOffice/pages/Task/kanban-board/kanban-board.component';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { FormsuggestComponent } from './FrontOffice/pages/Task/formsuggest/formsuggest.component';
import { UsersuggestinfoComponent } from './FrontOffice/pages/Task/usersuggestinfo/usersuggestinfo.component';
import { FindAllProjectsComponent } from './BackOffice/Pages/Project/find-all-projects/find-all-projects.component';
import { ChartModule } from 'angular-highcharts';
import { ProjectChartComponent } from './BackOffice/Pages/Project/project-chart/project-chart.component';


import {FullCalendarModule} from "@fullcalendar/angular";
import { ActivityBComponent } from './BackOffice/Pages/activity-b/activity-b.component';
import { RegistrationBComponent } from './BackOffice/Pages/registration-b/registration-b.component';
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {
  TrainingSessionComponent} from './FrontOffice/pages/training-session/training-session.component';
import {MatGridListModule} from "@angular/material/grid-list";
import {MatCardModule} from "@angular/material/card";
import { EventBComponent } from './BackOffice/Pages/event-b/event-b.component';
import { ProjectFormComponent } from './FrontOffice/pages/Project/project-form/project-form.component';
import { ProjectDetailsComponent } from './FrontOffice/pages/Project/project-details/project-details.component';
import { ProjectCalendarModalComponent } from './FrontOffice/pages/Project/project-calendar-modal/project-calendar-modal.component';
import { GetAllProjectComponent } from './FrontOffice/pages/Project/get-all-project/get-all-project.component';
import { NgxCaptchaModule } from 'ngx-captcha';
import { UpdateprojectComponent } from './FrontOffice/pages/Project/updateproject/updateproject.component';
import {BsDatepickerModule} from "ngx-bootstrap/datepicker";
import {MatDatepickerModule} from "@angular/material/datepicker";
import { NgxTimepickerModule } from 'ngx-timepicker';


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
    ProjectDetailsComponent,
    EventComponent,
    FindAllJobOffersComponent,
    WishlistComponent,
    SidebarBackComponent,
    NavbarBackComponent,
    FooterBackComponent,
    AllTemplatBackComponent,
    LoginComponent,
    FindAllUsersComponent,
    FilterJobPipe,
    FindAllUsersComponent ,
    ActivityBComponent,
    FormsuggestComponent,
    UsersuggestinfoComponent,
    FindAllProjectsComponent,
    ProjectChartComponent,
    RegistrationBComponent,
    TrainingSessionComponent,

    TasksByprojectComponent,
    KanbanBoardComponent,
    EventBComponent,
    ProjectFormComponent,
    ProjectDetailsComponent,
    ProjectCalendarModalComponent,
    GetAllProjectComponent,
  ],
  imports: [
    BrowserModule,
    NgxCaptchaModule,
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
    MatButtonModule,
    FeatherModule.pick(allIcons),
    FormsModule,
    HttpClientModule,
    NgbModule,

    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,

    }),
    DragDropModule,
    BsDatepickerModule.forRoot(),
   // AvatarModule,
   ChartModule,

    FullCalendarModule,
    MatCardModule,
    MatGridListModule,
    // MatTimepickerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxTimepickerModule



  ],
  providers: [httpInterceptorProviders,DatePipe],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class AppModule { }

import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule} from "@angular/platform-browser";
import { BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AllTemplateFrontComponent } from './FrontOffice/all-template-front/all-template-front.component';
import { FooterFrontComponent} from "./FrontOffice/footer-front/footer-front.component";
import { HeaderFrontComponent} from "./FrontOffice/header-front/header-front.component";
import { HomeFrontComponent } from './FrontOffice/home-front/home-front.component';
import { ActivityComponentF } from './FrontOffice/Pages/activity/activity.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from '@angular/common/http';
import { EventComponent } from './FrontOffice/Pages/event/event.component';
import { FindAllJobOffersComponent } from './FrontOffice/Pages/JobOffer/find-all-job-offers/find-all-job-offers.component';
import { WishlistComponent } from './FrontOffice/Pages/JobOffer/wishlist/wishlist.component';
import { CommonModule, DatePipe } from "@angular/common";
// import { FullCalendarModule } from '@fullcalendar/angular';
import { NgbDatepickerModule, NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatRippleModule } from "@angular/material/core";
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
import { FilterJobPipe } from './FrontOffice/Pages/JobOffer/filter-job.pipe';

import {NgxCaptchaModule} from "ngx-captcha";
import { UpdateprojectComponent } from './FrontOffice/Pages/Project/updateproject/updateproject.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { TasksByprojectComponent } from './FrontOffice/Pages/Task/tasks-byproject/tasks-byproject.component';
import { UpdateTaskComponent } from './FrontOffice/Pages/Task/update-task/update-task.component';
import { KanbanBoardComponent } from './FrontOffice/Pages/Task/kanban-board/kanban-board.component';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { AvatarModule } from 'ngx-avatars';
import { FormsuggestComponent } from './FrontOffice/Pages/Task/formsuggest/formsuggest.component';
import { UsersuggestinfoComponent } from './FrontOffice/Pages/Task/usersuggestinfo/usersuggestinfo.component';
import { FindAllProjectsComponent } from './BackOffice/Pages/Project/find-all-projects/find-all-projects.component';
import { ChartModule } from 'angular-highcharts';
import { ProjectChartComponent } from './BackOffice/Pages/Project/project-chart/project-chart.component';


import {FullCalendarModule} from "@fullcalendar/angular";
import { ActivityBComponent } from './BackOffice/Pages/activity-b/activity-b.component';
import { EventBComponent } from './BackOffice/Pages/event-b/event-b.component';
import { ProjectFormComponent } from './FrontOffice/Pages/Project/project-form/project-form.component';
import { ProjectDetailsComponent } from './FrontOffice/Pages/Project/project-details/project-details.component';
import { ProjectCalendarModalComponent } from './FrontOffice/Pages/Project/project-calendar-modal/project-calendar-modal.component';
import { GetAllProjectComponent } from './FrontOffice/Pages/Project/get-all-project/get-all-project.component';


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
    LoginComponent,
    FindAllUsersComponent,
    FilterJobPipe, 
    FindAllUsersComponent ,
    FilterJobPipe,
    ActivityBComponent,
    FormsuggestComponent,
    UsersuggestinfoComponent,
    FindAllProjectsComponent,
    ProjectChartComponent,
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
    MatButtonModule,
    FeatherModule.pick(allIcons),
    FormsModule,
    HttpClientModule,
    NgbModule,
    NgxCaptchaModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,

    }),
    DragDropModule,

    AvatarModule,
   ChartModule,

    FullCalendarModule
  ],
  providers: [httpInterceptorProviders,DatePipe],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class AppModule { }

import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { EventComponent } from './FrontOffice/pages/event/event.component';
import { FindAllJobOffersComponent } from './FrontOffice/pages/JobOffer/find-all-job-offers/find-all-job-offers.component';
import { WishlistComponent } from './FrontOffice/pages/JobOffer/wishlist/wishlist.component';
import { FilterJobPipe } from './FrontOffice/pages/JobOffer/filter-job.pipe';
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
import { FindAllUsersComponent } from './BackOffice/Pages/find-all-users/find-all-users.component';

import {SidebarBackComponent} from "./BackOffice/sidebar-back/sidebar-back.component";
import {NavbarBackComponent} from "./BackOffice/navbar-back/navbar-back.component";
import {FooterBackComponent} from "./BackOffice/footer-back/footer-back.component";
import {AllTemplatBackComponent} from "./BackOffice/all-templat-back/all-templat-back.component";
import { UpdateprojectComponent } from './FrontOffice/pages/Project/updateproject/updateproject.component';
import { ProjectDetailsComponent } from './FrontOffice/pages/Project/project-details/project-details.component';
import { ProjectCalendarModalComponent } from './FrontOffice/pages/Project/project-calendar-modal/project-calendar-modal.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { ProjectFormComponent } from './FrontOffice/pages/Project/project-form/project-form.component';
import { GetAllProjectComponent } from './FrontOffice/pages/Project/get-all-project/get-all-project.component';
import { TasksByprojectComponent } from './FrontOffice/pages/Task/tasks-byproject/tasks-byproject.component';
import { UpdateTaskComponent } from './FrontOffice/pages/Task/update-task/update-task.component';
import { AddTaskComponent } from './FrontOffice/pages/Task/add-task/add-task.component';
import { KanbanBoardComponent } from './FrontOffice/pages/Task/kanban-board/kanban-board.component';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [
    AppComponent,
    AllTemplateFrontComponent,
    FooterFrontComponent,
    HeaderFrontComponent,
    HomeFrontComponent,
    ActivityComponentF,
    EventComponent,
    FindAllJobOffersComponent,
    WishlistComponent,
    SidebarBackComponent,
    NavbarBackComponent,
    FooterBackComponent,
    AllTemplatBackComponent,
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
    FindAllUsersComponent ,
    FilterJobPipe // Ensure pipes are also declared

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
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
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
      
    }),
    DragDropModule,
  ],

  providers: [DatePipe],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class AppModule { }
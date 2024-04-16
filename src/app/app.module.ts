import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AllTemplateFrontComponent } from './FrontOffice/all-template-front/all-template-front.component';
import { FooterFrontComponent} from "./FrontOffice/footer-front/footer-front.component";
import { HeaderFrontComponent} from "./FrontOffice/header-front/header-front.component";
import { HomeFrontComponent } from './FrontOffice/home-front/home-front.component';

import { FindAllJobOffersComponent } from './FrontOffice/pages/JobOffer/find-all-job-offers/find-all-job-offers.component';
import { WishlistComponent } from './FrontOffice/pages/JobOffer/wishlist/wishlist.component';
import { FilterJobPipe } from './FrontOffice/pages/JobOffer/filter-job.pipe';
import { CommonModule, DatePipe } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatPaginatorModule } from '@angular/material/paginator';
import { FullCalendarModule } from '@fullcalendar/angular';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { NgbDatepickerModule, NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatRippleModule } from "@angular/material/core";
import { MatMenuModule } from "@angular/material/menu";
import { FeatherModule } from 'angular-feather';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { allIcons } from 'angular-feather/icons';
import {SidebarBackComponent} from "./BackOffice/sidebar-back/sidebar-back.component";
import {NavbarBackComponent} from "./BackOffice/navbar-back/navbar-back.component";
import {FooterBackComponent} from "./BackOffice/footer-back/footer-back.component";
import {AllTemplatBackComponent} from "./BackOffice/all-templat-back/all-templat-back.component";
import { FindAllJobCandidaciesComponent } from './FrontOffice/pages/JobOffer/find-all-job-candidacies/find-all-job-candidacies.component';
import { ToastrModule } from 'ngx-toastr';
import { FindAllJobOffersBackComponent } from './BackOffice/Pages/JobOffer/find-all-job-offers-back/find-all-job-offers-back.component';
import { MatCardModule } from '@angular/material/card';
import { FindAllJobCandidaciesBackComponent } from './BackOffice/Pages/JobOffer/find-all-job-candidacies-back/find-all-job-candidacies-back.component';
import { StatisticsComponent } from './BackOffice/Pages/JobOffer/statistics/statistics.component';
import { StatisticsCandidaciesComponent } from './BackOffice/Pages/JobOffer/statistics-candidacies/statistics-candidacies.component';
import { StatisticsInterviewComponent } from './BackOffice/Pages/JobOffer/statistics-interview/statistics-interview.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import { QuizComponent } from "./FrontOffice/pages/Quiz/quiz/quiz.component";
import { InterviewCalendarComponent } from './FrontOffice/pages/Interview/interview-calendar/interview-calendar.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { InterviewDetailsComponent } from './FrontOffice/pages/Interview/interview-details/interview-details.component';
import { UpdateInterviewComponent } from './FrontOffice/pages/Interview/update-interview/update-interview.component';
import { InterviewDetailsBackComponent } from './BackOffice/Pages/JobOffer/interview-details-back/interview-details-back.component';
import { UpdateJobOfferComponent } from './FrontOffice/pages/JobOffer/update-job-offer/update-job-offer.component';

@NgModule({
  declarations: [
    AppComponent,
    AllTemplateFrontComponent,
    FooterFrontComponent,
    HeaderFrontComponent,
    HomeFrontComponent,
    FindAllJobOffersComponent,
    WishlistComponent,
    FilterJobPipe,
    SidebarBackComponent,
    NavbarBackComponent,
    FooterBackComponent,
    AllTemplatBackComponent,
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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    MatDialogModule,
    BrowserAnimationsModule,
    MatTableModule,
    FullCalendarModule,
    CommonModule,
    MatPaginatorModule,
    NgbModule,
    NgbModalModule,
    NgbDatepickerModule,
    MatButtonModule,
    MatInputModule,
    MatSidenavModule,
    MatToolbarModule,
    MatRippleModule,
    MatMenuModule,
    FeatherModule.pick(allIcons),
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut:2000,
      progressBar:true,
      progressAnimation:"increasing",
      preventDuplicates:true
    }), // ToastrModule added
    MatCardModule,
    NgxChartsModule,
    MatTooltipModule,
    FullCalendarModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,

    }),

  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }

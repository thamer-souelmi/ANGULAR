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

// Angular Material Modules
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// NG Bootstrap Module for Bootstrap components
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EventComponent } from './FrontOffice/pages/event/event.component';

// Other necessary imports (These need to be installed and imported correctly)
// import { NgxCaptchaModule } from 'ngx-captcha';
// import { FullCalendarModule } from '@fullcalendar/angular'; // Make sure to install the necessary packages

import { FindAllJobOffersComponent } from './FrontOffice/pages/JobOffer/find-all-job-offers/find-all-job-offers.component';
import { WishlistComponent } from './FrontOffice/pages/JobOffer/wishlist/wishlist.component';
import { FilterJobPipe } from './FrontOffice/pages/JobOffer/filter-job.pipe';
import { CommonModule, DatePipe } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatPaginatorModule } from '@angular/material/paginator';
import { FullCalendarModule } from '@fullcalendar/angular';
import { NgbDatepickerModule, NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatRippleModule } from "@angular/material/core";
import { MatMenuModule } from "@angular/material/menu";
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import {SidebarBackComponent} from "./BackOffice/sidebar-back/sidebar-back.component";
import {NavbarBackComponent} from "./BackOffice/navbar-back/navbar-back.component";
import {FooterBackComponent} from "./BackOffice/footer-back/footer-back.component";
import {AllTemplatBackComponent} from "./BackOffice/all-templat-back/all-templat-back.component";

@NgModule({
  declarations: [
    AppComponent,
    AllTemplateFrontComponent,
    FooterFrontComponent,
    HeaderFrontComponent,
    HomeFrontComponent,
    ActivityComponentF,
    EventComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FindAllJobOffersComponent,
    WishlistComponent,
    FilterJobPipe,
    SidebarBackComponent,
    NavbarBackComponent,
    FooterBackComponent,
    AllTemplatBackComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    // NgxCaptchaModule, // Uncomment after installing ngx-captcha and its types
    // FullCalendarModule, // Uncomment after installing @fullcalendar/angular and necessary plugins
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatIconModule,
    MatDialogModule,
    MatTableModule,
    MatButtonModule

  

    FullCalendarModule,
    CommonModule,
    NgbModalModule,
    NgbDatepickerModule,
    MatSidenavModule,
    MatToolbarModule,
    MatRippleModule,
    MatMenuModule,
    FeatherModule.pick(allIcons),
    BrowserAnimationsModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }

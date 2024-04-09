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
import { allIcons } from 'angular-feather/icons';
import {SidebarBackComponent} from "./BackOffice/sidebar-back/sidebar-back.component";
import {NavbarBackComponent} from "./BackOffice/navbar-back/navbar-back.component";
import {FooterBackComponent} from "./BackOffice/footer-back/footer-back.component";
import {AllTemplatBackComponent} from "./BackOffice/all-templat-back/all-templat-back.component";
import { FindAllJobCandidaciesComponent } from './FrontOffice/pages/JobOffer/find-all-job-candidacies/find-all-job-candidacies.component';
import { ToastrModule } from 'ngx-toastr';

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
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AllTemplateFrontComponent } from './FrontOffice/all-template-front/all-template-front.component';
import { FooterFrontComponent} from "./FrontOffice/footer-front/footer-front.component";
import { HeaderFrontComponent} from "./FrontOffice/header-front/header-front.component";
import { HomeFrontComponent } from './FrontOffice/home-front/home-front.component';
import { SidebarBackComponent } from './BackOffice/sidebar-back/sidebar-back.component';
import { NavbarBackComponent } from './BackOffice/navbar-back/navbar-back.component';
import { FooterBackComponent } from './BackOffice/footer-back/footer-back.component';
import { AllTemplatBackComponent } from './BackOffice/all-templat-back/all-templat-back.component';
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatInputModule} from "@angular/material/input";
import {MatRippleModule} from "@angular/material/core";
import {MatMenuModule} from "@angular/material/menu";
import {MatButtonModule} from "@angular/material/button";

import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { httpInterceptorProviders } from './Helpers/http-request-interceptor';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './BackOffice/Pages/login/login.component';
import { FindAllUsersComponent } from './BackOffice/Pages/find-all-users/find-all-users.component';

@NgModule({
  declarations: [
    AppComponent,
    AllTemplateFrontComponent,
    FooterFrontComponent,
    HeaderFrontComponent,
    HomeFrontComponent,
    SidebarBackComponent,
    NavbarBackComponent,
    FooterBackComponent,
    AllTemplatBackComponent,
    LoginComponent,
    FindAllUsersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatSidenavModule,
    MatToolbarModule,
    MatInputModule,
    MatRippleModule,
    MatMenuModule,
    MatButtonModule,
    FeatherModule.pick(allIcons),
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [httpInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }

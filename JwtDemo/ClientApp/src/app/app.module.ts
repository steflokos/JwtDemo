import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { AdminNavMenuComponent } from './components/nav-menus/admin-nav-menu/admin-nav-menu.component';
import { HomeComponent } from './components/landing-pages/home/home.component';


import { authInterceptorProviders } from './_helpers/auth.interceptor';
import { AuthGuard } from './_helpers/auth.guard';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { SignOutComponent } from './components/sign-out/sign-out.component';
import { AdminLandingPageComponent } from './components/landing-pages/admin-landing-page/admin-landing-page.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HasRoleDirective } from './directives/has-role.directive';

import { MaterialModule } from './modules/material.module';
import { VisitorNavMenuComponent } from './components/nav-menus/visitor-nav-menu/visitor-nav-menu.component';
import { UserNavMenuComponent } from './components/nav-menus/user-nav-menu/user-nav-menu.component';

import { DatePipe } from '@angular/common';

import { AdminSidenavComponent } from './components/sidenavs/admin-sidenav/admin-sidenav.component';
import { UserSidenavComponent } from './components/sidenavs/user-sidenav/user-sidenav.component';
import { VisitorSidenavComponent } from './components/sidenavs/visitor-sidenav/visitor-sidenav.component';
import { UserLandingPageComponent } from './components/landing-pages/user-landing-page/user-landing-page.component';
import { VisitorLandingPageComponent } from './components/landing-pages/visitor-landing-page/visitor-landing-page.component';
import { FetchDataComponent } from './components/fetch-data/fetch-data.component';



@NgModule({
  declarations: [
    AppComponent,
    AdminNavMenuComponent,
    HomeComponent,
    SignInComponent,
    SignUpComponent,
    SignOutComponent,
    AdminLandingPageComponent,
    HasRoleDirective,
    VisitorNavMenuComponent,
    UserNavMenuComponent,
    AdminSidenavComponent,
    UserSidenavComponent,
    VisitorSidenavComponent,
    UserLandingPageComponent,
    VisitorLandingPageComponent,
    FetchDataComponent

  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'sign-out', component: SignOutComponent, canActivate: [AuthGuard] },
      { path: 'sign-in', component: SignInComponent },
      { path: 'sign-up', component: SignUpComponent },
      { path: 'visitor', component: VisitorLandingPageComponent },
      { path: 'admin', component: AdminLandingPageComponent, canActivate: [AuthGuard] },
      { path: 'user', component: UserLandingPageComponent, canActivate: [AuthGuard] },
      { path: 'fetch-data', component: FetchDataComponent }
    ]),
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  providers: [authInterceptorProviders, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }


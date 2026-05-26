import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AppRoutingModule } from './app-routing-module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { App } from './app';

import { LoginComponent } from './components/auth/login/login.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { ForgetPasswordComponent } from './components/auth/forget-password/forget-password.component';
import { ResetPasswordComponent } from './components/auth/reset-password/reset-password.component';
import { authInterceptor } from './shared/interceptors/auth-interceptor';
import { HasRoleDirective } from './shared/directives/has-role.directive';
import { UnauthorizedComponent } from './components/auth/unauthorized/unauthorized.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LayoutComponent } from './components/layout/layout.component';
import { MyProfileComponent } from './components/user-profile/my-profile/my-profile.component';
import { RolesDashboardComponent } from './components/roles/roles-dashboard/roles-dashboard.component';
import { LogsDashboardComponent } from './components/audit-logs/logs-dashboard/logs-dashboard.component';
import { MyActivityComponent } from './components/audit-logs/my-activity/my-activity.component';

@NgModule({
  declarations: [
    App,
    LayoutComponent,
    LoginComponent,
    SignupComponent,
    ForgetPasswordComponent,
    ResetPasswordComponent,
    HasRoleDirective,
    UnauthorizedComponent,
    DashboardComponent,
    MyProfileComponent,
    RolesDashboardComponent,
    LogsDashboardComponent,
    MyActivityComponent
  ],
  imports: [BrowserModule, AppRoutingModule, ReactiveFormsModule, CommonModule, RouterModule, FormsModule],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptors([authInterceptor])),
  ],
  bootstrap: [App],
})
export class AppModule {}

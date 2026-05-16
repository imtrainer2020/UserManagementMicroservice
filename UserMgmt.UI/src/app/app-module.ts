import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AppRoutingModule } from './app-routing-module';
import { ReactiveFormsModule } from '@angular/forms';
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
import { UserDashboardComponent } from './components/dashboard/user-dashboard/user-dashboard.component';
import { LayoutComponent } from './components/layout/layout.component';
import { MyProfileComponent } from './components/user-profile/my-profile/my-profile.component';
import { RolesDashboardComponent } from './components/roles/roles-dashboard/roles-dashboard.component';
import { RoleService } from './services/roles/role.service';
import { UserProfileService } from './services/user-profile/user-profile.service';
import { LogsService } from './services/audit-logs/logs.service';
import { LogsDashboardComponent } from './components/audit-logs/logs-dashboard/logs-dashboard.component';

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
    UserDashboardComponent,
    MyProfileComponent,
    RolesDashboardComponent,
    RoleService,
    UserProfileService,
    LogsService,
    LogsDashboardComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, ReactiveFormsModule, CommonModule, RouterModule],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptors([authInterceptor])),
  ],
  bootstrap: [App],
})
export class AppModule {}

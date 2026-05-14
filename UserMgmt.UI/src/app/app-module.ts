import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AppRoutingModule } from './app-routing-module';
import { ReactiveFormsModule } from '@angular/forms';
import { App } from './app';

import { LoginComponent } from './components/auth/login/login.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { ForgetPasswordComponent } from './components/auth/forget-password/forget-password.component';
import { RolesComponent } from './components/roles/roles.component';
import { ResetPasswordComponent } from './components/auth/reset-password/reset-password.component';
import { authInterceptor } from './shared/interceptors/auth-interceptor';
import { HasRoleDirective } from './shared/directives/has-role.directive';

@NgModule({
  declarations: [
    App,
    LoginComponent,
    SignupComponent,
    ForgetPasswordComponent,
    RolesComponent,
    ResetPasswordComponent,
    HasRoleDirective,
  ],
  imports: [BrowserModule, AppRoutingModule, ReactiveFormsModule],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptors([authInterceptor])),
  ],
  bootstrap: [App],
})
export class AppModule {}

import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { LoginComponent } from './components/auth/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SignupComponent } from './components/auth/signup/signup.component';
import { ForgetPasswordComponent } from './components/auth/forget-password/forget-password.component';
import { provideHttpClient } from '@angular/common/http';
import { RolesComponent } from './components/roles/roles.component';

@NgModule({
  declarations: [App, LoginComponent, SignupComponent, ForgetPasswordComponent, RolesComponent],
  imports: [BrowserModule, AppRoutingModule, ReactiveFormsModule],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient()
  ],
  bootstrap: [App],
})
export class AppModule { }

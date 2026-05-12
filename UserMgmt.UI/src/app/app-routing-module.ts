import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './components/auth/signup/signup.component';
import { ForgetPasswordComponent } from './components/auth/forget-password/forget-password.component';
import { LoginComponent } from './components/auth/login/login.component';

import { RolesComponent } from './components/roles/roles.component';
const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent }, 
  { path: 'forgot-password', component: ForgetPasswordComponent },
  {path:'roles', component: RolesComponent},
  { path: '', redirectTo: '/login', pathMatch: 'full' } // Defaults to login page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

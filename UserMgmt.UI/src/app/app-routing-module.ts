import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './components/auth/signup/signup.component';
import { ForgetPasswordComponent } from './components/auth/forget-password/forget-password.component';
import { ResetPasswordComponent } from './components/auth/reset-password/reset-password.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RolesComponent } from './components/roles/roles.component';
import { authGuard } from './shared/guards/auth-guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'forgot-password', component: ForgetPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  {
    path: 'roles', component: RolesComponent,
    canActivate: [authGuard], // Protect this route with both authentication and role guards
    data: { roles: ['Admin', 'Manager'] } // Only Admins and Managers can access this route
  },

  { path: '', redirectTo: '/login', pathMatch: 'full' } // Defaults to login page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

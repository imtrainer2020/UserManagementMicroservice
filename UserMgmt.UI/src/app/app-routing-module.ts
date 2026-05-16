import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './components/auth/signup/signup.component';
import { ForgetPasswordComponent } from './components/auth/forget-password/forget-password.component';
import { ResetPasswordComponent } from './components/auth/reset-password/reset-password.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RolesComponent } from './components/roles/roles.component';
import { authGuard } from './shared/guards/auth-guard';
import { UnauthorizedComponent } from './components/auth/unauthorized/unauthorized.component';
import { UserDashboardComponent } from './components/dashboard/user-dashboard/user-dashboard.component';
import { LayoutComponent } from './components/layout/layout.component';

const routes: Routes = [
  // ─── Public routes (no shell/layout) ───
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'forgot-password', component: ForgetPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'unauthorized', component: UnauthorizedComponent },

  // ─── Protected routes (wrapped in layout shell) ───
  {
    path: '',
    component: LayoutComponent,       // <-- Shell wraps all authenticated pages
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        component: UserDashboardComponent,
        data: { roles: ['Admin', 'Manager', 'User'] }
      },
      {
        path: 'roles',
        component: RolesComponent,
        data: { roles: ['Admin', 'Manager'] }
      },
      // ← Add all future pages here as children
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

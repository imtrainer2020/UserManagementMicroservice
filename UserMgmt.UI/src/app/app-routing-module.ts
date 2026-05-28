import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './components/auth/signup/signup.component';
import { ForgetPasswordComponent } from './components/auth/forget-password/forget-password.component';
import { ResetPasswordComponent } from './components/auth/reset-password/reset-password.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RolesDashboardComponent } from './components/roles/roles-dashboard/roles-dashboard.component';
import { authGuard } from './shared/guards/auth-guard';
import { UnauthorizedComponent } from './components/auth/unauthorized/unauthorized.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LayoutComponent } from './components/layout/layout.component';
import { MyProfileComponent } from './components/user-profile/my-profile/my-profile.component';
import { LogsDashboardComponent } from './components/audit-logs/logs-dashboard/logs-dashboard.component';
import { MyActivityComponent } from './components/audit-logs/my-activity/my-activity.component';
import { UserDashboardComponent } from './components/users/user-dashboard/user-dashboard.component';
import { EditUserProfileComponent } from './components/user-profile/edit-user-profile/edit-user-profile.component';
import { CreateUserComponent } from './components/users/create-user/create-user.component';

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
        component: DashboardComponent,
        data: { roles: ['Admin', 'Manager', 'User'] }
      },
      {
        path: 'my-profile',
        component: MyProfileComponent,
        data: { roles: ['Admin', 'Manager', 'User'] }
      },
      {
        path: 'edit-user-profile/:id',
        component: EditUserProfileComponent,
        data: { roles: ['Admin', 'Manager'] }
      },
      {
        path: 'create-user',
        component: CreateUserComponent,
        data: { roles: ['Admin', 'Manager'] }
      },
      {
        path: 'roles',
        component: RolesDashboardComponent,
        data: { roles: ['Admin', 'Manager'] }
      },
      {
        path: 'logs-dashboard',
        component: LogsDashboardComponent,
        data: { roles: ['Admin', 'Manager', 'User'] }
      },
      {
        path: 'my-activity',
        component: MyActivityComponent,
        data: { roles: ['Admin', 'Manager', 'User'] }
      },
      {
        path: 'users',
        component: UserDashboardComponent,
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

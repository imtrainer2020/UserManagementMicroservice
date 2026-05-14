import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';
import { DashboardConfig } from '../../../models/dashboard.model';

@Component({
  selector: 'app-user-dashboard',
  standalone: false,
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.css',
})
export class UserDashboardComponent {
 
  userRole: string = '';
  userEmail: string = '';
  config!: DashboardConfig;
 
  // ✅ Central role config — add a new role here ONLY when roles grow.
  // No changes needed in routing, login, or template.
  private readonly roleConfig: Record<string, DashboardConfig> = {
    admin: {
      title: 'Admin Dashboard',
      greeting: 'Full system access.',
      badgeClass: 'bg-danger',
      widgets: [
        { label: 'User Management', icon: 'bi-people-fill',    route: '/users',    description: 'Create, update and manage all users' },
        { label: 'Role Management', icon: 'bi-shield-fill',    route: '/roles',    description: 'Assign and configure system roles' },
        { label: 'System Logs',     icon: 'bi-journal-text',   route: null,        description: 'View application activity logs' },
        { label: 'Audit Trails',    icon: 'bi-clock-history',  route: null,        description: 'Track all data change events' },
      ]
    },
    manager: {
      title: 'Manager Dashboard',
      greeting: 'Manage your team.',
      badgeClass: 'bg-warning text-dark',
      widgets: [
        { label: 'Team Overview',   icon: 'bi-people',         route: null,        description: 'View your team members and status' },
        { label: 'Role Management', icon: 'bi-shield-check',   route: '/roles',    description: 'Manage role assignments for your team' },
        { label: 'Reports',         icon: 'bi-bar-chart-fill', route: null,        description: 'View performance and activity reports' },
      ]
    },
    user: {
      title: 'User Dashboard',
      greeting: 'Welcome to your workspace.',
      badgeClass: 'bg-primary',
      widgets: [
        { label: 'My Profile',      icon: 'bi-person-circle',  route: null,        description: 'View and update your profile' },
        { label: 'My Activity',     icon: 'bi-activity',       route: null,        description: 'See your recent actions' },
      ]
    },
    // ➕ Future role example — just add this block:
    // auditor: {
    //   title: 'Auditor Dashboard',
    //   greeting: 'Review system activity.',
    //   badgeClass: 'bg-secondary',
    //   widgets: [
    //     { label: 'Audit Trails', icon: 'bi-clock-history', route: null, description: 'Full read access to all logs' },
    //   ]
    // },
  };
 
  constructor(private authService: AuthService, private router: Router) {}
 
  ngOnInit(): void {
    this.userRole  = this.authService.getUserRole()?.toLowerCase() ?? 'user';
    this.userEmail = localStorage.getItem('user_email') ?? '';
    this.config    = this.roleConfig[this.userRole] ?? {
      title: 'Dashboard',
      greeting: 'Welcome.',
      badgeClass: 'bg-secondary',
      widgets: []
    };
  }
 
  navigateTo(route: string | null): void {
    if (route) this.router.navigate([route]);
  }
 
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

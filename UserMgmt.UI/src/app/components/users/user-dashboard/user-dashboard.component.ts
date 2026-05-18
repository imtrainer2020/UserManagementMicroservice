import { Component, OnInit, computed } from '@angular/core';
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

  readonly userEmail = computed(() => this.authService.getUserEmail());
  readonly userRole = computed(() => this.authService.getUserRole());

  config!: DashboardConfig;
  today = new Date();

  // ✅ Central role config — add a new role here ONLY when roles grow.
  // No changes needed in routing, login, or template.
  private readonly roleConfig: Record<string, DashboardConfig> = {
    admin: {
      title: 'Admin Dashboard',
      greeting: 'Full system access.',
      badgeClass: 'badge-admin',
      widgets: [
        { label: 'User Management', icon: 'bi-people-fill', route: '/users', description: 'Create, update and manage all users' },
        { label: 'Role Management', icon: 'bi-shield-fill', route: '/roles-dashboard', description: 'Assign and configure system roles' },
        { label: 'System Settings', icon: 'bi-gear-fill', route: null, description: 'Configure application-level settings' },
      ]
    },
    manager: {
      title: 'Manager Dashboard',
      greeting: 'Manage your team.',
      badgeClass: 'badge-manager',
      widgets: [
        { label: 'Role Management', icon: 'bi-shield-check', route: '/roles-dashboard', description: 'Manage role assignments for your team' },
        { label: 'My Activity', icon: 'bi-activity', route: '/my-activity', description: 'See your recent actions' },
      ]
    },
    user: {
      title: 'User Dashboard',
      greeting: 'Welcome to your workspace.',
      badgeClass: 'bg-primary',
      widgets: [
        { label: 'My Profile', icon: 'bi-person-circle', route: null, description: 'View and update your profile' },
        { label: 'My Activity', icon: 'bi-activity', route: '/my-activity', description: 'See your recent actions' },
        { label: 'Notifications', icon: 'bi-bell-fill', route: null, description: 'See your notifications' },
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

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    // this.userRole = this.authService.getUserRole()?.toLowerCase() ?? 'user';
    // this.userEmail = this.authService.getUserEmail() ?? '';
    const role = this.userRole() || 'user';
    this.config = this.roleConfig[role] ?? {
      title: 'Dashboard',
      greeting: 'Welcome.',
      badgeClass: 'badge-secondary',
      widgets: [],
    };
  }

  /** Returns the display name (part before @) from the email. */
  getUserName(): string {
    return this.userEmail()?.split('@')[0] ?? 'User';
  }

  navigateTo(route: string | null): void {
    if (route) this.router.navigate([route]);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

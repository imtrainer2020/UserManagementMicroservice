import { Component, computed } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service'; // adjust path if needed

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  standalone: false,
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  readonly currentUser = computed(() => this.authService.userEmail() || '');
  readonly currentUserRole = computed(() => this.authService.userRole() || 'user');
  isSidebarCollapsed: boolean = false;
  constructor(private router: Router, private authService: AuthService) { }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  logout(): void {
    this.authService.logout(); // calls your existing logout logic
    this.router.navigate(['/login']);
  }
}

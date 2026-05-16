import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service'; // adjust path if needed

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  standalone: false,
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit {
  currentUser: string = '';
  currentUserRole: string = '';
  isSidebarCollapsed = false;
  constructor(private router: Router, private authService: AuthService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    // Pull from your existing auth service / localStorage
    const token = this.authService.getToken();
    if (token) {
      this.currentUser = this.authService.getUserEmail() ?? 'User';
      this.currentUserRole = this.authService.getUserRole() ?? '';
    }
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
    this.cdr.detectChanges();
  }

  logout(): void {
    this.authService.logout(); // calls your existing logout logic
    this.router.navigate(['/login']);
  }
}

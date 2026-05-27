import { Component, OnInit, computed, signal, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../services/users/user.service';
import { AuthService } from '../../../services/auth/auth.service';
import { UserProfileDto } from '../../../models/user-profile.model';
import { UserListDto, UserEditDto } from '../../../models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-dashboard',
  standalone: false,
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.css',
})
export class UserDashboardComponent implements OnInit {
  // State Signals
  users = signal<UserListDto[]>([]);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string>('');
  successMessage = signal<string>('');

  // Authorization Signals
  readonly currentUserRole = computed(() => this.authService.userRole());
  readonly currentUserId = computed(() => this.authService.userId());
  readonly isAuthorized = computed(() => ['admin', 'manager'].includes(this.currentUserRole().toLowerCase() || ''));

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    if (!this.isAuthorized()) {
      this.errorMessage.set('Access Denied. Only Admins and Managers can access this dashboard.');
      return;
    }
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.isLoading.set(true);
    this.userService.getAllUsers().subscribe({
      next: (res) => {
        if (res.isSuccess && res.data) this.users.set(res.data);
        this.isLoading.set(false);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage.set('Failed to load users.');
        this.isLoading.set(false);
        this.cdr.detectChanges();
      }
    });
  }

  // --- Navigation ---
  editUser(userId: number): void {
    if (userId !== this.currentUserId())
      this.router.navigate(['/edit-user-profile', userId]);
    else
      this.router.navigate(['/my-profile']);
  }

  // --- Business Logic Rules ---
  canDelete(user: UserListDto): boolean {
    if (user.id === this.currentUserId()) return false; // Admin cannot delete self
    if (this.currentUserRole().toLowerCase() === 'manager' && user.roleName.toLowerCase() === 'admin')
      return false; // Manager cannot delete Admin
    return true;
  }

  canEdit(user: UserListDto): boolean {
    if (user.id === this.currentUserId() && this.currentUserRole().toLowerCase() !== 'admin') return true; // can edit self
    if (this.currentUserRole().toLowerCase() === 'manager' && user.roleName.toLowerCase() === 'admin')
      return false; // Manager cannot edit Admin
    return true;
  }

  deleteUser(userId: number): void {
    if (!confirm(`Are you absolutely sure you want to delete? This action cannot be undone.`)) return;

    this.userService.deleteUserProfile(userId).subscribe({
      next: (res) => {
        if (res.isSuccess && res.data && res.data > 0) {
          this.successMessage.set('User-profile deleted successfully.');

          this.userService.deleteUser(userId).subscribe({
            next: (res1) => {
              if (res1.isSuccess) {
                this.successMessage.set('User deleted successfully.');
                this.fetchUsers(); // Refresh the list
              } else {
                this.errorMessage.set(res1.message || 'Failed to delete user.');
              }
            },
            error: (err) => this.errorMessage.set(err.error?.message || 'Error occurred during deletion.')
          });
          this.cdr.detectChanges();
        } else {
          this.errorMessage.set(res.message || 'Failed to delete user profile.');
        }
        this.cdr.detectChanges();
      },
      error: (err) => this.errorMessage.set(err.error?.message || 'Error occurred during deletion.')
    });
    this.cdr.detectChanges();
  }
}

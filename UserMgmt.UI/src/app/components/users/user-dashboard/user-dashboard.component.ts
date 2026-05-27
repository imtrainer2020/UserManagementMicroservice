import { Component, OnInit, computed, signal, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../services/users/user.service';
import { AuthService } from '../../../services/auth/auth.service';
import { UserProfileDto } from '../../../models/user-profile.model';
import { UserListDto, UserEditDto } from '../../../models/user.model';

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

  // Edit Modal State
  isEditModalOpen = signal<boolean>(false);
  isSaving = signal<boolean>(false);
  selectedUser = signal<UserListDto | null>(null);
  selectedProfileId = signal<number | null>(null); // To track if profile exists

  // Forms
  authForm: FormGroup;
  profileForm: FormGroup;

  // Authorization Signals
  readonly currentUserRole = computed(() => this.authService.userRole());
  readonly currentUserId = computed(() => this.authService.userId());
  readonly isAuthorized = computed(() => ['admin', 'manager'].includes(this.currentUserRole().toLowerCase() || ''));

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.authForm = this.fb.group({
      roleId: [2, Validators.required],
      isActive: [true, Validators.required]
    });

    this.profileForm = this.fb.group({
      fullname: ['', [Validators.required, Validators.minLength(3)]],
      phone: ['', [Validators.pattern(/^\d{10}$/)]],
      address: ['', [Validators.maxLength(500)]]
    });
  }

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

  // --- Business Logic Rules ---
  canDelete(targetUser: UserListDto): boolean {
    const myRole = this.currentUserRole();
    const myId = this.currentUserId();

    if (targetUser.id === myId) return false; // Rule 1: Admin/Manager cannot delete themselves
    if (myRole === 'Manager' && targetUser.roleName === 'Admin') return false; // Rule 2: Manager cannot delete Admin

    return true;
  }

  deleteUser(userId: number, userEmail: string): void {
    if (!confirm(`Are you absolutely sure you want to delete ${userEmail}? This action cannot be undone.`)) return;

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

  // --- Edit Logic ---
  openEditModal(user: UserListDto): void {
    this.errorMessage.set('');
    this.successMessage.set('');
    this.selectedUser.set(user);

    // Patch Auth Data
    this.authForm.patchValue({
      roleId: user.roleId,
      isActive: user.isActive
    });

    // Fetch Profile Data
    this.userService.getUserProfile(user.id).subscribe({
      next: (res) => {
        if (res.isSuccess && res.data && res.data.id > 0) {
          this.selectedProfileId.set(res.data.id);
          this.profileForm.patchValue({
            fullname: res.data.fullname ?? '',
            phone: res.data.phone ?? '',
            address: res.data.address ?? ''
          });
        } else {
          // No profile exists yet
          this.selectedProfileId.set(null);
          this.profileForm.reset({ fullname: '', phone: '', address: '' });
        }
        this.isEditModalOpen.set(true);
        this.cdr.detectChanges();
      },
      error: () => {
        // If profile fetch fails, still open modal but with empty profile form
        this.selectedProfileId.set(null);
        this.profileForm.reset({ fullname: '', phone: '', address: '' });
        this.isEditModalOpen.set(true);
        this.cdr.detectChanges();
      }
    });
  }

  closeModal(): void {
    this.isEditModalOpen.set(false);
    this.selectedUser.set(null);
  }

  saveChanges(): void {
    const user = this.selectedUser();
    if (!user) return;

    this.isSaving.set(true);

    // 1. Update Auth Data
    const authPayload = {
      id: user.id,
      email: user.email,
      roleId: Number(this.authForm.value.roleId),
      isActive: this.authForm.value.isActive === true || this.authForm.value.isActive === 'true'
    };

    this.userService.updateUserAuth(authPayload).subscribe({
      next: (authRes) => {
        if (!authRes.isSuccess) {
          this.errorMessage.set('Failed to update account settings.');
          this.isSaving.set(false);
          return;
        }

        // 2. Update Profile Data using FormData
        const formData = new FormData();
        if (this.selectedProfileId()) formData.append('id', this.selectedProfileId()!.toString());
        formData.append('userId', user.id.toString());

        if (this.profileForm.value.fullname) formData.append('fullname', this.profileForm.value.fullname);
        if (this.profileForm.value.phone) formData.append('phone', this.profileForm.value.phone);
        if (this.profileForm.value.address) formData.append('address', this.profileForm.value.address);

        this.userService.updateUserProfile(formData).subscribe({
          next: () => {
            this.successMessage.set('User account and profile updated successfully.');
            this.isSaving.set(false);
            this.closeModal();
            this.fetchUsers(); // Refresh grid
          },
          error: () => {
            this.errorMessage.set('Account updated, but profile update failed.');
            this.isSaving.set(false);
          }
        });
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Failed to update account settings.');
        this.isSaving.set(false);
        this.cdr.detectChanges();
      }
    });
  }
}

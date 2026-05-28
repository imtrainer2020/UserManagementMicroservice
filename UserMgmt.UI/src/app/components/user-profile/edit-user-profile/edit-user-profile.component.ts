import { Component, OnInit, computed, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../services/users/user.service';
import { AuthService } from '../../../services/auth/auth.service';
import { Common } from '../../../models/common.model';
import { forkJoin } from 'rxjs';
//import { UserPasswordChangeDto } from '../../../models/user-profile.model';
import { UserEditDto, UserRoleChangeDto } from '../../../models/user.model';

const DEFAULT_AVATAR =
  `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='150' height='150'
   viewBox='0 0 150 150'><rect width='150' height='150' fill='%23e5e7eb'/><circle cx='75'
   cy='58' r='28' fill='%239ca3af'/><ellipse cx='75' cy='130' rx='45' ry='32'
   fill='%239ca3af'/></svg>`;

@Component({
  selector: 'app-edit-user-profile',
  standalone: false,
  templateUrl: './edit-user-profile.component.html',
  styleUrl: './edit-user-profile.component.css',
})
export class EditUserProfileComponent implements OnInit {
  targetUserId: number = 0;
  targetUserEmail: string = '';

  profileId: number | null = null;
  createdAt: string = '';
  isExistingProfile: boolean = false;

  isLoading: boolean = false;
  isSaving: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  // Forms
  authForm: FormGroup;
  profileForm: FormGroup;
  passwordForm: FormGroup;

  // Photo Upload State
  selectedFile: File | null = null;
  localPreviewUrl: string | null = null;
  readonly defaultAvatar = DEFAULT_AVATAR;

  // Security Rules
  readonly currentUserRole = computed(() => this.authService.userRole());
  readonly isAdmin = computed(() => this.currentUserRole().toLowerCase() === 'admin');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
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
      fullname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(250)]],
      address: ['', [Validators.maxLength(500)]],
      phone: ['', [Validators.pattern(/^\d{10}$/)]],
      photoUrl: ['', [Validators.maxLength(500)]],
    });

    this.passwordForm = this.fb.group({
      newPassword: ['', [Validators.minLength(6)]] // Only validated if they type something
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) {
      this.router.navigate(['/users']);
      return;
    }
    this.targetUserId = Number(idParam);
    this.loadUserData();
  }

  loadUserData(): void {
    this.isLoading = true;

    // Fetch both datasets simultaneously
    forkJoin({
      users: this.userService.getAllUsers(),
      profile: this.userService.getUserProfile(this.targetUserId)
    }).subscribe({
      next: (res) => {
        // 1. Process Auth Data
        if (res.users.isSuccess && res.users.data) {
          const user = res.users.data.find(u => u.id === this.targetUserId);
          if (user) {
            this.targetUserEmail = user.email;
            this.createdAt = user.createdAt;
            this.authForm.patchValue({ roleId: user.roleId, isActive: user.isActive });
          }
        }

        // 2. Process Profile Data
        if (res.profile.isSuccess && res.profile.data && res.profile.data.id > 0) {
          const prof = res.profile.data;
          this.profileId = prof.id ?? null;
          this.isExistingProfile = true;
          this.profileForm.patchValue({
            fullname: prof.fullname ?? '',
            address: prof.address ?? '',
            phone: prof.phone ?? '',
            photoUrl: prof.photoUrl ?? ''
          });
        } else {
          this.isExistingProfile = false;
        }

        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Failed to load user data.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // --- Photo Logic (Identical to MyProfile) ---
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];

    if (!file.type.startsWith('image/')) { this.errorMessage = 'Only image files are allowed.'; return; }
    if (file.size > 2 * 1024 * 1024) { this.errorMessage = 'Image must be smaller than 2 MB.'; return; }

    this.errorMessage = '';
    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.localPreviewUrl = reader.result as string;
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);
  }

  removePhoto(): void {
    this.selectedFile = null;
    this.localPreviewUrl = null;
    this.profileForm.patchValue({ photoUrl: '' });
    this.cdr.detectChanges();
  }

  onImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    if (imgElement.src !== this.defaultAvatar) imgElement.src = this.defaultAvatar;
  }

  get photoPreview(): string {
    if (this.localPreviewUrl) return this.localPreviewUrl;
    let url = this.profileForm.get('photoUrl')?.value?.trim();
    if (url) {
      if (url.startsWith('/')) {
        try {
          const origin = new URL(new Common().API_BASE_URL).origin;
          url = origin + url;
        } catch (e) { url = 'http://localhost:5070' + url; }
      }
      return url;
    }
    return this.defaultAvatar;
  }

  get hasPhoto(): boolean { return !!(this.localPreviewUrl || this.profileForm.get('photoUrl')?.value?.trim()); }

  // --- Save Logic ---
  saveChanges(): void {
    if (this.authForm.invalid || this.profileForm.invalid) {
      this.errorMessage = 'Please fix the errors in the form.';
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';

    // Safely extract values
    const formRoleId = this.authForm.get('roleId')?.value;
    const formIsActive = this.authForm.get('isActive')?.value;

    // 1. Update Auth Settings
    const authPayload: UserEditDto = {
      id: this.targetUserId,
      userId: this.targetUserId,
      email: this.targetUserEmail,
      roleId: Number(formRoleId),
      password: '',
      isActive: formIsActive === true || formIsActive === 'true'
    };

    this.userService.updateUserAuth(authPayload).subscribe({
      next: (authRes) => {
        if (!authRes.isSuccess) {
          this.errorMessage = 'Failed to update account role/status.';
          this.isSaving = false;
          return;
        }

        // 2. Update Profile Settings via FormData
        const formData = new FormData();
        if (this.isExistingProfile && this.profileId) formData.append('id', this.profileId.toString());
        formData.append('userId', this.targetUserId.toString());

        if (this.profileForm.value.fullname) formData.append('fullname', this.profileForm.value.fullname);
        if (this.profileForm.value.address) formData.append('address', this.profileForm.value.address);
        if (this.profileForm.value.phone) formData.append('phone', this.profileForm.value.phone);
        if (this.profileForm.value.photoUrl) formData.append('photoUrl', this.profileForm.value.photoUrl);
        if (this.selectedFile) formData.append('file', this.selectedFile, this.selectedFile.name);

        this.userService.updateUserProfile(formData).subscribe({
          next: () => {
            // 3. Update Password (If Admin & Filled)
            const newPass = this.passwordForm.value.newPassword;
            if (this.isAdmin() && newPass && newPass.length >= 6) {
              const passPayload = { userId: this.targetUserId, newPassword: newPass };

              this.userService.adminResetUserPassword(passPayload).subscribe((result) => {
                if (result.isSuccess && result.data != null && result.data > 0)
                  this.router.navigate(['/users']);
                else
                  this.errorMessage = result.message;
              });
            } else {
              this.router.navigate(['/users']);
            }
          },
          error: () => {
            this.errorMessage = 'Account updated, but profile update failed.';
            this.isSaving = false;
          }
        });
      },
      error: (err) => {
        const backendError = err.error?.title || err.error?.message || 'Network error while updating account.';
        this.errorMessage = `Error 400: ${backendError}. Check console for details.`;
        this.isSaving = false;
        console.error('Validation Errors:', err.error?.errors); // This prints the exact mismatch to the console!
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/users']);
  }

  get displayName(): string {
    const name = this.profileForm.get('fullname')?.value?.trim();
    if (name) return name;
    return this.targetUserEmail ? this.targetUserEmail.split('@')[0] : 'User';
  }

}

import { Component, OnInit, computed, ChangeDetectorRef, effect } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { UserProfileService } from '../../../services/user-profile/user-profile.service';
import { ApiResponse } from '../../../shared/apiresponse.model';
import { UserProfileDto } from '../../../models/user-profile.model';

// ADD THIS IMPORT to get your base URL
import { Common } from '../../../models/common.model';

const DEFAULT_AVATAR =
  `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='150' height='150'
   viewBox='0 0 150 150'><rect width='150' height='150' fill='%23e5e7eb'/><circle cx='75'
   cy='58' r='28' fill='%239ca3af'/><ellipse cx='75' cy='130' rx='45' ry='32'
   fill='%239ca3af'/></svg>`;

@Component({
  selector: 'app-my-profile',
  standalone: false,
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.css',
})
export class MyProfileComponent implements OnInit {

  readonly currentUserId = computed(() => this.authService.userId());
  readonly currentUserEmail = computed(() => this.authService.userEmail());
  readonly currentUserRole = computed(() => this.authService.userRole());

  profileForm: FormGroup;
  profileId: number | null = null;
  createdAt: string = '';

  isLoading: boolean = false;
  isSaving: boolean = false;
  isEditMode: boolean = false;
  isExistingProfile: boolean = false;

  successMessage: string = '';
  errorMessage: string = '';

  selectedFile: File | null = null;
  localPreviewUrl: string | null = null;
  readonly defaultAvatar = DEFAULT_AVATAR;

  constructor(
    private profileService: UserProfileService,
    private authService: AuthService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.profileForm = this.fb.group({
      fullname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(250)]],
      address: ['', [Validators.maxLength(500)]],
      phone: ['', [Validators.pattern(/^\d{10}$/)]],
      photoUrl: ['', [Validators.maxLength(500)]],
    });

    effect(() => {
      this.successMessage = '';
      this.errorMessage = '';
      const userId = this.currentUserId();
      if (userId && userId > 0) {
        this.loadUserProfile(userId);
      } else {
        this.errorMessage = 'Unable to identify current user.';
      }
      this.cdr.detectChanges();
    });

  }

  ngOnInit(): void {
    
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];

    if (!file.type.startsWith('image/')) {
      this.errorMessage = 'Only image files are allowed.';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      this.errorMessage = 'Image must be smaller than 2 MB.';
      return;
    }

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

  // --- NEW: Safe Error Handler ---
  // This replaces the aggressive (error)="removePhoto()" in HTML
  onImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    // Prevent infinite loop if default avatar also fails
    if (imgElement.src !== this.defaultAvatar) {
      imgElement.src = this.defaultAvatar;
    }
  }

  // --- UPDATED: Smart URL Builder ---
  get photoPreview(): string {
    if (this.localPreviewUrl) return this.localPreviewUrl;

    let url = this.profileForm.get('photoUrl')?.value?.trim();

    if (url) {
      // If the backend returns a relative path like "/uploads/xxx.jpg"
      if (url.startsWith('/')) {
        try {
          // Grab the API URL and extract just the domain (e.g., https://...-5070.app.github.dev)
          const apiBaseUrl = new Common().API_BASE_URL;
          const origin = new URL(apiBaseUrl).origin;
          url = origin + url;
        } catch (e) {
          // Fallback if URL parsing fails
          url = 'http://localhost:5070' + url;
        }
      }
      return url;
    }

    return this.defaultAvatar;
  }

  get hasPhoto(): boolean {
    return !!(this.localPreviewUrl || this.profileForm.get('photoUrl')?.value?.trim());
  }

  loadUserProfile(userId: number): void {
    this.isLoading = true;
    this.errorMessage = this.successMessage = '';

    this.profileService.getMyProfile(userId).subscribe({
      next: (response: ApiResponse<UserProfileDto>) => {
        this.isLoading = false;

        if (response.isSuccess && response.data && response.data.id > 0) {
          const profile = response.data;
          this.profileId = profile.id ?? null;
          this.createdAt = profile.createdAt ?? '';
          this.isExistingProfile = true;
          this.isEditMode = false;
          this.localPreviewUrl = null;
          this.selectedFile = null;

          this.profileForm.patchValue({
            fullname: profile.fullname ?? '',
            address: profile.address ?? '',
            phone: profile.phone ?? '',
            photoUrl: profile.photoUrl ?? ''
          });
        } else {
          this.profileId = null;
          this.createdAt = '';
          this.isExistingProfile = false;
          this.isEditMode = true;
          this.profileForm.patchValue({ fullname: '', address: '', phone: '', photoUrl: '' });
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Failed to load user profile.';
        this.cdr.detectChanges();
      }
    });
  }

  startEdit(): void {
    this.errorMessage = this.successMessage = '';
    this.isEditMode = true;
  }

  cancelEdit(): void {
    this.errorMessage = this.successMessage = '';
    this.selectedFile = null;
    this.localPreviewUrl = null;
    this.isEditMode = false;

    const userId = this.currentUserId();
    if (!userId || userId <= 0) {
      this.errorMessage = 'Unable to identify current user.';
      this.cdr.detectChanges();
      return;
    }
    if (this.isExistingProfile) {
      this.loadUserProfile(userId);
    } else {
      this.profileForm.reset({ fullname: '', address: '', phone: '', photoUrl: '' });
      this.isEditMode = true;
    }
  }

  saveProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      this.cdr.detectChanges();
      return;
    }

    const userId = this.currentUserId();
    if (!userId || userId <= 0) {
      this.errorMessage = 'Unable to identify current user.';
      this.cdr.detectChanges();
      return;
    }

    this.persistProfile(userId);
  }

  private persistProfile(userId: number): void {
    this.isSaving = true;
    this.errorMessage = this.successMessage = '';

    const formData = new FormData();

    if (this.isExistingProfile && this.profileId) {
      formData.append('id', this.profileId.toString());
    }
    formData.append('userId', userId.toString());

    const fullname = this.profileForm.get('fullname')?.value?.trim();
    if (fullname) formData.append('fullname', fullname);

    const address = this.profileForm.get('address')?.value?.trim();
    if (address) formData.append('address', address);

    const phone = this.profileForm.get('phone')?.value?.trim();
    if (phone) formData.append('phone', phone);

    const photoUrl = this.profileForm.get('photoUrl')?.value?.trim();
    if (photoUrl) formData.append('photoUrl', photoUrl);

    if (this.selectedFile) {
      formData.append('file', this.selectedFile, this.selectedFile.name);
    }

    const request$ = this.isExistingProfile
      ? this.profileService.updateMyProfile(formData)
      : this.profileService.createMyProfile(formData);

    request$.subscribe({
      next: (response) => {
        this.isSaving = false;
        if (response.isSuccess && response.data && response.data > 0) {
          this.successMessage = 'Profile saved successfully.';
          this.loadUserProfile(userId);
        } else {
          this.errorMessage = response.message || 'Failed to save profile.';
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isSaving = false;
        this.errorMessage = err.error?.message || 'Failed to save profile.';
        this.cdr.detectChanges();
      }
    });
  }

  get displayName(): string {
    const name = this.profileForm.get('fullname')?.value?.trim();
    if (name) return name;
    const email = this.currentUserEmail();
    return email ? email.split('@')[0] : 'User';
  }

  get f() { return this.profileForm.controls; }
}

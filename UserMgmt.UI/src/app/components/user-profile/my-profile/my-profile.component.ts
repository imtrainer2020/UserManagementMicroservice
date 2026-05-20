import { ApplicationInitStatus, Component, OnInit, computed } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { UserProfileService } from '../../../services/user-profile/user-profile.service';
import { ApiResponse } from '../../../shared/apiresponse.model';
import {
  UserPasswordChangeDto, UserProfileDto,
  UserProfileCreateDto, UserProfileUpdateDto
} from '../../../models/user-profile.model';

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

  constructor(
    private profileService: UserProfileService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.profileForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(250)]],
      address: ['', [Validators.maxLength(500)]],
      phone: ['', [, Validators.pattern(/^\d{10}$/)]],
      photoUrl: ['', [Validators.maxLength(500)]],
    });
  }

  ngOnInit(): void {
    const userId = this.currentUserId();

    if (!userId || userId <= 0) {
      this.errorMessage = 'Unable to identify current user.';
      return;
    }
    this.loadUserProfile(userId);
  }

  loadUserProfile(userId: number): void {
    this.isLoading = true;
    this.errorMessage = this.successMessage = '';

    this.profileService.getMyProfile(userId).subscribe({
      next: (response: ApiResponse<UserProfileDto>) => {
        this.isLoading = false;
        console.log(response);
        if (response.isSuccess && response.data && response.data.id > 0) {
          console.log("update: " + response);
          const profile = response.data;

          this.profileId = profile.id ?? null;
          this.createdAt = profile.createdAt ?? '';
          this.isExistingProfile = true;
          this.isEditMode = false;

          this.profileForm.patchValue({
            fullName: profile.fullname ?? '',
            address: profile.address ?? '',
            phone: profile.phone ?? '',
            photoUrl: profile.photoUrl ?? ''
          });
        } else {
          console.log("create: " + response);
          // No profile found - treat as new profile creation
          this.profileId = null;
          this.createdAt = '';
          this.isExistingProfile = false;
          this.isEditMode = true;

          this.profileForm.patchValue({
            fullName: '',
            address: '',
            phone: '',
            photoUrl: ''
          });
        }
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to load user profile.';
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  startEdit(): void {
    this.errorMessage = this.successMessage = '';
    this.isEditMode = true;
  }

  cancelEdit(): void {
    this.errorMessage = this.successMessage = '';
    this.isEditMode = false;

    const userId = this.currentUserId();

    if (!userId || userId <= 0) {
      this.errorMessage = 'Unable to identify current user.';
      return;
    }

    if (this.isExistingProfile) {
      this.loadUserProfile(userId);
    } else {
      this.profileForm.reset({
        fullName: '',
        address: '',
        phone: '',
        photoUrl: ''
      });
      this.isEditMode = true;
    }

  }

  saveProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const userId = this.currentUserId();
    if (!userId || userId <= 0) {
      this.errorMessage = 'Unable to identify current user.';
      return;
    }

    this.isSaving = true;
    this.errorMessage = this.successMessage = '';

    const request$ = this.isExistingProfile
      ? this.profileService.updateMyProfile(this.buildUpdateProfilePayload(userId))
      : this.profileService.createMyProfile(this.buildCreateProfilePayload(userId));

    request$.subscribe({
      next: (response) => {
        this.isSaving = false;

        if (response.isSuccess && response.data && response.data > 0) {
          this.successMessage = 'Profile saved successfully.';
          this.loadUserProfile(userId);
        } else {
          this.errorMessage = response.message || 'Failed to save profile.';
        }
      },
      error: (err) => {
        this.isSaving = false;
        this.errorMessage = err.error?.message || 'Failed to save profile.';
      }
    });

  }

  private buildCreateProfilePayload(userId: number): UserProfileCreateDto {
    return {
      userId,
      fullname: this.normalizeText(this.profileForm.get('fullName')?.value),
      address: this.normalizeText(this.profileForm.get('address')?.value),
      phone: this.normalizeText(this.profileForm.get('phone')?.value),
      photoUrl: this.normalizeText(this.profileForm.get('photoUrl')?.value)
    } as UserProfileCreateDto;
  }

  private buildUpdateProfilePayload(userId: number): UserProfileUpdateDto {
    return {
      id: this.profileId ?? 0,
      userId,
      fullname: this.normalizeText(this.profileForm.get('fullName')?.value),
      address: this.normalizeText(this.profileForm.get('address')?.value),
      phone: this.normalizeText(this.profileForm.get('phone')?.value),
      photoUrl: this.normalizeText(this.profileForm.get('photoUrl')?.value)
    } as UserProfileUpdateDto;
  }

  private normalizeText(value: string | null | undefined): string | null {
    if (value === null || value === undefined) return null;
    const trimmed = String(value).trim();
    return trimmed.length ? trimmed : null;
  }

  get photoPreview(): string {
    const url = this.profileForm.get('photoUrl')?.value?.trim();
    return url || 'https://via.placeholder.com/150';
  }

  get displayName(): string {
    const name = this.profileForm.get('fullName')?.value?.trim();
    if (name) return name;
    const email = this.currentUserEmail();
    return email ? email.split('@')[0] : 'User';
  }

  get f() {
    return this.profileForm.controls;
  }

}

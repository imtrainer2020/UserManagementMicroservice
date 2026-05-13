import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { ApiResponse } from '../../../shared/apiresponse.model';
import { ResetPasswordRequest } from '../../../models/authdto.model';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
  standalone: false
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  emailFromRoute: string = '';
  isSubmitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
    // Custom cross-field validation for password matching
    this.resetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    // Grab the email passed from the Forget Password component
    this.emailFromRoute = this.route.snapshot.queryParams['email'] ?? '';
    if (this.emailFromRoute) {
      this.resetPasswordForm.patchValue({ email: this.emailFromRoute });
    }
  }

  // Cross-field validator: password === confirmPassword
  passwordMatchValidator(group: AbstractControl): { [key: string]: boolean } | null {
    const pw = group.get('newPassword')?.value;
    const cpw = group.get('confirmPassword')?.value;
    return pw === cpw ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    // 1. Validate
    if (this.resetPasswordForm.invalid) {
      this.resetPasswordForm.markAllAsTouched();
      return;
    }

    // 2. Clear messages and start spinner
    this.errorMessage = '';
    this.successMessage = '';
    this.isSubmitting = true;

    const payload: ResetPasswordRequest = {
      email: this.resetPasswordForm.value.email,
      newPassword: this.resetPasswordForm.value.newPassword
    };

    // 3. Make the API call
    this.authService.resetPassword(payload).subscribe({
      next: (response: ApiResponse<number>) => {
        // Stop the spinner instantly
        console.log(response);
        if (response.isSuccess) {
          this.successMessage = 'Password reset successfully. Redirecting to login...';
          this.isSubmitting = false;
          this.cdr.detectChanges();
          setTimeout(() => this.router.navigate(['/login']), 1500);
        } else {
          this.errorMessage = response?.message || 'Failed to reset password.';
          this.isSubmitting = false;
          this.cdr.detectChanges();
        }
      },
      error: (err: any) => {
        // Stop the spinner if the server crashes
        console.error("API Error details:", err);
        this.errorMessage = err.error.message || 'Unable to connect to the server';
        this.isSubmitting = false;
        this.cdr.detectChanges();
      }
    });

  }

}

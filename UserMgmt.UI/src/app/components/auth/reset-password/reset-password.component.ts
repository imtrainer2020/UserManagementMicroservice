import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { ApiResponse } from '../../../shared/apiresponse.model';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
  standalone: false
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  isSubmitting = false;
  errorMessage: string = '';
  successMessage: string = '';
  emailFromRoute: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
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

    const payload = {
      email: this.resetPasswordForm.value.email,
      newPassword: this.resetPasswordForm.value.newPassword
    };

    // 3. Make the API call
    this.authService.resetPassword(payload).subscribe({
      next: (response: ApiResponse<number>) => {
        // Stop the spinner instantly
        this.isSubmitting = false;

        if (response.isSuccess && response.data && response.data > 0) {
          this.successMessage = 'Password reset successfully. Redirecting to login...';
          setTimeout(() => this.router.navigate(['/login']), 1500);
        } else {
          this.errorMessage = response?.message || 'Failed to reset password.';
        }
      },
      error: (err: any) => {
        // Stop the spinner if the server crashes
        this.isSubmitting = false;
        console.error("API Error details:", err);
        this.errorMessage = 'Unable to connect to the server. Is your .NET backend running?';
      }
    });

  }

}

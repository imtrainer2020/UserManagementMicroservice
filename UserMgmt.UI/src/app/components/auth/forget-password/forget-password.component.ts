import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { ApiResponse } from '../../../shared/apiresponse.model';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css'],
  standalone: false
})
export class ForgetPasswordComponent {
  forgetPasswordForm: FormGroup;
  isSubmitting = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.forgetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    // 1. Check if form is valid before doing anything
    if (this.forgetPasswordForm.invalid) {
      this.forgetPasswordForm.markAllAsTouched();
      return;
    }

    // 2. Clear old messages and start spinner
    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const email: string = this.forgetPasswordForm.value.email;

    // 3. Make the API Call
    this.authService.forgetPassword(email).subscribe({
      next: (response: ApiResponse<boolean>) => {
        // Stop the spinner instantly
        this.isSubmitting = false;

        if (response.isSuccess && response.data === true) {
          this.successMessage = response.message; // "Email exists."

          // Navigate to reset-password, carry email as query param
          this.router.navigate(['/reset-password'], {
            queryParams: { email }
          });
        } else {
          this.errorMessage = response.message || 'No account found with this email.';
        }
      },
      error: (err) => {
        // Stop the spinner if the server crashes or isn't running
        this.isSubmitting = false;
        console.error("API Error details:", err);
        this.errorMessage = err.error?.message || 'Something went wrong. Please try again.';
      }
    });
  }

}

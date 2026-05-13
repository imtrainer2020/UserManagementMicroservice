import { Component, ChangeDetectorRef } from '@angular/core';
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
  errorMessage: string = '';
  successMessage: string = '';
  isSubmitting: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService,
    private router: Router, private cdr: ChangeDetectorRef) {
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
    this.errorMessage = '';
    this.successMessage = '';
    this.isSubmitting = true;

    const email: string = this.forgetPasswordForm.value.email;

    // 3. Make the API Call
    this.authService.forgetPassword(email).subscribe({
      next: (response: ApiResponse<boolean>) => {
        // Stop the spinner instantly
        this.isSubmitting = false;
        console.log(response);
        if (response.isSuccess && response.data === true) {
          this.successMessage = 'Redirecting to Reset'; // "Email exists."
          this.cdr.detectChanges();

          // Navigate to reset-password, carry email as query param
          setTimeout(() => {
            this.router.navigate(['/reset-password'], {
              queryParams: { email }
            })
          }, 1500);
        } else {
          this.errorMessage = response.message || 'No account found with this email.';
          this.isSubmitting = false;
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        // Stop the spinner if the server crashes or isn't running
        console.error("API Error details:", err);
        this.errorMessage = err.error?.message || 'Something went wrong. Please try again.';
        this.isSubmitting = false;
        this.cdr.detectChanges();
      }
    });
  }

}

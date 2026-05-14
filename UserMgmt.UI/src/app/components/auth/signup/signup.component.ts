import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { ApiResponse } from '../../../shared/apiresponse.model';
import { SignupRequest } from '../../../models/authdto.model';


@Component({
  selector: 'app-signup',
  standalone: false,
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  signupForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  isSubmitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
    // Custom cross-field validation for password matching
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(group: AbstractControl): { [key: string]: boolean } | null {
    const pw = group.get('password')?.value;
    const cpw = group.get('confirmPassword')?.value;
    return pw === cpw ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    // 1. Validate
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    // 2. Clear messages and start spinner
    this.errorMessage = '';
    this.successMessage = '';
    this.isSubmitting = true;

    const payload: SignupRequest = {
      email: this.signupForm.value.email,
      password: this.signupForm.value.password
    };

    // 3. Make the API call
    this.authService.signup(payload).subscribe({
      next: (response: ApiResponse<number>) => {
        // Stop the spinner instantly
        if (response.isSuccess) {
          this.successMessage = 'User Created successfully. Redirecting to login...';
          this.isSubmitting = false;
          this.cdr.detectChanges();
          setTimeout(() => this.router.navigate(['/login']), 1500);
        } else {
          this.errorMessage = response?.message || 'Failed to create user.';
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

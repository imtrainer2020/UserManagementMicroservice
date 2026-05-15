import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';
import { ApiResponse } from '../../../shared/apiresponse.model';
import { LoginRequest, LoggedUserDto } from '../../../models/authdto.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: false
})
export class LoginComponent {
  loginForm: FormGroup;
  isSubmitting = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Extract login data from the form
    const loginData: LoginRequest = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    // Call the AuthService to perform login
    this.authService.login(loginData).subscribe({
      next: (response: ApiResponse<LoggedUserDto>) => {
        this.isSubmitting = false;

        // Handle successful login (e.g., store token, redirect)
        if (response != null && response.data != null && response.isSuccess) {
          // save token and user info to local storage
          this.authService.saveToken(response.data);

          this.successMessage = response.message;

          // Redirect based on user role
          this.router.navigate(['dashboard']);
        }

      },
      error: (err: any) => {
        this.isSubmitting = false;
        this.errorMessage = err.error?.message || 'Invalid email or password.';
        // Handle login error
      }
    });
  }

}

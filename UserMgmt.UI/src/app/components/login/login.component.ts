import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: false
})
export class LoginComponent {
  loginForm: FormGroup;
  isSubmitting = false;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isSubmitting = true;
      
      const loginData = this.loginForm.value;
      console.log('Login Details:', loginData);
      
      // We will connect this to your Auth Microservice later
      
      setTimeout(() => this.isSubmitting = false, 1000); 
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
import { Component, OnInit, computed, signal, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../services/users/user.service';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-create-user',
  standalone: false,
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.css',
})
export class CreateUserComponent {
  createForm: FormGroup;

  isLoading = signal<boolean>(false);
  errorMessage = signal<string>('');
  successMessage = signal<string>('');

  // Security Rules
  readonly currentUserRole = computed(() => this.authService.userRole());
  readonly isAdmin = computed(() => this.currentUserRole().toLowerCase() === 'admin');

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.createForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      roleId: [2, [Validators.required]] // Defaults to Standard User (ID: 2)
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    const role = this.currentUserRole().toLowerCase();
    if (role !== 'admin' && role !== 'manager') {
      this.router.navigate(['/unauthorized']);
    }
  }

  passwordMatchValidator(control: AbstractControl) {
    const pass = control.get('password')?.value;
    const confirm = control.get('confirmPassword')?.value;
    return pass === confirm ? null : { mismatch: true };
  }

  cancel(): void {
    this.router.navigate(['/users']);
  }

  onSubmit(): void {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const payload = {
      email: this.createForm.value.email,
      password: this.createForm.value.password,
      roleId: Number(this.createForm.value.roleId)
    };

    this.userService.createUser(payload).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.successMessage.set('User created successfully!');
          setTimeout(() => {
            this.cancel();
          }, 1500);
        } else {
          this.errorMessage.set(res.message || 'Failed to create user.');
          this.isLoading.set(false);
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        const backendError = err.error?.title || err.error?.message || 'Error creating user. Check payload validation.';
        this.errorMessage.set(`Error: ${backendError}`);
        this.isLoading.set(false);
        this.cdr.detectChanges();
      }
    });
  }

}

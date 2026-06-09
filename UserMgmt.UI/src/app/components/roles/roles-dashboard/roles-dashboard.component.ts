import { Component, OnInit, computed, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RoleService } from '../../../services/roles/role.service';
import { AuthService } from '../../../services/auth/auth.service';
import { RoleDto, ManageRolesDto } from '../../../models/roles.model';

@Component({
  selector: 'app-roles-dashboard',
  standalone: false,
  templateUrl: './roles-dashboard.component.html',
  styleUrl: './roles-dashboard.component.css',
})
export class RolesDashboardComponent {
  roles = signal<RoleDto[]>([]);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string>('');
  successMessage = signal<string>('');

  // Modal State
  isModalOpen = signal<boolean>(false);
  isSaving = signal<boolean>(false);
  editingRoleId = signal<number | null>(null); // Null means 'Create Mode'

  roleForm: FormGroup;

  // Authorization (Only Admins manage roles)
  readonly isAdmin = computed(() => this.authService.userRole().toLowerCase() === 'admin');

  constructor(
    private roleService: RoleService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.roleForm = this.fb.group({
      roleName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]]
    });
  }

  ngOnInit(): void {
    if (!this.isAdmin()) {
      this.errorMessage.set('Access Denied. Only Administrators can manage system roles.');
      return;
    }
    this.fetchRoles();
  }

  fetchRoles(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.roleService.getAllRoles().subscribe({
      next: (res) => {
        if (res.isSuccess && res.data) {
          this.roles.set(res.data);
        } else {
          this.errorMessage.set(res.message || 'Failed to load roles.');
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Network error while loading roles.');
        this.isLoading.set(false);
      }
    });
  }

  isSystemRole(roleId: number): boolean {
    // Prevent modifying or deleting the 3 core architecture roles
    return [1, 2, 3].includes(roleId);
  }

  saveRole(): void {
    if (this.roleForm.invalid) {
      this.roleForm.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    const roleName = this.roleForm.value.roleName.trim();
    const currentId = this.editingRoleId();

    const request$ = currentId
      ? this.roleService.updateRole({ id: currentId, roleName: roleName })
      : this.roleService.createRole({ roleName: roleName });

    request$.subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.successMessage.set(`Role successfully ${currentId ? 'updated' : 'created'}.`);
          this.closeModal();
          this.fetchRoles();
        } else {
          this.errorMessage.set(res.message || 'Operation failed.');
        }
        this.isSaving.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'A network error occurred.');
        this.isSaving.set(false);
      }
    });
  }

  deleteRole(role: RoleDto): void {
    if (this.isSystemRole(role.id)) {
      alert('System roles cannot be deleted.');
      return;
    }

    if (!confirm(`Are you sure you want to delete the role "${role.roleName}"? Users assigned to this role may lose access.`)) return;

    this.roleService.deleteRole(role.id).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.successMessage.set('Role deleted successfully.');
          this.fetchRoles();
        } else {
          this.errorMessage.set(res.message || 'Failed to delete role.');
        }
      },
      error: (err) => this.errorMessage.set(err.error?.message || 'Error occurred during deletion.')
    });
  }

  openModal(role?: RoleDto): void {
    this.errorMessage.set('');
    this.successMessage.set('');

    if (role) {
      this.editingRoleId.set(role.id);
      this.roleForm.patchValue({ roleName: role.roleName });
    } else {
      this.editingRoleId.set(null);
      this.roleForm.reset();
    }
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.editingRoleId.set(null);
    this.roleForm.reset();
  }

}

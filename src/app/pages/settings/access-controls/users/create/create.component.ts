import { Component, inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialImports, MaterialProviders } from '../../../../../shared/material-imports';
import { NavigationService } from '../../../../../services/navigation.service';
import { users } from '../../../../../data/access-control/users.data';
import type { AccessControlPermission, AccessControlUser, UserRole, UserStatus } from '../../../../../models/access-control/user.model';

type PermissionControls = {
  view: FormControl<boolean>;
  create: FormControl<boolean>;
  edit: FormControl<boolean>;
  delete: FormControl<boolean>;
};

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [...MaterialImports, ReactiveFormsModule],
  providers: [...MaterialProviders],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss',
})
export class CreateComponent {
  private readonly navigation = inject(NavigationService);

  readonly permissionModules = [
    { key: 'dashboard', label: 'Dashboard', group: 'General' },
    { key: 'employees', label: 'Employees', group: 'Workforce' },
    { key: 'departments', label: 'Departments', group: 'Workforce' },
    { key: 'positions', label: 'Positions', group: 'Workforce' },
    { key: 'workLocations', label: 'Work locations', group: 'Workforce' },
    { key: 'attendance', label: 'Attendance', group: 'Time & Leave' },
    { key: 'leave', label: 'Leave', group: 'Time & Leave' },
    { key: 'overtime', label: 'Overtime', group: 'Time & Leave' },
    { key: 'payroll', label: 'Payroll', group: 'Payroll' },
    { key: 'payslips', label: 'Payslips', group: 'Payroll' },
    { key: 'employeeExpenses', label: 'Employee expenses', group: 'Payroll' },
    { key: 'commissions', label: 'Commission & incentives', group: 'Payroll' },
    { key: 'companySettings', label: 'Company and system settings', group: 'Settings' },
    { key: 'accessControl', label: 'Users and access control', group: 'Settings' },
  ] as const;

  readonly permissionGroups = [...new Set(this.permissionModules.map(module => module.group))].map(group => ({
    label: group,
    modules: this.permissionModules
      .map((module, index) => ({ module, index }))
      .filter(item => item.module.group === group)
  }));

  readonly roles: UserRole[] = ['Administrator', 'HR Manager', 'Payroll Manager', 'Manager', 'Employee'];

  readonly userForm = new FormGroup({
    fullName: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(100)] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email, Validators.maxLength(150)] }),
    role: new FormControl<UserRole>('Employee', { nonNullable: true, validators: [Validators.required] }),
    status: new FormControl<UserStatus>('ACTIVE', { nonNullable: true }),
    permissions: new FormArray<FormGroup<PermissionControls>>(
      this.permissionModules.map(() => this.createPermissionControls())
    )
  });

  submitted = false;
  createdUser: AccessControlUser | null = null;

  get permissionRows(): FormArray<FormGroup<PermissionControls>> {
    return this.userForm.controls.permissions;
  }

  goBack(): void {
    void this.navigation.back('/settings/company/profile');
  }

  setAllPermissions(checked: boolean): void {
    this.permissionRows.controls.forEach(row => row.patchValue({
      view: checked,
      create: checked,
      edit: checked,
      delete: checked
    }));
  }

  setGroupPermissions(groupLabel: string, checked: boolean): void {
    const group = this.permissionGroups.find(item => item.label === groupLabel);
    group?.modules.forEach(({ index }) => this.permissionRows.at(index).patchValue({
      view: checked,
      create: checked,
      edit: checked,
      delete: checked
    }));
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const value = this.userForm.getRawValue();
    const permissions: AccessControlPermission[] = this.permissionModules.map((module, index) => ({
      module: module.key,
      ...this.permissionRows.at(index).getRawValue()
    }));
    const user: AccessControlUser = {
      id: `USR-${String(users.length + 1).padStart(4, '0')}`,
      fullName: value.fullName.trim(),
      email: value.email.trim().toLowerCase(),
      role: value.role,
      status: value.status,
      permissions
    };

    users.push(user);
    this.createdUser = user;
    this.userForm.reset({
      fullName: '',
      email: '',
      role: 'Employee',
      status: 'ACTIVE'
    });
    this.permissionRows.controls.forEach(row => row.reset({ view: false, create: false, edit: false, delete: false }));
  }

  private createPermissionControls(): FormGroup<PermissionControls> {
    return new FormGroup({
      view: new FormControl(false, { nonNullable: true }),
      create: new FormControl(false, { nonNullable: true }),
      edit: new FormControl(false, { nonNullable: true }),
      delete: new FormControl(false, { nonNullable: true })
    });
  }
}

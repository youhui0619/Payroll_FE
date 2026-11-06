import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialImports, MaterialProviders } from '../../../../../shared/material-imports';
import { NavigationService } from '../../../../../services/navigation.service';
import { permissionModules } from '../../../../../data/access-control/permission-modules.data';
import { roles } from '../../../../../data/access-control/roles.data';
import { users } from '../../../../../data/access-control/users.data';
import type { AccessControlRole, RolePermission, RoleStatus } from '../../../../../models/access-control/role.model';

type PermissionControls = {
  view: FormControl<boolean>;
  create: FormControl<boolean>;
  edit: FormControl<boolean>;
  delete: FormControl<boolean>;
};

@Component({
  selector: 'app-edit-role-permissions',
  standalone: true,
  imports: [...MaterialImports, ReactiveFormsModule],
  providers: [...MaterialProviders],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly navigation = inject(NavigationService);
  private readonly router = inject(Router);
  readonly role = roles.find(item => item.id === this.route.snapshot.paramMap.get('id'));
  readonly permissionModules = permissionModules;
  readonly permissionGroups = [...new Set(permissionModules.map(module => module.group))].map(group => ({
    label: group,
    modules: permissionModules
      .map((module, index) => ({ module, index }))
      .filter(item => item.module.group === group)
  }));

  readonly roleForm = new FormGroup({
    name: new FormControl(this.role?.name ?? '', { nonNullable: true, validators: [Validators.required, Validators.maxLength(60)] }),
    description: new FormControl(this.role?.description ?? '', { nonNullable: true, validators: [Validators.maxLength(250)] }),
    status: new FormControl<RoleStatus>(this.role?.status ?? 'ACTIVE', { nonNullable: true }),
    permissions: new FormArray<FormGroup<PermissionControls>>(
      permissionModules.map(module => this.createPermissionControls(this.role?.permissions.find(item => item.module === module.key)))
    )
  });

  get permissionRows(): FormArray<FormGroup<PermissionControls>> {
    return this.roleForm.controls.permissions;
  }

  get allPermissionsSelected(): boolean {
    const values = this.permissionRows.controls.flatMap(row => Object.values(row.getRawValue()));
    return values.length > 0 && values.every(Boolean);
  }

  get allPermissionsIndeterminate(): boolean {
    const values = this.permissionRows.controls.flatMap(row => Object.values(row.getRawValue()));
    return values.some(Boolean) && !values.every(Boolean);
  }

  groupPermissionsSelected(groupLabel: string): boolean {
    const group = this.permissionGroups.find(item => item.label === groupLabel);
    const values = group?.modules.flatMap(({ index }) => Object.values(this.permissionRows.at(index).getRawValue())) ?? [];
    return values.length > 0 && values.every(Boolean);
  }

  groupPermissionsIndeterminate(groupLabel: string): boolean {
    const group = this.permissionGroups.find(item => item.label === groupLabel);
    const values = group?.modules.flatMap(({ index }) => Object.values(this.permissionRows.at(index).getRawValue())) ?? [];
    return values.some(Boolean) && !values.every(Boolean);
  }

  goBack(): Promise<boolean> {
    return this.navigation.back('/settings/access-control/role-permissions/overview');
  }

  setAllPermissions(checked: boolean): void {
    this.permissionRows.controls.forEach(row => this.setPermissionRow(row, checked));
  }

  setGroupPermissions(groupLabel: string, checked: boolean): void {
    const group = this.permissionGroups.find(item => item.label === groupLabel);
    group?.modules.forEach(({ index }) => this.setPermissionRow(this.permissionRows.at(index), checked));
  }

  onSubmit(): void {
    if (!this.role) return;

    const nameControl = this.roleForm.controls.name;
    const normalizedName = nameControl.value.trim();
    nameControl.setValue(normalizedName, { emitEvent: false });
    const duplicate = roles.some(role => role.id !== this.role?.id && role.name.toLowerCase() === normalizedName.toLowerCase());
    const existingErrors = nameControl.errors;
    if (duplicate) {
      nameControl.setErrors({ ...existingErrors, duplicate: true });
    } else if (existingErrors?.['duplicate']) {
      const remainingErrors = { ...existingErrors };
      delete remainingErrors['duplicate'];
      nameControl.setErrors(Object.keys(remainingErrors).length ? remainingErrors : null);
    }

    if (this.roleForm.invalid) {
      this.roleForm.markAllAsTouched();
      return;
    }

    const value = this.roleForm.getRawValue();
    const oldName = this.role.name;
    const permissions: RolePermission[] = permissionModules.map((module, index) => ({
      module: module.key,
      ...this.permissionRows.at(index).getRawValue()
    }));

    this.role.name = normalizedName;
    this.role.description = value.description.trim();
    this.role.status = value.status;
    this.role.permissions = permissions;

    if (oldName !== normalizedName) {
      users.forEach(user => {
        user.roles = user.roles.map(roleName => roleName === oldName ? normalizedName : roleName);
      });
    }

    void this.router.navigateByUrl('/settings/access-control/role-permissions/overview');
  }

  private setPermissionRow(row: FormGroup<PermissionControls>, checked: boolean): void {
    row.patchValue({ view: checked, create: checked, edit: checked, delete: checked });
  }

  private createPermissionControls(permission?: RolePermission): FormGroup<PermissionControls> {
    return new FormGroup({
      view: new FormControl(permission?.view ?? false, { nonNullable: true }),
      create: new FormControl(permission?.create ?? false, { nonNullable: true }),
      edit: new FormControl(permission?.edit ?? false, { nonNullable: true }),
      delete: new FormControl(permission?.delete ?? false, { nonNullable: true })
    });
  }
}

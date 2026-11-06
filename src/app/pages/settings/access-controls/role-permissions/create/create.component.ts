import { Component, inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MaterialImports, MaterialProviders } from '../../../../../shared/material-imports';
import { NavigationService } from '../../../../../services/navigation.service';
import { permissionModules } from '../../../../../data/access-control/permission-modules.data';
import { roles } from '../../../../../data/access-control/roles.data';
import type { AccessControlRole, RolePermission, RoleStatus } from '../../../../../models/access-control/role.model';

type PermissionControls = {
  view: FormControl<boolean>;
  create: FormControl<boolean>;
  edit: FormControl<boolean>;
  delete: FormControl<boolean>;
};

@Component({
  selector: 'app-create-role-permissions',
  standalone: true,
  imports: [...MaterialImports, ReactiveFormsModule],
  providers: [...MaterialProviders],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent {
  private readonly navigation = inject(NavigationService);
  private readonly router = inject(Router);

  readonly permissionModules = permissionModules;
  readonly permissionGroups = [...new Set(permissionModules.map(module => module.group))].map(group => ({
    label: group,
    modules: permissionModules
      .map((module, index) => ({ module, index }))
      .filter(item => item.module.group === group)
  }));

  readonly roleForm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(60)] }),
    description: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(250)] }),
    status: new FormControl<RoleStatus>('ACTIVE', { nonNullable: true }),
    permissions: new FormArray<FormGroup<PermissionControls>>(
      permissionModules.map(() => this.createPermissionControls())
    )
  });

  submitted = false;

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
    this.submitted = true;
    const nameControl = this.roleForm.controls.name;
    const normalizedName = nameControl.value.trim();
    nameControl.setValue(normalizedName, { emitEvent: false });

    const duplicate = roles.some(role => role.name.toLowerCase() === normalizedName.toLowerCase());
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
    const permissions: RolePermission[] = permissionModules.map((module, index) => ({
      module: module.key,
      ...this.permissionRows.at(index).getRawValue()
    }));
    const role: AccessControlRole = {
      id: `ROLE-${String(roles.length + 1).padStart(4, '0')}`,
      name: normalizedName,
      description: value.description.trim(),
      status: value.status,
      permissions
    };

    roles.push(role);
    void this.router.navigateByUrl('/settings/access-control/role-permissions/overview');
  }

  private setPermissionRow(row: FormGroup<PermissionControls>, checked: boolean): void {
    row.patchValue({ view: checked, create: checked, edit: checked, delete: checked });
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

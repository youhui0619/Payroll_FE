import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialImports, MaterialProviders } from '../../../../../shared/material-imports';
import { NavigationService } from '../../../../../services/navigation.service';
import { permissionModules } from '../../../../../data/access-control/permission-modules.data';
import { roles } from '../../../../../data/access-control/roles.data';
import type { AccessControlRole, RolePermission, RoleStatus, PermissionControls } from '../../../../../models/access-control/role.model';
import { ToastService } from '../../../../../shared/components/toast/toast.service';


@Component({
  selector: 'app-edit-role-permissions',
  standalone: true,
  imports: [...MaterialImports, ReactiveFormsModule],
  providers: [...MaterialProviders],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent {
  constructor(
    private toastService: ToastService,
    private navigation: NavigationService,
    private router: Router,
    private route: ActivatedRoute
  ){}

  role: any; 
  permissionModules = permissionModules;
  permissionGroups = [...new Set(permissionModules.map(module => module.group))].map(group => ({
    label: group,
    modules: permissionModules
      .map((module, index) => ({ module, index }))
      .filter(item => item.module.group === group)
  }));

  form!: FormGroup<{
    name: FormControl<string>;
    description: FormControl<string>;
    status: FormControl<RoleStatus>;
    permissions: FormArray<FormGroup<PermissionControls>>;
  }>;
  submitting: boolean = false;

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl('', { nonNullable: true, validators: [Validators.required]}),
      description: new FormControl('', { nonNullable: true, validators: [Validators.required]}),
      status: new FormControl<RoleStatus>('ACTIVE', { nonNullable: true, validators: [Validators.required]}),
      permissions: new FormArray<FormGroup<PermissionControls>>(
        permissionModules.map(() => this.createPermissionControls())
      )
    });

    this.getRole()
    
  }

  getRole(){
    this.role = roles.find(item => item.id === this.route.snapshot.paramMap.get('id'));
    console.log("this.role", this.role)
    if(this.role){
      this.form.patchValue(this.role)
    }
  }

  get permissionRows(): FormArray<FormGroup<PermissionControls>> {
    return this.form.controls.permissions;
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

  onSubmit(form: FormGroup) {
    const nameControl = this.form.controls.name;
    const normalizedName = nameControl.value.trim();
    nameControl.setValue(normalizedName, { emitEvent: false });

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const permissions: RolePermission[] = permissionModules.map((module, index) => ({
      module: module.key,
      ...this.permissionRows.at(index).getRawValue()
    }));

    const data: AccessControlRole = {
      id: `ROLE-${String(roles.length + 1).padStart(4, '0')}`,
      name: normalizedName,
      description: value.description.trim(),
      status: value.status,
      permissions
    };

    console.log("data", data)
    this.toastService.show({
      title: 'Success',
      message: 'error.error.message',
      icon: 'danger'
    });
    this.submitting = false;

    return this.router.navigate(['/settings/access-control/role-permissions/overview']);
  }

}

import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialImports, MaterialProviders } from '../../../../../shared/material-imports';
import { NavigationService } from '../../../../../services/navigation.service';
import { permissionModules } from '../../../../../data/access-control/permission-modules.data';
import { roles } from '../../../../../data/access-control/roles.data';
import { users } from '../../../../../data/access-control/users.data';
import type { AccessControlRole } from '../../../../../models/access-control/role.model';
import type { AccessControlUser, UserStatus } from '../../../../../models/access-control/user.model';
import { ToastService } from '../../../../../shared/components/toast/toast.service';

@Component({
  selector: 'app-edit-user',
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
  user: any;
  roleOptions = roles.filter(role => role.status === 'ACTIVE');
  form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    roles: new FormControl<string[]>([], { nonNullable: true, validators: [Validators.required] }),
    status: new FormControl<UserStatus>('ACTIVE', { nonNullable: true })
  });
  submitting: boolean = false;

  ngOnInit() {
    this.getUser()
  }

  getUser(){
    this.user = users.find(item => item.id === this.route.snapshot.paramMap.get('id'));
    console.log("this.user", this.user)
    if(this.user){
      this.form.patchValue(this.user)
    }
  }

  get selectedRoles(): AccessControlRole[] {
    const selectedNames = this.form.controls.roles.value;
    return this.roleOptions.filter(role => selectedNames.includes(role.name));
  }
get grantedPermissionGroups(): {
    label: string;
    modules: { label: string; actions: { view: boolean; create: boolean; edit: boolean; delete: boolean } }[];
  }[] {
    const selectedRoles = this.selectedRoles;
    if (selectedRoles.length === 0) return [];

    return [...new Set(permissionModules.map(module => module.group))].map(group => ({
      label: group,
      modules: permissionModules
        .filter(module => module.group === group)
        .map(module => {
          const permissions = selectedRoles
            .map(role => role.permissions.find(item => item.module === module.key))
            .filter((permission): permission is NonNullable<typeof permission> => !!permission);
          const actions = {
            view: permissions.some(permission => permission.view),
            create: permissions.some(permission => permission.create),
            edit: permissions.some(permission => permission.edit),
            delete: permissions.some(permission => permission.delete)
          };
          return { label: module.label, actions };
        })
        .filter(module => Object.values(module.actions).some(Boolean))
    })).filter(group => group.modules.length > 0);
  }

  get grantedPermissionCount(): number {
    return this.grantedPermissionGroups.reduce((count, group) => count + group.modules.length, 0);
  }

  goBack(): Promise<boolean> {
    return this.navigation.back('/settings/access-control/users/overview');
  }

  onSubmit(form: FormGroup) {
    if (!this.user) return;
    if (form.invalid) {
      form.markAllAsTouched();
      return;
    }

    const value = form.getRawValue();
    const data: AccessControlUser = {
      id: `USR-${String(users.length + 1).padStart(4, '0')}`,
      name: value.name.trim(),
      email: value.email.trim().toLowerCase(),
      roles: value.roles,
      status: value.status
    };

    console.log("data", data)
    this.toastService.show({
      title: 'Success',
      message: 'error.error.message',
      icon: 'danger'
    });
    this.submitting = false;

    return this.router.navigate(['/settings/access-control/users/overview']);
  }
}

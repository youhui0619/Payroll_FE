import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialImports, MaterialProviders } from '../../../../../shared/material-imports';
import { NavigationService } from '../../../../../services/navigation.service';
import { users } from '../../../../../data/access-control/users.data';
import { roles } from '../../../../../data/access-control/roles.data';
import { permissionModules } from '../../../../../data/access-control/permission-modules.data';
import type { AccessControlRole } from '../../../../../models/access-control/role.model';
import type { AccessControlUser, UserStatus } from '../../../../../models/access-control/user.model';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [...MaterialImports, ReactiveFormsModule],
  providers: [...MaterialProviders],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent {
  private readonly navigation = inject(NavigationService);

  readonly roleOptions = roles.filter(role => role.status === 'ACTIVE');

  get selectedRoles(): AccessControlRole[] {
    const selectedNames = this.userForm.controls.roles.value;
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

  readonly userForm = new FormGroup({
    fullName: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(100)] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email, Validators.maxLength(150)] }),
    roles: new FormControl<string[]>([], { nonNullable: true, validators: [Validators.required] }),
    status: new FormControl<UserStatus>('ACTIVE', { nonNullable: true })
  });

  submitted = false;
  createdUser: AccessControlUser | null = null;

  goBack(): Promise<boolean> {
    return this.navigation.back('/settings/access-control/users/overview');
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const value = this.userForm.getRawValue();
    const user: AccessControlUser = {
      id: `USR-${String(users.length + 1).padStart(4, '0')}`,
      fullName: value.fullName.trim(),
      email: value.email.trim().toLowerCase(),
      roles: value.roles,
      status: value.status
    };

    users.push(user);
    this.createdUser = user;
    this.userForm.reset({
      fullName: '',
      email: '',
      roles: [],
      status: 'ACTIVE'
    });
  }
}

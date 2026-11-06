import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialImports, MaterialProviders } from '../../../../../shared/material-imports';
import { NavigationService } from '../../../../../services/navigation.service';
import { permissionModules } from '../../../../../data/access-control/permission-modules.data';
import { roles } from '../../../../../data/access-control/roles.data';
import { users } from '../../../../../data/access-control/users.data';
import type { AccessControlRole } from '../../../../../models/access-control/role.model';
import type { AccessControlUser, UserStatus } from '../../../../../models/access-control/user.model';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [...MaterialImports, ReactiveFormsModule],
  providers: [...MaterialProviders],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly navigation = inject(NavigationService);
  readonly user: AccessControlUser | undefined = users.find(item => item.id === this.route.snapshot.paramMap.get('id'));
  readonly roleOptions = roles.filter(role => role.status === 'ACTIVE');
  saved = false;

  readonly userForm = new FormGroup({
    fullName: new FormControl(this.user?.fullName ?? '', { nonNullable: true, validators: [Validators.required, Validators.maxLength(100)] }),
    email: new FormControl(this.user?.email ?? '', { nonNullable: true, validators: [Validators.required, Validators.email, Validators.maxLength(150)] }),
    roles: new FormControl<string[]>([...(this.user?.roles ?? [])], { nonNullable: true, validators: [Validators.required] }),
    status: new FormControl<UserStatus>(this.user?.status ?? 'ACTIVE', { nonNullable: true })
  });

  get selectedRoles(): AccessControlRole[] {
    const selectedNames = this.userForm.controls.roles.value;
    return this.roleOptions.filter(role => selectedNames.includes(role.name));
  }

  get permissionGroups(): {
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

  goBack(): Promise<boolean> {
    return this.navigation.back('/settings/access-control/users/overview');
  }

  onSubmit(): void {
    if (!this.user) return;
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const value = this.userForm.getRawValue();
    this.user.fullName = value.fullName.trim();
    this.user.email = value.email.trim().toLowerCase();
    this.user.roles = [...value.roles];
    this.user.status = value.status;
    this.saved = true;
  }
}

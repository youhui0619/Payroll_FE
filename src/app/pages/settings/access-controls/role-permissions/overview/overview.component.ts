import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MaterialImports, MaterialProviders } from '../../../../../shared/material-imports';
import { roles } from '../../../../../data/access-control/roles.data';
import { users } from '../../../../../data/access-control/users.data';

@Component({
  selector: 'app-role-permissions-overview',
  standalone: true,
  imports: [...MaterialImports, RouterLink],
  providers: [...MaterialProviders],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent {
  readonly roles = roles;

  assignedUsers(roleName: string): number {
    return users.filter(user => user.roles.includes(roleName)).length;
  }

  grantedPermissionCount(role: typeof roles[number]): number {
    return role.permissions.filter(permission =>
      permission.view || permission.create || permission.edit || permission.delete
    ).length;
  }
}

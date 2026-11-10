import { OnInit, Component } from '@angular/core';
import { SkeletonLoaderComponent } from '../../../../../shared/components/skeleton-loader/skeleton-loader.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MaterialImports, MaterialProviders } from '../../../../../shared/material-imports';
import { users } from '../../../../../data/access-control/users.data';
import type { UserStatus } from '../../../../../models/access-control/user.model';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [...MaterialImports, ReactiveFormsModule, RouterLink, SkeletonLoaderComponent],
  providers: [...MaterialProviders],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent implements OnInit {
  loading = true;

  ngOnInit(): void {
    window.setTimeout(() => this.loading = false, 3000);
  }

  readonly users = users;
  readonly statuses: UserStatus[] = ['ACTIVE', 'INACTIVE'];
  readonly searchControl = new FormControl('', { nonNullable: true });
  selectedRoles: string[] = [];
  selectedStatuses: UserStatus[] = [];

  get roleOptions(): string[] {
    return [...new Set(this.users.flatMap(user => user.roles))].sort();
  }

  get filteredUsers() {
    const query = this.searchControl.value.trim().toLowerCase();
    return this.users.filter(user => {
      const matchesQuery = !query || [user.fullName, user.email, user.id, ...user.roles]
        .some(value => value.toLowerCase().includes(query));
      const matchesRole = this.selectedRoles.length === 0 || this.selectedRoles.some(role => user.roles.includes(role));
      const matchesStatus = this.selectedStatuses.length === 0 || this.selectedStatuses.includes(user.status);
      return matchesQuery && matchesRole && matchesStatus;
    });
  }

  get activeUserCount(): number {
    return this.users.filter(user => user.status === 'ACTIVE').length;
  }

  get inactiveUserCount(): number {
    return this.users.filter(user => user.status === 'INACTIVE').length;
  }

  get roleAssignmentCount(): number {
    return this.users.reduce((count, user) => count + user.roles.length, 0);
  }

  filteredCountByStatus(status: UserStatus): number {
    return this.filteredUsers.filter(user => user.status === status).length;
  }

  clearFilters(): void {
    this.searchControl.setValue('');
    this.selectedRoles = [];
    this.selectedStatuses = [];
  }

  initials(name: string): string {
    return name.split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]).join('').toUpperCase();
  }
}

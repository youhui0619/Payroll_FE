
import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { TablerIconComponent } from '@tabler/icons-angular';
import { employees } from '../../../../data/workforce/employees.data';
import { SkeletonLoaderComponent } from '../../../../shared/components/skeleton-loader/skeleton-loader.component';
import { departments } from '../../../../data/workforce/departments.data';
import { employmentStatuses, employmentTypes } from '../../../../data/workforce/options/employment-options.data';
import type { EmploymentStatus, EmploymentType } from '../../../../models/workforce/employment-status.model';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [MatButtonModule, MatFormFieldModule, MatInputModule, MatPaginator, MatSelectModule, MatSort, ReactiveFormsModule, RouterModule, SkeletonLoaderComponent, TablerIconComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit {
  loading = true;
  readonly employees = employees;
  readonly departments = departments.filter(department => department.status === 'Active');
  readonly employmentTypes = employmentTypes;
  readonly employmentStatuses = employmentStatuses;
  readonly searchControl = new FormControl('', { nonNullable: true });
  selectedDepartments: string[] = [];
  selectedEmploymentTypes: EmploymentType[] = [];
  selectedEmploymentStatuses: EmploymentStatus[] = [];

  ngOnInit(): void {
    // Keep the initial loading state visible while this page uses local sample data.
    window.setTimeout(() => this.loading = false, 5000);
  }

  get filteredEmployees() {
    const query = this.searchControl.value.trim().toLowerCase();
    return this.employees.filter(employee => {
      const matchesQuery = !query || [employee.employeeName, employee.employeeId, employee.department, employee.position]
        .some(value => value.toLowerCase().includes(query));
      const matchesDepartment = this.selectedDepartments.length === 0 || this.selectedDepartments.includes(employee.department);
      const matchesType = this.selectedEmploymentTypes.length === 0 || this.selectedEmploymentTypes.includes(employee.employmentType);
      const matchesStatus = this.selectedEmploymentStatuses.length === 0 || this.selectedEmploymentStatuses.includes(employee.employmentStatus);
      return matchesQuery && matchesDepartment && matchesType && matchesStatus;
    });
  }

  clearFilters(): void {
    this.searchControl.setValue('');
    this.selectedDepartments = [];
    this.selectedEmploymentTypes = [];
    this.selectedEmploymentStatuses = [];
  }

  filteredCountByStatus(status: EmploymentStatus): number {
    return this.filteredEmployees.filter(employee => employee.employmentStatus === status).length;
  }

  employmentStatusClass(status: EmploymentStatus): string {
    const classes: Record<EmploymentStatus, string> = {
      Active: 'bg-light-success text-success',
      Probation: 'bg-light-warning text-warning',
      Suspended: 'bg-light-danger text-danger',
      Resigned: 'bg-light-secondary text-secondary',
      Terminated: 'bg-light-danger text-danger',
      Retired: 'bg-light-info text-info'
    };
    return classes[status];
  }
}

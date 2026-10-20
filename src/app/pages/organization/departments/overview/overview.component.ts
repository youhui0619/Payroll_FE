import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MaterialImports, MaterialProviders } from '../../../../shared/material-imports';
import { departments } from '../../../../data/departments';
import { employees } from '../../../../data/employees';
import type { Department, DepartmentStatus } from '../../../../models/department.model';

@Component({
  selector: 'app-overview',
  imports: [CommonModule, FormsModule, ...MaterialImports, RouterLink],
  providers: [...MaterialProviders],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent {
  readonly departments = departments;
  readonly employees = employees;
  readonly statuses: DepartmentStatus[] = ['Active', 'Inactive', 'Draft'];

  searchTerm = '';
  selectedDepartmentIds: string[] = [];
  selectedStatuses: DepartmentStatus[] = [];

  get filteredDepartments(): Department[] {
    const query = this.searchTerm.trim().toLowerCase();
    return this.departments.filter(department => {
      const matchesSearch = !query || [department.name, department.code, department.shortName, department.remark]
        .some(value => value.toLowerCase().includes(query));
      const matchesDepartment = this.selectedDepartmentIds.length === 0
        || this.selectedDepartmentIds.includes(department.id);
      const matchesStatus = this.selectedStatuses.length === 0
        || this.selectedStatuses.includes(department.status);
      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }

  get activeDepartmentCount(): number {
    return this.departments.filter(department => department.status === 'Active').length;
  }

  get inactiveDepartmentCount(): number {
    return this.departments.filter(department => department.status === 'Inactive').length;
  }

  get draftDepartmentCount(): number {
    return this.departments.filter(department => department.status === 'Draft').length;
  }

  filteredCountByStatus(status: DepartmentStatus): number {
    return this.filteredDepartments.filter(department => department.status === status).length;
  }

  departmentName(parentDepartmentId: string | null): string {
    return this.departments.find(department => department.id === parentDepartmentId)?.name ?? '-';
  }

  departmentHead(employeeId: string | null): string {
    return this.employees.find(employee => employee.employeeId === employeeId)?.employeeName ?? '-';
  }

  departmentEmployeeCount(department: Department): number {
    return this.employees.filter(employee => employee.department === department.name).length;
  }

  statusClass(status: DepartmentStatus): string {
    if (status === 'Active') return 'bg-light-primary text-primary';
    if (status === 'Inactive') return 'bg-light-secondary text-secondary';
    return 'bg-light-warning text-warning';
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedDepartmentIds = [];
    this.selectedStatuses = [];
  }
}

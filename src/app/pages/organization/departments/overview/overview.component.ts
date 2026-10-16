import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MaterialImports, MaterialProviders } from '../../../../shared/material-imports';
import { departments } from '../../../../data/departments';
import { employees } from '../../../../data/employees';

@Component({
  selector: 'app-overview',
  imports: [CommonModule, ...MaterialImports, RouterLink],
  providers: [...MaterialProviders],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent {
  readonly departments = departments;
  readonly employees = employees;

  departmentName(parentDepartmentId: string | null): string {
    return this.departments.find(department => department.id === parentDepartmentId)?.name ?? '-';
  }

  departmentHead(employeeId: string | null): string {
    return this.employees.find(employee => employee.employeeId === employeeId)?.employeeName ?? '-';
  }
}

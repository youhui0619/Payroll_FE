import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialImports, MaterialProviders } from '../../../../shared/material-imports';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { FullCalendarModule, CalendarOptions } from '@fullcalendar/angular';
import { departments } from '../../../../data/departments';
import { employees as employeeRecords } from '../../../../data/employees';
import type { Department } from '../../../../models/department.model';
import type { EmployeeRecord } from '../../../../models/employee.model';

@Component({
  selector: 'app-view',
  imports: [...MaterialImports, CommonModule, FormsModule, ReactiveFormsModule, ToastrModule, FullCalendarModule, RouterLink],
    providers: [...MaterialProviders, ToastrService],
    templateUrl: './view.component.html',
  styleUrl: './view.component.scss'
})
export class ViewComponent {
  readonly department: Department;
  readonly employees: EmployeeRecord[];

  constructor(route: ActivatedRoute) {
    const departmentId = route.snapshot.paramMap.get('id');
    this.department = departments.find(item => item.id === departmentId) ?? departments[0];
    this.employees = employeeRecords.filter(employee => employee.department === this.department.name);
  }

  parentDepartmentName(): string {
    return departments.find(item => item.id === this.department.parentDepartmentId)?.name ?? '- (Top-level)';
  }

  departmentHeadName(): string {
    return employeeRecords.find(item => item.employeeId === this.department.headOfDepartmentId)?.employeeName ?? '—';
  }
}

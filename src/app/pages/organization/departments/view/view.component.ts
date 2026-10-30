import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialImports, MaterialProviders } from '../../../../shared/material-imports';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { FullCalendarModule, CalendarOptions } from '@fullcalendar/angular';
import { departments } from '../../../../data/departments';
import { employees as employeeRecords } from '../../../../data/employees';
import type { Department } from '../../../../models/department.model';
import type { EmployeeRecord } from '../../../../models/employee.model';
import { NavigationService } from '../../../../services/navigation.service';

interface DepartmentTreeNode {
  department: Department;
  children: DepartmentTreeNode[];
}

@Component({
  selector: 'app-view',
  imports: [...MaterialImports, CommonModule, FormsModule, ReactiveFormsModule, ToastrModule, FullCalendarModule, RouterLink],
    providers: [...MaterialProviders, ToastrService],
    templateUrl: './view.component.html',
  styleUrl: './view.component.scss'
})
export class ViewComponent {
  private readonly navigation = inject(NavigationService);
  department!: Department;
  employees: EmployeeRecord[] = [];
  organizationTree: DepartmentTreeNode[] = [];
  searchTerm = '';
  selectedEmploymentTypes: string[] = [];
  selectedEmploymentStatuses: string[] = [];

  goBack(): void { void this.navigation.back('/organization/departments/overview'); }

  constructor(route: ActivatedRoute) {
    route.paramMap.pipe(takeUntilDestroyed()).subscribe(params => {
      const departmentId = params.get('id');
      const department = departments.find(item => item.id === departmentId) ?? departments[0];
      if (!department) return;

      this.department = department;
      this.employees = employeeRecords.filter(employee => employee.department === department.name);
      this.organizationTree = this.buildOrganizationTree();
      this.clearEmployeeFilters();
    });
  }

  get employmentTypes(): string[] {
    return [...new Set(this.employees.map(employee => employee.employmentType).filter(Boolean))].sort();
  }

  get employmentStatuses(): string[] {
    return [...new Set(this.employees.map(employee => employee.employmentStatus).filter(Boolean))].sort();
  }

  get filteredEmployees(): EmployeeRecord[] {
    const query = this.searchTerm.trim().toLocaleLowerCase();

    return this.employees.filter(employee => {
      const matchesSearch = !query || [
        employee.employeeName,
        employee.employeeId,
        employee.position,
        employee.tin,
        employee.kwspNo
      ].some(value => value?.toLocaleLowerCase().includes(query));
      const matchesType = !this.selectedEmploymentTypes.length || this.selectedEmploymentTypes.includes(employee.employmentType);
      const matchesStatus = !this.selectedEmploymentStatuses.length || this.selectedEmploymentStatuses.includes(employee.employmentStatus);

      return matchesSearch && matchesType && matchesStatus;
    });
  }

  employeeStatusCount(status: string): number {
    return this.filteredEmployees.filter(employee => employee.employmentStatus === status).length;
  }

  employeeStatusClass(status: string): string {
    switch (status.toLocaleLowerCase()) {
      case 'active': return 'bg-light-primary text-primary';
      case 'probation': return 'bg-light-warning text-warning';
      default: return 'bg-light-secondary text-secondary';
    }
  }

  clearEmployeeFilters(): void {
    this.searchTerm = '';
    this.selectedEmploymentTypes = [];
    this.selectedEmploymentStatuses = [];
  }

  parentDepartmentName(): string {
    return departments.find(item => item.id === this.department.parentDepartmentId)?.name ?? '- (Top-level)';
  }

  departmentHeadName(): string {
    return employeeRecords.find(item => item.employeeId === this.department.headOfDepartmentId)?.employeeName ?? '—';
  }

  departmentHead(department: Department): string {
    return employeeRecords.find(employee => employee.employeeId === department.headOfDepartmentId)?.employeeName ?? 'No department head assigned';
  }

  departmentEmployeeCount(department: Department): number {
    return employeeRecords.filter(employee => employee.department === department.name).length;
  }

  private buildOrganizationTree(): DepartmentTreeNode[] {
    const nodes = new Map<string, DepartmentTreeNode>();

    for (const department of departments) {
      nodes.set(department.id, { department, children: [] });
    }

    for (const node of nodes.values()) {
      const parentId = node.department.parentDepartmentId;
      const parent = parentId ? nodes.get(parentId) : undefined;
      if (parent && parent.department.id !== node.department.id) parent.children.push(node);
    }

    const selectedNode = nodes.get(this.department.id);
    if (!selectedNode) return [];

    let branch: DepartmentTreeNode = {
      department: selectedNode.department,
      children: selectedNode.children.map(child => ({ department: child.department, children: [] }))
    };
    let currentNode = selectedNode;
    const visited = new Set<string>([currentNode.department.id]);

    while (currentNode.department.parentDepartmentId) {
      const parent = nodes.get(currentNode.department.parentDepartmentId);
      if (!parent || visited.has(parent.department.id)) break;
      visited.add(parent.department.id);
      branch = { department: parent.department, children: [branch] };
      currentNode = parent;
    }

    return [branch];
  }
}

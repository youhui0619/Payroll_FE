import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialImports, MaterialProviders } from '../../../../shared/material-imports';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FullCalendarModule, CalendarOptions } from '@fullcalendar/angular';
import { departments } from '../../../../data/workforce/departments.data';
import { employees as Employees } from '../../../../data/workforce/employees.data';
import type { Department } from '../../../../models/workforce/department.model';
import type { Employee } from '../../../../models/workforce/employee.model';
import { DepartmentsApiService } from '../../../../services/api/departments.service';
import { ToastService } from '../../../../shared/components/toast/toast.service';
import { AlertService } from '../../../../shared/components/alert/alert.service';


interface DepartmentTreeNode {
  department: Department;
  children: DepartmentTreeNode[];
}

@Component({
  selector: 'app-view',
  imports: [...MaterialImports, CommonModule, FormsModule, ReactiveFormsModule, FullCalendarModule, RouterLink],
  providers: [...MaterialProviders, DepartmentsApiService],
  templateUrl: './view.component.html',
  styleUrl: './view.component.scss'
})
export class ViewComponent {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private apiService: DepartmentsApiService,
    private toastService: ToastService,
    private alertService: AlertService,
    private cdr: ChangeDetectorRef
  ) {}
  
  department!: Department;
  id: any;
  employees: Employee[] = [];
  organizationTree: DepartmentTreeNode[] = [];
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      if (this.id) {
        this.getDepartment(this.id);
      } else {
        console.error("🚨 No ID found in route!");
      }
    });  
  }

  getDepartment(id: any){
    console.log(id)
    this.apiService.getDepartment(id).subscribe({
      next: (response) => {
        this.department = response.data;
        console.log("department:", this.department);
      },
      error: (error) => {
        this.toastService.show({
          title: error.error.code,
          message: error.error.message,
          icon: 'danger'
        });
      },
    });
  }

  goBack() {
    return this.router.navigate(['/organization/departments/overview'])
  }

  // get employmentTypes(): string[] {
  //   return [...new Set(this.employees.map(employee => employee.employmentType).filter(Boolean))].sort();
  // }

  // get employmentStatuses(): string[] {
  //   return [...new Set(this.employees.map(employee => employee.employmentStatus).filter(Boolean))].sort();
  // }

  // get filteredEmployees(): Employee[] {
  //   const query = this.searchTerm.trim().toLocaleLowerCase();

  //   return this.employees.filter(employee => {
  //     const matchesSearch = !query || [
  //       employee.employeeName,
  //       employee.employeeId,
  //       employee.position,
  //       employee.tin,
  //       employee.kwspNo
  //     ].some(value => value?.toLocaleLowerCase().includes(query));
  //     const matchesType = !this.selectedEmploymentTypes.length || this.selectedEmploymentTypes.includes(employee.employmentType);
  //     const matchesStatus = !this.selectedEmploymentStatuses.length || this.selectedEmploymentStatuses.includes(employee.employmentStatus);

  //     return matchesSearch && matchesType && matchesStatus;
  //   });
  // }

  // employeeStatusCount(status: string): number {
  //   return this.filteredEmployees.filter(employee => employee.employmentStatus === status).length;
  // }

  // employeeStatusClass(status: string): string {
  //   switch (status.toLocaleLowerCase()) {
  //     case 'active': return 'bg-light-primary text-primary';
  //     case 'probation': return 'bg-light-warning text-warning';
  //     default: return 'bg-light-secondary text-secondary';
  //   }
  // }

  // clearEmployeeFilters(): void {
  //   this.searchTerm = '';
  //   this.selectedEmploymentTypes = [];
  //   this.selectedEmploymentStatuses = [];
  // }

  parentDepartmentName(): string {
    return departments.find(item => item.id === this.department.parentDepartmentId)?.name ?? '- (Top-level)';
  }

  departmentHeadName(): string {
    return Employees.find(item => item.employeeId === this.department.headOfDepartmentId)?.employeeName ?? '-';
  }

  departmentHead(department: Department): string {
    return Employees.find(employee => employee.employeeId === department.headOfDepartmentId)?.employeeName ?? 'No department head assigned';
  }

  departmentEmployeeCount(department: Department): number {
    return Employees.filter(employee => employee.department === department.name).length;
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

import { CommonModule } from '@angular/common';
import { OnInit, Component, ViewChild, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MaterialImports, MaterialProviders } from '../../../../shared/material-imports';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastService } from '../../../../shared/components/toast/toast.service';
import { stateList } from '../../../../data/other/other.data';
import { employees } from '../../../../data/workforce/employees.data';
import { SkeletonLoaderComponent } from '../../../../shared/components/skeleton-loader/skeleton-loader.component';
import { departments } from '../../../../data/workforce/departments.data';
import { employmentStatuses, employmentTypes } from '../../../../data/workforce/options/employment-options.data';
import type { EmploymentStatus, EmploymentType } from '../../../../models/workforce/employment-status.model';
import { EmployeesApiService } from '../../../../services/api/employees.service';
import { Employee } from '../../../../models/workforce/employee.model';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, ...MaterialImports, RouterLink, SkeletonLoaderComponent, FormsModule],
  providers: [...MaterialProviders, EmployeesApiService],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit {
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private apiService: EmployeesApiService,
    private toastService: ToastService
  ) {}

  loading = true;
  employees = new MatTableDataSource<Employee>([]);
  filter: any = {};
  meta: any = {};
  stateList: any = {};



  departments = departments.filter(department => department.status === 'ACTIVE');
  employmentTypes = employmentTypes;
  employmentStatuses = employmentStatuses;
  selectedDepartments: string[] = [];
  selectedEmploymentTypes: EmploymentType[] = [];
  selectedEmploymentStatuses: EmploymentStatus[] = [];

  
  ngOnInit() {
    this.resetFilter();
    this.stateList = stateList;
  }

  ngAfterViewInit() {
    this.paginator.page.subscribe(() => {
      this.meta.pageSize = this.paginator.pageSize;
      this.meta.page = this.paginator.pageIndex + 1; 
      console.log(this.meta, this.meta)
      this.getEmployees();
    });
  }

  resetFilter(){
    this.filter = {
      search: "",
      departmentId: "",
      employmentStatus: "",
      employmentType: "",
    };
    this.getEmployees();
  }

  getEmployees(){
    this.loading = true;
    this.apiService.getAllEmployees(this.filter).subscribe({
      next: (response) => {
        console.log("response", response)
        this.employees.data = response.data.length > 0 ? response.data : [];
        this.meta.total = response.meta.total
        this.loading = false;
        console.log("employees", this.employees)
      },
      error: (error) => {
        this.toastService.show({
          title: error.error.code,
          message: error.error.message,
          icon: 'danger'
        });
        this.loading = false;
      },
    });
  }

  onSortChange(event: { active: string; direction: string }) {
    this.meta.sortBy = event.active;
    this.meta.sortDir = event.direction.toUpperCase() || 'ASC';
    console.log("this.meta sort", this.meta)
    this.getEmployees();
  }
  
  applyFilter(field: 'search' | 'departmentId' | 'employmentType', value: string) {
    this.filter[field] = value;
    this.getEmployees();
  }

  filteredCountByStatus(status: EmploymentStatus): number {
    return this.employees.data.filter(employee => employee.employmentStatus === status).length;
  }

  employmentStatusClass(status: EmploymentStatus): string {
    const classes: Record<EmploymentStatus, string> = {
      ACTIVE: 'bg-light-success text-success',
      PROBATION: 'bg-light-warning text-warning',
      SUSPENDED: 'bg-light-danger text-danger',
      RESIGNED: 'bg-light-secondary text-secondary',
      TERMINATED: 'bg-light-danger text-danger',
      RETIRED: 'bg-light-info text-info'
    };
    return classes[status];
  }
}

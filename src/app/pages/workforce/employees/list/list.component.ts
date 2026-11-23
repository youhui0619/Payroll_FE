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
import { SkeletonLoaderComponent } from '../../../../shared/components/skeleton-loader/skeleton-loader.component';
import { departments } from '../../../../data/workforce/departments.data';
import { employmentStatuses, employmentTypes } from '../../../../data/workforce/options/employment-options.data';
import type { EmploymentStatus, EmploymentType } from '../../../../models/workforce/employment-status.model';
import { EmployeesApiService } from '../../../../services/api/employees.service';
import type { EmployeeOverview } from '../../../../models/workforce/employee.model';
import { DepartmentsApiService } from '../../../../services/api/departments.service';
import { Department } from '../../../../models/workforce/department.model';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, ...MaterialImports, RouterLink, SkeletonLoaderComponent, FormsModule],
  providers: [...MaterialProviders, EmployeesApiService, DepartmentsApiService],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private apiService: EmployeesApiService,
    private departmentApiService: DepartmentsApiService,
    private toastService: ToastService
  ) {}

  loading = true;
  employees = new MatTableDataSource<EmployeeOverview>([]);
  filter: any = {};
  meta: any = {};
  stateList: any = {};



  departmentList: Department[] = [];
  employmentTypes = employmentTypes;
  employmentStatuses = employmentStatuses;
  selectedDepartments: string[] = [];
  selectedEmploymentTypes: EmploymentType[] = [];
  selectedEmploymentStatuses: EmploymentStatus[] = [];

  
  ngOnInit() {
    this.resetFilter();
    this.stateList = stateList;
    this.getDepartmentList();
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



    getDepartmentList(){
      this.loading = true;
      this.departmentApiService.getAllDepartments(null).subscribe({
        next: (response) => {
          const departments: Department[] = response?.data ?? [];
          this.departmentList = departments.filter(department => department.active);
          console.log("departmentList:", this.departmentList);
          this.loading = false
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


  initials(name: string | null | undefined) {
    return (name ?? '').split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]).join('').toUpperCase();
  }

  employmentStatusClass(status: EmploymentStatus): string {
    const classes: Record<EmploymentStatus, string> = {
      ACTIVE: 'bg-light-primary text-primary',
      PROBATION: 'bg-light-warning text-warning',
      SUSPENDED: 'bg-light-danger text-danger',
      RESIGNED: 'bg-light-secondary text-secondary',
      TERMINATED: 'bg-light-danger text-danger',
      RETIRED: 'bg-light-info text-info'
    };
    return classes[status];
  }
}

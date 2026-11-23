import { CommonModule } from '@angular/common';
import { OnInit, Component, ViewChild, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkeletonLoaderComponent } from '../../../../shared/components/skeleton-loader/skeleton-loader.component';
import { RouterLink } from '@angular/router';
import { MaterialImports, MaterialProviders } from '../../../../shared/material-imports';
import { departments } from '../../../../data/workforce/departments.data';
import { employees } from '../../../../data/workforce/employees.data';
import type { Department, DepartmentStatus } from '../../../../models/workforce/department.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastService } from '../../../../shared/components/toast/toast.service';
import { DepartmentsApiService } from '../../../../services/api/departments.service';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [...MaterialImports, CommonModule, FormsModule, RouterLink, SkeletonLoaderComponent],
  providers: [...MaterialProviders, DepartmentsApiService],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent implements OnInit, AfterViewInit {
    
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private apiService: DepartmentsApiService,
    private toastService: ToastService
  ) {}
  
  loading = true;
  departments = new MatTableDataSource<Department>([]);
  filter: any = {};
  meta: any = {};

  
  ngOnInit() {
    this.resetFilter();
  }

  ngAfterViewInit() {
    this.paginator.page.subscribe(() => {
      this.meta.pageSize = this.paginator.pageSize;
      this.meta.page = this.paginator.pageIndex + 1; 
      console.log(this.meta, this.meta)
      this.getDepartments();
    });
  }

  resetFilter(){
    this.filter = {
      search: "",
      active: null
    };
    this.getDepartments();
  }

  getDepartments(){
    this.loading = true;
    this.apiService.getAllDepartments(this.filter).subscribe({
      next: (response) => {
        console.log("response", response)
        this.departments.data = response.data.length > 0 ? response.data : [];
        this.meta.total = response.meta.total
        this.loading = false;
        console.log("departments", this.departments)
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
    this.getDepartments();
  }
  
  applyFilter(event: any) {
    const filterValue = event;
    this.filter.search = filterValue;
    console.log("this.filter.search", this.filter.search)
    this.getDepartments(); 
  }
  departmentName(parentDepartmentId: string | null): string {
    return this.departments.data.find(department => department.id === parentDepartmentId)?.name ?? '-';
  }
}

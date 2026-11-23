import { OnInit, Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonLoaderComponent } from '../../../../shared/components/skeleton-loader/skeleton-loader.component';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MaterialImports, MaterialProviders } from '../../../../shared/material-imports';
import type { Position, PositionJobLevel } from '../../../../models/workforce/position.model';
import { PositionsApiService } from '../../../../services/api/positions.service';
import { ToastService } from '../../../../shared/components/toast/toast.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DepartmentsApiService } from '../../../../services/api/departments.service';
import { Department } from '../../../../models/workforce/department.model';

@Component({
  selector: 'app-overview',
  imports: [CommonModule, FormsModule, ...MaterialImports, RouterLink, SkeletonLoaderComponent],
  providers: [...MaterialProviders, PositionsApiService, DepartmentsApiService],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent implements OnInit {
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private apiService: PositionsApiService,
    private toastService: ToastService,
    private departmentApiService: DepartmentsApiService,
  ) {}
  
  loading = true;
  departmentList: Department[] = [];
  positions = new MatTableDataSource<Position>([]);
  filter: any = {};
  meta: any = {};
  jobLevels: PositionJobLevel[] = ['ENTRY', 'INTERMEDIATE', 'SENIOR', 'LEAD', 'MANAGER', 'DIRECTOR'];
    
  ngOnInit() {
    this.getDepartmentList();
    this.resetFilter();
  }

  ngAfterViewInit() {
    this.paginator.page.subscribe(() => {
      this.meta.pageSize = this.paginator.pageSize;
      this.meta.page = this.paginator.pageIndex + 1; 
      console.log(this.meta, this.meta)
      this.getPositions();
    });
  }

  resetFilter(){
    this.filter = {
      search: "",
      departmentId: "",
      jobLevel: "",
      active: ""
    };
    this.getPositions();
  }

  getPositions(){
    this.loading = true;
    this.apiService.getAllPositions(this.filter).subscribe({
      next: (response) => {
        console.log("response", response)
        this.positions.data = response.data.length > 0 ? response.data : [];
        this.meta.total = response.meta.total
        this.loading = false;
        console.log("positions", this.positions)
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

  onSortChange(event: { active: string; direction: string }) {
    this.meta.sortBy = event.active;
    this.meta.sortDir = event.direction.toUpperCase() || 'ASC';
    console.log("this.meta sort", this.meta)
    this.getPositions();
  }

  applyFilter(field: 'search' | 'departmentId' | 'jobLevel' | 'state', value: string) {
    this.filter[field] = value;
    this.getPositions();
  }

  filteredCountByStatus(status: boolean): number {
    return this.positions.data.filter(position => position.active === status).length;
  }
}

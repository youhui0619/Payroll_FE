import { CommonModule } from '@angular/common';
import { OnInit, Component, ViewChild, AfterViewInit } from '@angular/core';
import { SkeletonLoaderComponent } from '../../../../shared/components/skeleton-loader/skeleton-loader.component';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MaterialImports, MaterialProviders } from '../../../../shared/material-imports';
import type { WorkLocation, WorkLocationType } from '../../../../models/workforce/work-location.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { WorkLocationApiService } from '../../../../services/api/work-location.service';
import { ToastService } from '../../../../shared/components/toast/toast.service';
import { stateList } from '../../../../data/other/other.data';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [...MaterialImports, FormsModule, RouterLink, SkeletonLoaderComponent, CommonModule],
  providers: [...MaterialProviders, WorkLocationApiService],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent implements OnInit, AfterViewInit {
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private apiService: WorkLocationApiService,
    private toastService: ToastService
  ) {}

  loading = true;
  workLocations = new MatTableDataSource<WorkLocation>([]);;
  locationTypes: WorkLocationType[] = ['OFFICE', 'BRANCH', 'WAREHOUSE', 'REMOTE'];
  selectedTypes: WorkLocationType[] = [];
  filter: any = {};
  meta: any = {};
  stateList: any = {};
  
  ngOnInit() {
    this.stateList = stateList;
    this.resetFilter();
  }

  ngAfterViewInit() {
    this.paginator.page.subscribe(() => {
      this.meta.pageSize = this.paginator.pageSize;
      this.meta.page = this.paginator.pageIndex + 1; 
      console.log(this.meta, this.meta)
      this.getWorkLocations();
    });
  }

  resetFilter(){
    this.filter = {
      search: "",
      type: "",
      state: "",
      active: ""
    };
    this.getWorkLocations();
  }

  getWorkLocations(){
    this.loading = true;
    this.apiService.getAllWorkLocations(this.filter).subscribe({
      next: (response) => {
        console.log("response", response)
        this.workLocations.data = response.data.length > 0 ? response.data : [];
        this.meta.total = response.meta.total
        this.loading = false;
        console.log("work locations", this.workLocations)
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
    this.getWorkLocations();
  }

  applyFilter(field: 'search' | 'type' | 'state', value: string) {
    this.filter[field] = value;
    this.getWorkLocations();
  }

  filteredCountByStatus(status: boolean): number {
    return this.workLocations.data.filter(workLocation => workLocation.active === status).length;
  }

  // countByType(type: WorkLocationType): number {
  //   return this.workLocations.filter(location => location.type === type).length;
  // }

  locationTypeLabel(type: WorkLocationType): string {
    return type.charAt(0) + type.slice(1).toLowerCase();
  }

  fullAddress(location: WorkLocation) {
    return [location.addressLine1, location.addressLine2, location.city, location.postcode, location.state, location.country]
      .filter(Boolean)
      .join(', ')
      .toLowerCase();
  }
}

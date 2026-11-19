import { CommonModule } from '@angular/common';
import { OnInit, Component, ViewChild, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkeletonLoaderComponent } from '../../../../shared/components/skeleton-loader/skeleton-loader.component';
import { RouterLink } from '@angular/router';
import { MaterialImports, MaterialProviders } from '../../../../shared/material-imports';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastService } from '../../../../shared/components/toast/toast.service';
import { ClaimTypeApiService } from '../../../../services/api/claim-type.service';
import { ClaimType } from '../../../../models/claims/claim-type.model';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [...MaterialImports, CommonModule, RouterLink, SkeletonLoaderComponent, FormsModule],
  providers: [...MaterialProviders, ClaimTypeApiService],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent implements OnInit, AfterViewInit {
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private apiService: ClaimTypeApiService,
    private toastService: ToastService
  ) {}
  
  loading = true;
  claimTypes = new MatTableDataSource<ClaimType>([]);
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
      this.getClaimTypes();
    });
  }

  resetFilter(){
    this.filter = {
      search: "",
    };
    this.getClaimTypes();
  }

  getClaimTypes(){
    this.loading = true;
    this.apiService.getAllClaimTypes(this.filter).subscribe({
      next: (response) => {
        console.log("response", response)
        this.claimTypes.data = response.data.length > 0 ? response.data : [];
        this.meta.total = response.meta.total
        this.loading = false;
        console.log("Claim Types", this.claimTypes)
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
    this.getClaimTypes();
  }
  
  applyFilter(event: any) {
    const filterValue = event;
    this.filter.search = filterValue;
    console.log("this.filter.search", this.filter.search)
    this.getClaimTypes(); 
  }


  // get activeCount(): number {
  //   return this.claimTypes.filter(item => item.status === 'ACTIVE').length;
  // }

  // get inactiveCount(): number {
  //   return this.claimTypes.filter(item => item.status === 'INACTIVE').length;
  // }
}

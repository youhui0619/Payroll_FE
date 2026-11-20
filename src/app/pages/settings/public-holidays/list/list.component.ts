import { CommonModule } from '@angular/common';
import { OnInit, Component, ViewChild, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkeletonLoaderComponent } from '../../../../shared/components/skeleton-loader/skeleton-loader.component';
import { RouterLink } from '@angular/router';
import { MaterialImports, MaterialProviders } from '../../../../shared/material-imports';
import { publicHolidays } from '../../../../data/settings/public-holidays.data';
import type { PublicHoliday } from '../../../../models/settings/public-holiday.model';
import { PublicHolidayApiService } from '../../../../services/api/public-holiday.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastService } from '../../../../shared/components/toast/toast.service';
import { stateList } from '../../../../data/other/other.data';

@Component({
  selector: 'app-list',
  imports: [CommonModule, ...MaterialImports, RouterLink, SkeletonLoaderComponent, FormsModule],
  providers: [...MaterialProviders, PublicHolidayApiService],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private apiService: PublicHolidayApiService,
    private toastService: ToastService
  ) {}

  loading = true;
  publicHolidays = new MatTableDataSource<PublicHoliday>([]);
  filter: any = {};
  meta: any = {};
  stateList: any = {};

  ngOnInit() {
    this.resetFilter();
    this.stateList = stateList;
  }

  ngAfterViewInit() {
    this.paginator.page.subscribe(() => {
      this.meta.pageSize = this.paginator.pageSize;
      this.meta.page = this.paginator.pageIndex + 1; 
      console.log(this.meta, this.meta)
      this.getPublicHolidays();
    });
  }

  resetFilter(){
    this.filter = {
      search: "",
      scope: "",
      year: new Date().getFullYear(),
      region: "",
      status: "",
    };
    this.getPublicHolidays();
  }

  getPublicHolidays(){
    this.loading = true;
    this.apiService.getAllPublicHolidays(this.filter).subscribe({
      next: (response) => {
        console.log("response", response)
        this.publicHolidays.data = response.data.length > 0 ? response.data : [];
        this.meta.total = response.meta.total
        this.loading = false;
        console.log("Public Holidays", this.publicHolidays)
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
    this.getPublicHolidays();
  }
  get years(): number[] {
    return [...new Set(
      this.publicHolidays.data.flatMap(holiday => {
        const startYear = Number(holiday.startDate.slice(0, 4));
        const endYear = Number(holiday.endDate.slice(0, 4));

        return Array.from(
          { length: endYear - startYear + 1 },
          (_, index) => startYear + index
        );
      })
    )].sort((a, b) => b - a);
  }

  applyFilter(field: 'search' | 'year' | 'scope' | 'status' | 'region', value: string | number) {
    this.filter[field] = value;
    this.getPublicHolidays();
  }

  filteredCountByStatus(status: any): number {
    return this.publicHolidays.data.filter(publicHoliday => publicHoliday.status === status).length;
  }

  getHolidayRegionTitle(holiday: PublicHoliday): string {
    return holiday.scope === 'National' ? 'All States' : holiday.regions.join(', ');
  }

  getHolidayRegionLabel(holiday: PublicHoliday): string {
    return holiday.scope === 'National'
      ? 'All States'
      : `${holiday.regions.length} states`;
  }
}

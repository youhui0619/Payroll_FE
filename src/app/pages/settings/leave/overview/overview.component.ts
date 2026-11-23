import { OnInit, Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonLoaderComponent } from '../../../../shared/components/skeleton-loader/skeleton-loader.component';
import { MaterialImports, MaterialProviders } from '../../../../shared/material-imports';
import { RouterLink } from '@angular/router';
import { leavePolicies } from '../../../../data/leave/leave-policies.data';
import type { LeavePolicy } from '../../../../models/leave/leave-policy.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastService } from '../../../../shared/components/toast/toast.service';
import { LeaveApiService } from '../../../../services/api/leave.service';
import { approvalList } from '../../../../models/leave/leave-policy.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-overview',
  imports: [...MaterialImports, CommonModule, RouterLink, SkeletonLoaderComponent, FormsModule],
  providers: [...MaterialProviders, LeaveApiService],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent implements OnInit {
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private apiService: LeaveApiService,
    private toastService: ToastService
  ) {}

  loading = true;
  leavePolicies = new MatTableDataSource<LeavePolicy>([]);
  filter: any = {};
  meta: any = {};
  approvalList = approvalList

  ngOnInit() {
    this.resetFilter();
  }

  ngAfterViewInit() {
    this.paginator.page.subscribe(() => {
      this.meta.pageSize = this.paginator.pageSize;
      this.meta.page = this.paginator.pageIndex + 1; 
      console.log(this.meta, this.meta)
      this.getLeavePolicies();
    });
  }

  resetFilter(){
    this.filter = {
      search: "",
      active: null,
      paid: null,
      approval: null,
    };
    this.getLeavePolicies();
  }

  getLeavePolicies(){
    this.loading = true;
    this.apiService.getAllLeavePolicies(this.filter).subscribe({
      next: (response) => {
        console.log("response", response)
        this.leavePolicies.data = response.data.length > 0 ? response.data : [];
        this.meta.total = response.meta.total
        this.loading = false;
        console.log("leavePolicies", this.leavePolicies)
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
    this.getLeavePolicies();
  }

  applyFilter(field: 'search' | 'paid' | 'approval' | 'active', value: string | number) {
    this.filter[field] = value;
    this.getLeavePolicies();
  }

  filteredCountByStatus(status: any): number {
    return this.leavePolicies.data.filter(leavePolicy => leavePolicy.active === status).length;
  }

  entitlementLabel(policy: LeavePolicy): string {
    if (policy.entitlementCalculationMethod === 'SERVICE') {
      return 'Based on length of service';
    }

    const unit = policy.entitlementUnit === 'DAILY' ? 'days' : 'hours';
    return `${policy.defaultEntitlement ?? 0} ${unit} per year`;
  }

  approvalName(policy: LeavePolicy): string {
    const approval = (policy as LeavePolicy & { approval?: unknown }).approval;
    const approvalRecord = approval && typeof approval === 'object'
      ? approval as unknown as Record<string, unknown>
      : null;
    const approvalValue = [
      approval,
      approvalRecord?.['value'],
      approvalRecord?.['code'],
      approvalRecord?.['approval'],
      approvalRecord?.['overflow'],
      policy.approvalOverflow
    ].find(value => typeof value === 'string' && approvalList.some(option => option.value === value.trim().toUpperCase()));
    const normalizedValue = typeof approvalValue === 'string' ? approvalValue.trim().toUpperCase() : '';

    return approvalList.find(option => option.value === normalizedValue)?.name ?? '—';
  }
  
}

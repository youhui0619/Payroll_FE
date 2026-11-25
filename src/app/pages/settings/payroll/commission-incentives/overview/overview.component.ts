import { OnInit, Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonLoaderComponent } from '../../../../../shared/components/skeleton-loader/skeleton-loader.component';
import { RouterLink } from '@angular/router';
import { MaterialImports, MaterialProviders } from '../../../../../shared/material-imports';
import { commissionIncentiveSettings } from '../../../../../data/commission/commission-incentive-settings.data';
import { departments } from '../../../../../data/workforce/departments.data';
import { employees } from '../../../../../data/workforce/employees.data';
import { positions } from '../../../../../data/workforce/positions.data';
import type {
  CommissionCalculationFrequency,
  CommissionIncentiveSetting,
  CommissionIncentiveType,
  CommissionPayoutTiming
} from '../../../../../models/commission/commission-incentive-setting.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { CommissionSettingApiService } from '../../../../../services/api/commission-setting.service';
import { ToastService } from '../../../../../shared/components/toast/toast.service';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [...MaterialImports, RouterLink, SkeletonLoaderComponent, CommonModule],
  providers: [...MaterialProviders, CommissionSettingApiService],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent implements OnInit {
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private apiService: CommissionSettingApiService,
    private toastService: ToastService,
  ) {}

  loading = true;
  commissions = new MatTableDataSource<CommissionIncentiveSetting>([]);
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
      this.getCommissions();
    });
  }

  resetFilter(){
    this.filter = {
      search: "",
      active: null
    };
    this.getCommissions();
  }

  getCommissions(){
    this.loading = true;
    this.apiService.getAllCommissionSettings(this.filter).subscribe({
      next: (response) => {
        console.log("response", response)
        this.commissions.data = response.data.length > 0 ? response.data : [];
        this.meta.total = response.meta.total
        this.loading = false;
        console.log("commissions", this.commissions)
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
    this.getCommissions();
  }

  applyFilter(field: 'search' | 'departmentId' | 'jobLevel' | 'state', value: string) {
    this.filter[field] = value;
    this.getCommissions();
  }

  filteredCountByStatus(status: boolean): number {
    return this.commissions.data.filter(commission => commission.active === status).length;
  }

  typeLabel(type: CommissionIncentiveType): string {
    const labels: Record<CommissionIncentiveType, string> = {
      SALES_COMMISSION: 'Sales Commission',
      TIERED_SALES_COMMISSION: 'Tiered Sales Commission',
      REVENUE_COMMISSION: 'Revenue Commission',
      PROFIT_COMMISSION: 'Profit-Based Commission',
      TARGET_ACHIEVEMENT: 'Sales Target Achievement Incentive',
      REFERRAL_INCENTIVE: 'Referral Incentive',
      COLLECTION_INCENTIVE: 'Payment Collection Incentive',
      PROJECT_INCENTIVE: 'Project Completion Incentive',
      TEAM_INCENTIVE: 'Team Performance Incentive',
      PRODUCT_INCENTIVE: 'Product-Specific Sales Incentive',
      CUSTOMER_ACQUISITION: 'New Customer Acquisition Incentive',
      CUSTOM: 'Other / Custom Incentive'
    };
    return labels[type];
  }

  calculationLabel(setting: CommissionIncentiveSetting): string {
    if (setting.calculationMethod === 'PERCENTAGE_OF_REVENUE') return `${setting.rate ?? 0}% of revenue`;
    if (setting.calculationMethod === 'PERCENTAGE_OF_PROFIT') return `${setting.rate ?? 0}% of profit`;
    if (['PERCENTAGE_OF_SALES', 'TIERED_RATE'].includes(setting.calculationMethod)) return `${setting.rate ?? 0}% of sales`;
    return `MYR ${setting.amount ?? 0}`;
  }

  frequencyLabel(frequency: CommissionCalculationFrequency): string {
    const labels: Record<CommissionCalculationFrequency, string> = {
      PER_TRANSACTION: 'Per transaction',
      WEEKLY: 'Weekly',
      BIWEEKLY: 'Every two weeks',
      MONTHLY: 'Monthly',
      QUARTERLY: 'Quarterly'
    };
    return labels[frequency];
  }

  payoutLabel(timing: CommissionPayoutTiming): string {
    const labels: Record<CommissionPayoutTiming, string> = {
      CURRENT_PAYROLL: 'Current payroll',
      NEXT_PAYROLL: 'Next payroll',
      SEPARATE_PAYOUT: 'Separate payout'
    };
    return labels[timing];
  }

  eligibilityLabel(setting: CommissionIncentiveSetting): string {
    if (setting.eligibleEmployees === 'ALL_EMPLOYEES') return 'All employees';

    if (setting.eligibleEmployees === 'SELECTED_DEPARTMENTS') {
      const names = setting.eligibleDepartmentIds.map(id => departments.find(department => department.id === id)?.name ?? id);
      return `${names.join(', ') || 'None selected'}`;
    }

    if (setting.eligibleEmployees === 'SELECTED_POSITIONS') {
      const titles = setting.eligiblePositionIds.map(id => positions.find(position => position.id === id)?.title ?? id);
      return `${titles.join(', ') || 'None selected'}`;
    }

    const names = setting.eligibleEmployeeIds.map(id => employees.find(employee => employee.employeeNo === id)?.name ?? id);
    return `${names.join(', ') || 'None selected'}`;
  }
}

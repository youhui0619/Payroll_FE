import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MaterialImports, MaterialProviders } from '../../../../../shared/material-imports';
import { commissionIncentiveSettings } from '../../../../../data/commission-incentive-settings';
import { departments } from '../../../../../data/departments';
import { employees } from '../../../../../data/employees';
import { positions } from '../../../../../data/positions';
import type {
  CommissionCalculationFrequency,
  CommissionIncentiveSetting,
  CommissionIncentiveType,
  CommissionPayoutTiming
} from '../../../../../models/commission-incentive-setting.model';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [...MaterialImports, CommonModule, RouterLink],
  providers: [...MaterialProviders],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent {
  readonly commissionIncentiveSettings = commissionIncentiveSettings;

  get approvalRequiredCount(): number {
    return this.commissionIncentiveSettings.filter(setting => setting.requiresApproval).length;
  }

  get allEmployeesCount(): number {
    return this.commissionIncentiveSettings.filter(setting => setting.eligibleEmployees === 'ALL_EMPLOYEES').length;
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

    const names = setting.eligibleEmployeeIds.map(id => employees.find(employee => employee.employeeId === id)?.employeeName ?? id);
    return `${names.join(', ') || 'None selected'}`;
  }
}

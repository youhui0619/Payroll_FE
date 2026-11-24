export type CommissionCalculationFrequency = 'PER_TRANSACTION' | 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY' | 'QUARTERLY';
export type CommissionPayoutTiming = 'CURRENT_PAYROLL' | 'NEXT_PAYROLL' | 'SEPARATE_PAYOUT';
export type CommissionIncentiveType =
  | 'SALES_COMMISSION'
  | 'TIERED_SALES_COMMISSION'
  | 'REVENUE_COMMISSION'
  | 'PROFIT_COMMISSION'
  | 'TARGET_ACHIEVEMENT'
  | 'REFERRAL_INCENTIVE'
  | 'COLLECTION_INCENTIVE'
  | 'PROJECT_INCENTIVE'
  | 'TEAM_INCENTIVE'
  | 'PRODUCT_INCENTIVE'
  | 'CUSTOMER_ACQUISITION'
  | 'CUSTOM';
export type CommissionCalculationMethod =
  | 'PERCENTAGE_OF_SALES'
  | 'PERCENTAGE_OF_REVENUE'
  | 'PERCENTAGE_OF_PROFIT'
  | 'FIXED_PER_TRANSACTION'
  | 'TIERED_RATE'
  | 'TARGET_BASED'
  | 'FIXED_AMOUNT';
export type CommissionEmployeeEligibility = 'ALL_EMPLOYEES' | 'SELECTED_DEPARTMENTS' | 'SELECTED_POSITIONS' | 'SELECTED_EMPLOYEES';

export interface CommissionOption<T extends string> {
  value: T;
  label: string;
}

export const commissionTypes: CommissionOption<CommissionIncentiveType>[] = [
  { value: 'SALES_COMMISSION', label: 'Sales Commission' },
  { value: 'TIERED_SALES_COMMISSION', label: 'Tiered Sales Commission' },
  { value: 'REVENUE_COMMISSION', label: 'Revenue Commission' },
  { value: 'PROFIT_COMMISSION', label: 'Profit-Based Commission' },
  { value: 'TARGET_ACHIEVEMENT', label: 'Sales Target Achievement Incentive' },
  { value: 'REFERRAL_INCENTIVE', label: 'Referral Incentive' },
  { value: 'COLLECTION_INCENTIVE', label: 'Payment Collection Incentive' },
  { value: 'PROJECT_INCENTIVE', label: 'Project Completion Incentive' },
  { value: 'TEAM_INCENTIVE', label: 'Team Performance Incentive' },
  { value: 'PRODUCT_INCENTIVE', label: 'Product-Specific Sales Incentive' },
  { value: 'CUSTOMER_ACQUISITION', label: 'New Customer Acquisition Incentive' },
  { value: 'CUSTOM', label: 'Other / Custom Incentive' }
];

export const calculationMethods: CommissionOption<CommissionCalculationMethod>[] = [
  { value: 'PERCENTAGE_OF_SALES', label: 'Percentage of Sales' },
  { value: 'PERCENTAGE_OF_REVENUE', label: 'Percentage of Revenue' },
  { value: 'PERCENTAGE_OF_PROFIT', label: 'Percentage of Profit' },
  { value: 'FIXED_PER_TRANSACTION', label: 'Fixed Amount per Transaction' },
  { value: 'TIERED_RATE', label: 'Tiered Rate' },
  { value: 'TARGET_BASED', label: 'Target-Based Calculation' },
  { value: 'FIXED_AMOUNT', label: 'Fixed Amount' }
];

export const calculationFrequencies: CommissionOption<CommissionCalculationFrequency>[] = [
  { value: 'PER_TRANSACTION', label: 'Per transaction' },
  { value: 'WEEKLY', label: 'Weekly' },
  { value: 'BIWEEKLY', label: 'Every two weeks' },
  { value: 'MONTHLY', label: 'Monthly' },
  { value: 'QUARTERLY', label: 'Quarterly' }
];

export const payoutTimings: CommissionOption<CommissionPayoutTiming>[] = [
  { value: 'CURRENT_PAYROLL', label: 'Current payroll cycle' },
  { value: 'NEXT_PAYROLL', label: 'Next payroll cycle' },
  { value: 'SEPARATE_PAYOUT', label: 'Separate payout' }
];

export const employeeEligibilityOptions: CommissionOption<CommissionEmployeeEligibility>[] = [
  { value: 'ALL_EMPLOYEES', label: 'All employees' },
  { value: 'SELECTED_DEPARTMENTS', label: 'Selected departments' },
  { value: 'SELECTED_POSITIONS', label: 'Selected positions' },
  { value: 'SELECTED_EMPLOYEES', label: 'Selected employees' }
];

export interface CommissionIncentiveSetting {
  id: string;
  code: string;
  name: string;
  commissionType: CommissionIncentiveType;
  calculationMethod: CommissionCalculationMethod;
  rate: number | null;
  amount: number | null;
  calculationFrequency: CommissionCalculationFrequency;
  payoutTiming: CommissionPayoutTiming;
  description: string;
  eligibleEmployees: CommissionEmployeeEligibility;
  eligibleDepartmentIds: string[];
  eligiblePositionIds: string[];
  eligibleEmployeeIds: string[];
  payrollEarningCode: string;
  requiresApproval: boolean;
  active: boolean;
}

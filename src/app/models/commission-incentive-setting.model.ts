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

export interface CommissionIncentiveSetting {
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
}

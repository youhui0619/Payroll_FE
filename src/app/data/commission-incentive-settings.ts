import type { CommissionIncentiveSetting } from '../models/commission-incentive-setting.model';

export const commissionIncentiveSettings: CommissionIncentiveSetting[] = [
  {
    code: 'SALES-COMM',
    name: 'Sales Commission',
    commissionType: 'REVENUE_COMMISSION',
    calculationMethod: 'PERCENTAGE_OF_REVENUE',
    rate: 5,
    amount: null,
    calculationFrequency: 'MONTHLY',
    payoutTiming: 'CURRENT_PAYROLL',
    description: 'Commission based on approved monthly sales.',
    eligibleEmployees: 'SELECTED_DEPARTMENTS',
    eligibleDepartmentIds: ['DEP-0006'],
    eligiblePositionIds: [],
    eligibleEmployeeIds: [],
    payrollEarningCode: 'COMM-SALES',
    requiresApproval: true
  },
  {
    code: 'QTR-PERF',
    name: 'Quarterly Performance Incentive',
    commissionType: 'TEAM_INCENTIVE',
    calculationMethod: 'TARGET_BASED',
    rate: null,
    amount: 500,
    calculationFrequency: 'QUARTERLY',
    payoutTiming: 'NEXT_PAYROLL',
    description: 'Fixed incentive for meeting quarterly performance targets.',
    eligibleEmployees: 'ALL_EMPLOYEES',
    eligibleDepartmentIds: [],
    eligiblePositionIds: [],
    eligibleEmployeeIds: [],
    payrollEarningCode: 'INC-QTR',
    requiresApproval: true
  },
  {
    code: 'NEW-CLIENT',
    name: 'New Client Bonus',
    commissionType: 'CUSTOMER_ACQUISITION',
    calculationMethod: 'FIXED_PER_TRANSACTION',
    rate: null,
    amount: 250,
    calculationFrequency: 'PER_TRANSACTION',
    payoutTiming: 'SEPARATE_PAYOUT',
    description: 'One-time amount for each approved new client acquisition.',
    eligibleEmployees: 'SELECTED_POSITIONS',
    eligibleDepartmentIds: [],
    eligiblePositionIds: ['POS-0010'],
    eligibleEmployeeIds: [],
    payrollEarningCode: 'COMM-NEW',
    requiresApproval: true
  }
];

export type PayrollFrequency = 'WEEKLY' | 'BIWEEKLY' | 'SEMIMONTHLY' | 'MONTHLY';
export type PayrollDay = number | 'LAST_DAY';
export type PayrollProrationMethod = 'CALENDAR_DAYS' | 'FIXED_26_DAYS' | 'WORKING_DAYS';
export type DeductionProrationMethod = PayrollProrationMethod | 'FOLLOW_SALARY_PRORATION';
export type PayrollPaymentMethod = 'BANK_TRANSFER' | 'CASH' | 'OTHER';
export type PayrollApprovalWorkflow = 'ONE_APPROVER' | 'TWO_STEP';

export interface PayrollSettings {
  payrollFrequency: PayrollFrequency;
  payrollCutoffDay: PayrollDay;
  scheduledPayDate: PayrollDay;
  currency: 'MYR';
  salaryProrationMethod: PayrollProrationMethod;
  calculationPrecision: 2 | 3;
  includeBasicSalary: boolean;
  includeOvertime: boolean;
  includeAllowances: boolean;
  includeBonus: boolean;
  includeCommissionAndIncentives: boolean;
  deductionProrationMethod: DeductionProrationMethod;
  enableEpf: boolean;
  enableSocso: boolean;
  enableEis: boolean;
  enablePcb: boolean;
  enableHrdCorpLevy: boolean;
  paymentMethod: PayrollPaymentMethod;
  automaticallyCalculatePayroll: boolean;
  blockApprovalOnValidationErrors: boolean;
  lockAfterFinalApproval: boolean;
  notifyApprovers: boolean;
  approvalWorkflow: PayrollApprovalWorkflow;
}

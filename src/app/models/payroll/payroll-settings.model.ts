export type PayrollFrequency = 'WEEKLY' | 'BIWEEKLY' | 'SEMIMONTHLY' | 'MONTHLY';
export type PayrollDay = number | 'LAST_DAY';
export type PayrollProrationMethod = 'CALENDAR_DAYS' | 'FIXED_26_DAYS' | 'WORKING_DAYS';
export type DeductionProrationMethod = PayrollProrationMethod | 'FOLLOW_SALARY_PRORATION';
export type PayrollPaymentMethod = 'BANK_TRANSFER' | 'CASH' | 'OTHER';
export type PayrollApprovalWorkflow = 'ONE_APPROVER' | 'TWO_STEP';
export type PayrollMinimumOvertimeDuration = 'NONE' | '15_MINUTES' | '30_MINUTES' | '60_MINUTES';

export interface PayrollOption<T extends string | number> {
  value: T;
  label: string;
}

export const payrollFrequencyOptions: PayrollOption<PayrollFrequency>[] = [
  { value: 'WEEKLY', label: 'Weekly' },
  { value: 'BIWEEKLY', label: 'Every two weeks' },
  { value: 'SEMIMONTHLY', label: 'Twice a month' },
  { value: 'MONTHLY', label: 'Monthly' }
];

const dayOrdinal = (day: number): string => {
  const lastTwoDigits = day % 100;
  const suffix = lastTwoDigits >= 11 && lastTwoDigits <= 13
    ? 'th'
    : day % 10 === 1
      ? 'st'
      : day % 10 === 2
        ? 'nd'
        : day % 10 === 3
          ? 'rd'
          : 'th';
  return `${day}${suffix}`;
};

export const payrollCutoffDayOptions: PayrollOption<PayrollDay>[] = [
  ...Array.from({ length: 31 }, (_, index) => ({ value: index + 1, label: String(index + 1) })),
  { value: 'LAST_DAY', label: 'Last day of the month' }
];

export const scheduledPayDateOptions: PayrollOption<PayrollDay>[] = [
  ...Array.from({ length: 31 }, (_, index) => ({
    value: index + 1,
    label: `${dayOrdinal(index + 1)} of each month`
  })),
  { value: 'LAST_DAY', label: 'Last day of the month' }
];

export const payrollCurrencyOptions: PayrollOption<'MYR'>[] = [
  { value: 'MYR', label: 'RM — Malaysian Ringgit' }
];

export const salaryProrationMethodOptions: PayrollOption<PayrollProrationMethod>[] = [
  { value: 'CALENDAR_DAYS', label: 'Calendar days in month' },
  { value: 'FIXED_26_DAYS', label: 'Fixed 26-day basis' },
  { value: 'WORKING_DAYS', label: 'Working days in month' }
];

export const calculationPrecisionOptions: PayrollOption<2 | 3>[] = [
  { value: 2, label: '2 decimal places' },
  { value: 3, label: '3 decimal places' }
];

export const deductionProrationMethodOptions: PayrollOption<DeductionProrationMethod>[] = [
  { value: 'CALENDAR_DAYS', label: 'Calendar-day basis' },
  { value: 'WORKING_DAYS', label: 'Working-day basis' },
  { value: 'FOLLOW_SALARY_PRORATION', label: 'Follow salary proration method' }
];

export const paymentMethodOptions: PayrollOption<PayrollPaymentMethod>[] = [
  { value: 'BANK_TRANSFER', label: 'Bank transfer' },
  { value: 'CASH', label: 'Cash' },
  { value: 'OTHER', label: 'Other' }
];

export const approvalWorkflowOptions: PayrollOption<PayrollApprovalWorkflow>[] = [
  { value: 'ONE_APPROVER', label: 'One approver' },
  { value: 'TWO_STEP', label: 'Two-step approval — reviewer and final approver' }
];

export const minimumOvertimeDurationOptions: PayrollOption<PayrollMinimumOvertimeDuration>[] = [
  { value: 'NONE', label: 'No minimum' },
  { value: '15_MINUTES', label: '15 minutes' },
  { value: '30_MINUTES', label: '30 minutes' },
  { value: '60_MINUTES', label: '60 minutes' }
];

export interface PayrollSetting {
  payrollFrequency: PayrollFrequency;
  payrollCutoffDay: PayrollDay;
  scheduledPayDate: PayrollDay;
  currency: 'MYR';
  salaryProrationMethod: PayrollProrationMethod;
  calculationPrecision: 2 | 3;
  includeBasicSalary: boolean;
  includeOvertime: boolean;
  includeClaimsAndAllowance: boolean;
  includeBonus: boolean;
  includeCommissionAndIncentives: boolean;
  standardWorkingHoursPerDay: number | null;
  minimumOvertimeDuration: PayrollMinimumOvertimeDuration;
  normalWorkingDayMultiplier: number | null;
  normalWorkingDayEarningCode: string;
  configureRestDayRates: boolean;
  restDayOvertimeMultiplier: number | null;
  restDayEarningCode: string;
  configurePublicHolidayRates: boolean;
  publicHolidayOvertimeMultiplier: number | null;
  publicHolidayEarningCode: string;
  deductionProrationMethod: DeductionProrationMethod;
  includeEpf: boolean;
  includeSocso: boolean;
  includeEis: boolean;
  includePcb: boolean;
  includeHrdCorpLevy: boolean;
  paymentMethod: PayrollPaymentMethod;
  automaticallyCalculatePayroll: boolean;
  blockApprovalOnValidationErrors: boolean;
  lockAfterFinalApproval: boolean;
  notifyApprovers: boolean;
  approvalWorkflow: PayrollApprovalWorkflow;
}

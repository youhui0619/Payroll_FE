import type {
  CommissionCalculationFrequency,
  CommissionCalculationMethod,
  CommissionPayoutTiming
} from './commission-incentive-setting.model';

export type CommissionPayrollRecordStatus = 'PENDING_APPROVAL' | 'READY_FOR_PAYROLL' | 'PAID';

export interface CommissionPayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  planCode: string;
  planName: string;
  payrollEarningCode: string;
  calculationMethod: CommissionCalculationMethod;
  calculationFrequency: CommissionCalculationFrequency;
  payoutTiming: CommissionPayoutTiming;
  calculationBasis: number | null;
  rate: number | null;
  amount: number;
  referenceId: string;
  notes: string;
  createdDate: string;
  approvedBy: string | null;
  approvedAt: string | null;
  approvalComment: string;
  status: CommissionPayrollRecordStatus;
}

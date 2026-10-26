import { employees } from './employees';
import { commissionIncentiveSettings } from './commission-incentive-settings';
import type { CommissionPayrollRecord } from '../models/commission-payroll-record.model';

function record(
  id: string,
  employeeId: string,
  planCode: string,
  calculationBasis: number | null,
  amount: number,
  referenceId: string,
  notes: string,
  createdDate: string,
  status: CommissionPayrollRecord['status'],
  approvedBy: string | null,
  approvedAt: string | null,
  approvalComment: string
): CommissionPayrollRecord {
  const employee = employees.find(item => item.employeeId === employeeId);
  const plan = commissionIncentiveSettings.find(item => item.code === planCode);
  if (!employee || !plan) throw new Error(`Commission record ${id} references a missing employee or plan.`);

  return {
    id,
    employeeId,
    employeeName: employee.employeeName,
    planCode: plan.code,
    planName: plan.name,
    payrollEarningCode: plan.payrollEarningCode,
    calculationMethod: plan.calculationMethod,
    calculationFrequency: plan.calculationFrequency,
    payoutTiming: plan.payoutTiming,
    calculationBasis,
    rate: plan.rate,
    amount,
    referenceId,
    notes,
    createdDate,
    approvedBy,
    approvedAt,
    approvalComment,
    status
  };
}

export const commissionPayrollRecords: CommissionPayrollRecord[] = [
  record('CPR-0001', 'EMP-0046', 'SALES-COMM', 24000, 1200, 'INV-2026-1046', 'Monthly revenue commission.', '2026-10-02', 'PENDING_APPROVAL', null, null, 'Awaiting manager review.'),
  record('CPR-0002', 'EMP-0046', 'NEW-CLIENT', null, 250, 'CLIENT-ACQ-046', 'New customer acquisition bonus.', '2026-10-05', 'READY_FOR_PAYROLL', 'Sarah Lim', '2026-10-06T09:30:00', 'Verified against the new client onboarding record.'),
  record('CPR-0003', 'EMP-0042', 'QTR-PERF', null, 500, 'QTR-TARGET-FIN', 'Quarterly team target incentive.', '2026-10-08', 'PENDING_APPROVAL', null, null, 'Awaiting department head approval.'),
  record('CPR-0004', 'EMP-0043', 'QTR-PERF', null, 500, 'QTR-TARGET-OPS', 'Quarterly team target incentive.', '2026-10-09', 'PAID', 'Daniel Tan', '2026-10-10T14:15:00', 'Approved after confirming the quarterly target was met.'),
  record('CPR-0005', 'EMP-0047', 'QTR-PERF', null, 500, 'QTR-TARGET-MKT', 'Quarterly team target incentive.', '2026-10-10', 'READY_FOR_PAYROLL', 'Sarah Lim', '2026-10-11T11:00:00', 'Target achievement confirmed by the marketing lead.')
];

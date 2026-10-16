import type { EmployeeLeaveBalances } from '../models/leave.model';

export const leaveBalancesByEmployee: Record<string, EmployeeLeaveBalances> = {
  'EMP-0042': {
    annual: { entitled: 13, taken: 2.5, balance: 10.5 },
    medical: { entitled: 14, taken: 1, balance: 13 }
  },
  'EMP-0043': {
    annual: { entitled: 8, taken: 5.5, balance: 2.5 },
    medical: { entitled: 14, taken: 8, balance: 6 }
  }
};

export function getEmployeeLeaveBalances(employeeId: string): EmployeeLeaveBalances {
  const balances = leaveBalancesByEmployee[employeeId];
  if (!balances) {
    throw new Error(`Leave balances not found for employee: ${employeeId}`);
  }
  return balances;
}

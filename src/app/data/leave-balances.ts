import type { EmployeeLeaveBalances, EmployeeLeaveEntitlements } from '../models/leave.model';

export const defaultLeaveEntitlements: EmployeeLeaveEntitlements = {
  annual: { amount: 14, period: 'year' },
  medical: { amount: 2, period: 'month' }
};

export const leaveBalancesByEmployee: Record<string, EmployeeLeaveBalances> = {
  'EMP-0042': {
    annual: { entitled: 13, taken: 2.5, balance: 10.5 },
    medical: { entitled: 14, taken: 1, balance: 13 }
  },
  'EMP-0043': {
    annual: { entitled: 8, taken: 5.5, balance: 2.5 },
    medical: { entitled: 14, taken: 8, balance: 6 }
  },
  'EMP-0044': {
    annual: { entitled: 14, taken: 0, balance: 14 },
    medical: { entitled: 24, taken: 0, balance: 24 }
  },
  'EMP-0045': {
    annual: { entitled: 14, taken: 0, balance: 14 },
    medical: { entitled: 24, taken: 0, balance: 24 }
  },
  'EMP-0046': {
    annual: { entitled: 14, taken: 0, balance: 14 },
    medical: { entitled: 24, taken: 0, balance: 24 }
  },
  'EMP-0047': {
    annual: { entitled: 14, taken: 0, balance: 14 },
    medical: { entitled: 24, taken: 0, balance: 24 }
  },
  'EMP-0048': {
    annual: { entitled: 14, taken: 0, balance: 14 },
    medical: { entitled: 24, taken: 0, balance: 24 }
  },
  'EMP-0049': {
    annual: { entitled: 14, taken: 0, balance: 14 },
    medical: { entitled: 24, taken: 0, balance: 24 }
  },
  'EMP-0050': {
    annual: { entitled: 14, taken: 0, balance: 14 },
    medical: { entitled: 24, taken: 0, balance: 24 }
  },
  'EMP-0051': {
    annual: { entitled: 14, taken: 0, balance: 14 },
    medical: { entitled: 24, taken: 0, balance: 24 }
  }
};

export function getEmployeeLeaveBalances(employeeId: string): EmployeeLeaveBalances {
  return leaveBalancesByEmployee[employeeId] ?? {
    annual: {
      entitled: defaultLeaveEntitlements.annual.amount ?? 0,
      taken: 0,
      balance: defaultLeaveEntitlements.annual.amount ?? 0
    },
    medical: {
      entitled: (defaultLeaveEntitlements.medical.amount ?? 0) * 12,
      taken: 0,
      balance: (defaultLeaveEntitlements.medical.amount ?? 0) * 12
    }
  };
}

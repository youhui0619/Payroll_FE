import { payrollList } from './payroll';
import type { Payslip } from '../models/payslip.model';

const company = {
  name: 'SHUNYI MACHINERY TRADING (M) PLT',
  registrationNumber: '202104001594',
  llpNumber: 'LLP0028223-LGN',
  address: 'No 12, Jalan Bukit Kempas 1/18, Taman Bukit Kempas, 81200 Johor Bahru, Johor.'
};

const leaveByEmployee: Record<string, Payslip['leaveBalances']> = {
  'EMP-0042': {
    annual: { available: 13, granted: 0, taken: 0, carriedForward: 13 },
    medical: { available: 5.5, granted: 0, taken: 0, carriedForward: 5.5 }
  },
  'EMP-0043': {
    annual: { available: 8, granted: 0, taken: 0, carriedForward: 8 },
    medical: { available: 10, granted: 0, taken: 0, carriedForward: 10 }
  }
};

export const payslips: Payslip[] = payrollList.map((row) => {
  const deductions = {
    epf: row.epf.employee,
    socso: row.socso.employee,
    lindungan24Jam: row.socso.lindungan24Jam,
    eis: row.eis.employee,
    pcb: row.pcb,
    advance: row.advance,
    other: row.deduction
  };

  return {
    employeeId: row.employeeId,
    period: 'Sep 2026',
    status: 'Paid',
    company,
    employee: {
      name: row.employee,
      id: row.employeeId,
      position: row.position,
      department: row.department,
      epfMembershipNumber: row.employeeId,
      gender: row.employeeId === 'EMP-0042' ? 'Female' : 'Male'
    },
    leaveBalances: leaveByEmployee[row.employeeId],
    earnings: {
      basicPay: row.basicPay,
      unpaidLeave: 0,
      overtime: row.overtime,
      allowance: row.allowance,
      bonus: row.bonus,
      grossPay: row.grossPay
    },
    deductions: {
      ...deductions,
      total: Object.values(deductions).reduce((sum, amount) => sum + amount, 0)
    },
    employerContributions: {
      epf: row.epf.employer,
      socso: row.socso.employer,
      eis: row.eis.employer
    },
    contributionBases: {
      epf: row.basicPay,
      perkeso: row.grossPay
    },
    netPay: row.netPay,
    paymentMethod: 'Transfer by bank'
  };
});

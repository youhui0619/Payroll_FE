import { payrollList } from './payroll';
import { getEmployee } from './employees';
import { getEmployeeLeaveBalances } from './leave-balances';
import type { Payslip } from '../models/payslip.model';

const company = {
  name: 'SHUNYI MACHINERY TRADING (M) PLT',
  registrationNumber: '202104001594',
  llpNumber: 'LLP0028223-LGN',
  address: 'No 12, Jalan Bukit Kempas 1/18, Taman Bukit Kempas, 81200 Johor Bahru, Johor.'
};

export const payslips: Payslip[] = payrollList.map((row) => {
  const employee = getEmployee(row.employeeId);
  const balances = getEmployeeLeaveBalances(row.employeeId);
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
      name: employee.employeeName,
      id: employee.employeeId,
      position: employee.position,
      department: employee.department,
      epfMembershipNumber: employee.epfEmployeeNo,
      gender: employee.gender
    },
    leaveBalances: {
      annual: {
        available: balances.annual.balance,
        granted: balances.annual.entitled,
        taken: balances.annual.taken,
        carriedForward: balances.annual.balance
      },
      medical: {
        available: balances.medical.balance,
        granted: balances.medical.entitled,
        taken: balances.medical.taken,
        carriedForward: balances.medical.balance
      }
    },
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
    paymentMethod: employee.paymentMethod
  };
});

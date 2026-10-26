import { payrollList } from './payroll';
import { getEmployee } from './employees';
import { getEmployeeLeaveBalances } from './leave-balances';
import { leaveApplications } from './leave-applications';
import { claims } from './claims';
import { commissionPayrollRecords } from './commission-payroll-records';
import type { Payslip } from '../models/payslip.model';

const company = {
  name: 'SHUNYI MACHINERY TRADING (M) PLT',
  registrationNumber: '202104001594',
  llpNumber: 'LLP0028223-LGN',
  address: 'No 12, Jalan Bukit Kempas 1/18, Taman Bukit Kempas, 81200 Johor Bahru, Johor.'
};

const payslipPeriod = 'Oct 2026';
const payslipPeriodKey = '2026-10';
const payslipPeriodEnd = new Date('2026-10-31T23:59:59');

function applicationDate(dateRange: string): Date | null {
  const firstDate = dateRange.split(' ~ ')[0];
  const [day, month, year] = firstDate.split('/').map(Number);
  if (!day || !month || !year) return null;
  return new Date(year, month - 1, day);
}

function leaveDaysTaken(employeeId: string, leaveType: 'annual' | 'medical'): number {
  return leaveApplications
    .filter(item => {
      const typeMatches = leaveType === 'annual'
        ? item.leaveType.toLowerCase().includes('annual')
        : item.leaveType.toLowerCase().includes('medical');
      const date = applicationDate(item.dateRange);
      return item.employeeId === employeeId
        && typeMatches
        && item.status === 'Approved'
        && date !== null
        && date <= payslipPeriodEnd;
    })
    .reduce((total, item) => total + (Number.parseFloat(item.daysTaken) || 0), 0);
}

export const payslips: Payslip[] = payrollList.map((row) => {
  const employee = getEmployee(row.employeeId);
  const balances = getEmployeeLeaveBalances(row.employeeId);
  const annualTaken = leaveDaysTaken(row.employeeId, 'annual');
  const medicalTaken = leaveDaysTaken(row.employeeId, 'medical');
  const commissionItems = commissionPayrollRecords
    .filter(item => item.employeeId === row.employeeId
      && item.status === 'PAID'
      && item.payoutTiming !== 'SEPARATE_PAYOUT'
      && item.createdDate.startsWith(payslipPeriodKey));
  const commissionTotal = commissionItems.reduce((total, item) => total + item.amount, 0);
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
    period: payslipPeriod,
    status: 'Paid',
    leaveReferences: leaveApplications.filter(item => {
      const [day, month, year] = item.dateRange.split(' ~ ')[0].split('/');
      return item.employeeId === row.employeeId && `${year}-${month}` === payslipPeriodKey;
    }).map(item => item.reference),
    claimReferences: claims.filter(item =>
      item.employeeId === row.employeeId && item.claimDate.startsWith(payslipPeriodKey)
    ).map(item => item.id),
    commissionReferences: commissionItems.map(item => item.id),
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
        available: Math.max(0, balances.annual.entitled - annualTaken),
        granted: balances.annual.entitled,
        taken: annualTaken,
        carriedForward: Math.max(0, balances.annual.entitled - annualTaken)
      },
      medical: {
        available: Math.max(0, balances.medical.entitled - medicalTaken),
        granted: balances.medical.entitled,
        taken: medicalTaken,
        carriedForward: Math.max(0, balances.medical.entitled - medicalTaken)
      }
    },
    earnings: {
      basicPay: row.basicPay,
      unpaidLeave: 0,
      overtime: row.overtime,
      allowance: row.allowance,
      bonus: row.bonus,
      commissions: commissionTotal,
      commissionItems,
      grossPay: row.grossPay + commissionTotal
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
    netPay: row.netPay + commissionTotal,
    paymentMethod: employee.paymentMethod
  };
});

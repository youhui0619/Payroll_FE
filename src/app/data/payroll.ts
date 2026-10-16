import { employees } from './employees';

const payrollAmounts = [
  {
    employeeId: 'EMP-0042',
    basicPay: 4500,
    overtime: 320,
    deduction: 100,
    allowance: 250,
    bonus: 500,
    grossPay: 5570,
    epf: { employer: 668.4, employee: 612.7, total: 1281.1 },
    socso: { employer: 27.25, employee: 9.75, lindungan24Jam: 0, total: 37 },
    eis: { employer: 11.15, employee: 11.15, total: 22.3 },
    pcb: 180,
    advance: 0,
    netPay: 4756.4
  },
  {
    employeeId: 'EMP-0043',
    basicPay: 5200,
    overtime: 180,
    deduction: 50,
    allowance: 300,
    bonus: 0,
    grossPay: 5630,
    epf: { employer: 675.6, employee: 619.3, total: 1294.9 },
    socso: { employer: 27.25, employee: 9.75, lindungan24Jam: 0, total: 37 },
    eis: { employer: 11.25, employee: 11.25, total: 22.5 },
    pcb: 210,
    advance: 100,
    netPay: 4679.7
  }
];

export const payrollList = payrollAmounts.map(row => {
  const employee = employees.find(record => record.employeeId === row.employeeId);
  if (!employee) {
    throw new Error(`Employee not found for payroll record: ${row.employeeId}`);
  }

  return {
    ...row,
    employee: employee.employeeName,
    initials: employee.initials,
    department: employee.department,
    position: employee.position
  };
});

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
  },
  {
    employeeId: 'EMP-0044',
    basicPay: 4200,
    overtime: 150,
    deduction: 50,
    allowance: 200,
    bonus: 0,
    grossPay: 4500,
    epf: { employer: 546, employee: 462, total: 1008 },
    socso: { employer: 27.25, employee: 9.75, lindungan24Jam: 0, total: 37 },
    eis: { employer: 8.4, employee: 8.4, total: 16.8 },
    pcb: 100,
    advance: 0,
    netPay: 3919.85
  },
  {
    employeeId: 'EMP-0045',
    basicPay: 4800,
    overtime: 80,
    deduction: 0,
    allowance: 150,
    bonus: 200,
    grossPay: 5230,
    epf: { employer: 624, employee: 528, total: 1152 },
    socso: { employer: 27.25, employee: 9.75, lindungan24Jam: 0, total: 37 },
    eis: { employer: 9.6, employee: 9.6, total: 19.2 },
    pcb: 150,
    advance: 100,
    netPay: 4432.65
  },
  {
    employeeId: 'EMP-0046',
    basicPay: 4000,
    overtime: 250,
    deduction: 100,
    allowance: 150,
    bonus: 250,
    grossPay: 4550,
    epf: { employer: 520, employee: 440, total: 960 },
    socso: { employer: 27.25, employee: 9.75, lindungan24Jam: 0, total: 37 },
    eis: { employer: 8, employee: 8, total: 16 },
    pcb: 120,
    advance: 0,
    netPay: 3972.25
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

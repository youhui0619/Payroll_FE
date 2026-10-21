import type { ExpenseClaimRecord } from '../models/claim.model';

export const claims: ExpenseClaimRecord[] = [
  {
    id: 'CLM-0001',
    claimDate: '2026-10-02',
    employeeId: 'EMP-0042',
    employeeName: 'Aisyah Nur Abdullah',
    departmentId: 'DEP-0002',
    departmentName: 'Finance',
    claimType: 'TRAVEL',
    description: 'Taxi fare for a client meeting.',
    amount: 48.5,
    currency: 'MYR',
    paymentMethod: 'PAYROLL',
    supportingDocuments: ['taxi-receipt.pdf'],
    status: 'Pending',
    submittedAt: '2026-10-03T09:15:00.000Z'
  },
  {
    id: 'CLM-0002',
    claimDate: '2026-10-05',
    employeeId: 'EMP-0043',
    employeeName: 'Daniel Lim Wei Jian',
    departmentId: 'DEP-0003',
    departmentName: 'Operations',
    claimType: 'MEALS',
    description: 'Meal during an approved site visit.',
    amount: 32,
    currency: 'MYR',
    paymentMethod: 'BANK_TRANSFER',
    supportingDocuments: ['meal-receipt.pdf'],
    status: 'Approved',
    submittedAt: '2026-10-06T03:40:00.000Z'
  },
  {
    id: 'CLM-0003',
    claimDate: '2026-10-08',
    employeeId: 'EMP-0045',
    employeeName: 'Kelvin Wong Jun Kai',
    departmentId: 'DEP-0005',
    departmentName: 'Information Technology',
    claimType: 'COMMUNICATION',
    description: 'Mobile data used for on-call support.',
    amount: 60,
    currency: 'MYR',
    paymentMethod: 'PAYROLL',
    supportingDocuments: ['mobile-bill.pdf'],
    status: 'Paid',
    submittedAt: '2026-10-09T02:10:00.000Z'
  }
];

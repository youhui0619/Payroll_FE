import type { OvertimeRequestRecord } from '../models/overtime.model';

export const overtimeRequests: OvertimeRequestRecord[] = [
  {
    id: 'OT-2026-0001',
    requestDate: '2026-10-05',
    overtimeDate: '2026-10-03',
    employeeId: 'EMP-0043',
    employeeName: 'Daniel Lim Wei Jian',
    departmentId: 'DEP-0003',
    departmentName: 'Operations',
    overtimeType: 'NORMAL_WORKING_DAY',
    startTime: '18:00',
    endTime: '21:00',
    totalMinutes: 180,
    breakDurationMinutes: 30,
    netMinutes: 150,
    hourlyRateMultiplier: 1.5,
    earningCode: 'OT',
    description: 'Completed the month-end operations report.',
    supportingDocuments: ['month-end-report.pdf'],
    status: 'Pending',
    submittedAt: '2026-10-05T09:20:00.000Z',
    approval: { approver: '-', approvedDate: null, comments: '' }
  },
  {
    id: 'OT-2026-0002',
    requestDate: '2026-10-12',
    overtimeDate: '2026-10-11',
    employeeId: 'EMP-0045',
    employeeName: 'Kelvin Wong Jun Kai',
    departmentId: 'DEP-0005',
    departmentName: 'Information Technology',
    overtimeType: 'REST_DAY',
    startTime: '09:00',
    endTime: '13:00',
    totalMinutes: 240,
    breakDurationMinutes: 0,
    netMinutes: 240,
    hourlyRateMultiplier: 2,
    earningCode: 'OT-REST',
    description: 'Provided scheduled system migration support.',
    supportingDocuments: ['migration-support-log.pdf'],
    status: 'Approved',
    submittedAt: '2026-10-12T02:15:00.000Z',
    approval: { approver: 'Sarah Lim', approvedDate: '2026-10-13', comments: 'Approved.' }
  }
];

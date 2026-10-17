import type { LeaveRecord } from '../models/leave.model';

export const attendanceRecords: LeaveRecord[] = [
  {
    employeeId: 'EMP-0042',
    startDate: '2026-10-14',
    endDate: '2026-10-14',
    leaveType: 'Medical Leave',
    code: 'MC',
    typeClass: 'medical',
    status: 'Approved',
    reason: 'Recovering from a seasonal illness.',
    approval: {
      approver: 'Farah Rahman',
      status: 'Approved',
      comments: 'Medical certificate received and verified.',
      approvedDate: '2026-10-13'
    }
  },
  {
    employeeId: 'EMP-0043',
    startDate: '2026-10-15',
    endDate: '2026-10-16',
    leaveType: 'Annual Leave',
    code: 'AL',
    typeClass: 'annual',
    status: 'Approved',
    reason: 'Family vacation.',
    approval: {
      approver: 'Farah Rahman',
      status: 'Approved',
      comments: 'Approved as requested.',
      approvedDate: '2026-10-10'
    }
  },
  {
    employeeId: 'EMP-0042',
    startDate: '2026-10-16',
    endDate: '2026-10-16',
    leaveType: 'Emergency Leave',
    code: 'EL',
    typeClass: 'emergency',
    status: 'Pending',
    reason: 'Urgent family matter.',
    approval: {
      approver: 'Pending assignment',
      status: 'Pending',
      comments: 'Awaiting manager review.',
      approvedDate: null
    }
  },
  {
    employeeId: 'EMP-0044', startDate: '2026-10-02', endDate: '2026-10-02', leaveType: 'Annual Leave', code: 'AL', typeClass: 'annual', status: 'Approved', reason: 'Personal appointment.',
    approval: { approver: 'Farah Rahman', status: 'Approved', comments: 'Approved.', approvedDate: '2026-09-28' }
  },
  {
    employeeId: 'EMP-0045', startDate: '2026-10-05', endDate: '2026-10-05', leaveType: 'Medical Leave', code: 'MC', typeClass: 'medical', status: 'Approved', reason: 'Medical consultation.',
    approval: { approver: 'Farah Rahman', status: 'Approved', comments: 'Medical certificate verified.', approvedDate: '2026-10-05' }
  },
  {
    employeeId: 'EMP-0046', startDate: '2026-10-06', endDate: '2026-10-07', leaveType: 'Annual Leave', code: 'AL', typeClass: 'annual', status: 'Approved', reason: 'Family visit out of town.',
    approval: { approver: 'Daniel Lim', status: 'Approved', comments: 'Approved as requested.', approvedDate: '2026-09-30' }
  },
  {
    employeeId: 'EMP-0047', startDate: '2026-10-07', endDate: '2026-10-07', leaveType: 'Emergency Leave', code: 'EL', typeClass: 'emergency', status: 'Pending', reason: 'Urgent home repair.',
    approval: { approver: 'Daniel Lim', status: 'Pending', comments: 'Awaiting manager review.', approvedDate: null }
  },
  {
    employeeId: 'EMP-0048', startDate: '2026-10-08', endDate: '2026-10-09', leaveType: 'Annual Leave', code: 'AL', typeClass: 'annual', status: 'Approved', reason: 'Short family break.',
    approval: { approver: 'Farah Rahman', status: 'Approved', comments: 'Approved.', approvedDate: '2026-10-01' }
  },
  {
    employeeId: 'EMP-0049', startDate: '2026-10-09', endDate: '2026-10-09', leaveType: 'Medical Leave', code: 'MC', typeClass: 'medical', status: 'Approved', reason: 'Rest advised by doctor.',
    approval: { approver: 'Farah Rahman', status: 'Approved', comments: 'Medical certificate received.', approvedDate: '2026-10-09' }
  },
  {
    employeeId: 'EMP-0050', startDate: '2026-10-12', endDate: '2026-10-13', leaveType: 'Annual Leave', code: 'AL', typeClass: 'annual', status: 'Approved', reason: 'Attending a family event.',
    approval: { approver: 'Daniel Lim', status: 'Approved', comments: 'Approved as requested.', approvedDate: '2026-10-02' }
  },
  {
    employeeId: 'EMP-0051', startDate: '2026-10-13', endDate: '2026-10-13', leaveType: 'Emergency Leave', code: 'EL', typeClass: 'emergency', status: 'Rejected', reason: 'Personal matter.',
    approval: { approver: 'Daniel Lim', status: 'Rejected', comments: 'Please submit under annual leave.', approvedDate: '2026-10-12' }
  },
  {
    employeeId: 'EMP-0042', startDate: '2026-10-19', endDate: '2026-10-20', leaveType: 'Annual Leave', code: 'AL', typeClass: 'annual', status: 'Approved', reason: 'Planned personal time off.',
    approval: { approver: 'Farah Rahman', status: 'Approved', comments: 'Approved as requested.', approvedDate: '2026-10-12' }
  },
  {
    employeeId: 'EMP-0044', startDate: '2026-10-20', endDate: '2026-10-20', leaveType: 'Medical Leave', code: 'MC', typeClass: 'medical', status: 'Pending', reason: 'Follow-up medical appointment.',
    approval: { approver: 'Farah Rahman', status: 'Pending', comments: 'Awaiting medical certificate.', approvedDate: null }
  },
  {
    employeeId: 'EMP-0045', startDate: '2026-10-21', endDate: '2026-10-22', leaveType: 'Annual Leave', code: 'AL', typeClass: 'annual', status: 'Approved', reason: 'Family holiday.',
    approval: { approver: 'Daniel Lim', status: 'Approved', comments: 'Approved.', approvedDate: '2026-10-08' }
  },
  {
    employeeId: 'EMP-0046', startDate: '2026-10-23', endDate: '2026-10-23', leaveType: 'Emergency Leave', code: 'EL', typeClass: 'emergency', status: 'Pending', reason: 'Urgent family commitment.',
    approval: { approver: 'Daniel Lim', status: 'Pending', comments: 'Awaiting manager review.', approvedDate: null }
  },
  {
    employeeId: 'EMP-0047', startDate: '2026-10-26', endDate: '2026-10-27', leaveType: 'Annual Leave', code: 'AL', typeClass: 'annual', status: 'Approved', reason: 'Personal travel.',
    approval: { approver: 'Farah Rahman', status: 'Approved', comments: 'Approved as requested.', approvedDate: '2026-10-14' }
  },
  {
    employeeId: 'EMP-0048', startDate: '2026-10-28', endDate: '2026-10-28', leaveType: 'Medical Leave', code: 'MC', typeClass: 'medical', status: 'Approved', reason: 'Medical rest.',
    approval: { approver: 'Farah Rahman', status: 'Approved', comments: 'Medical certificate verified.', approvedDate: '2026-10-28' }
  },
  {
    employeeId: 'EMP-0049', startDate: '2026-10-29', endDate: '2026-10-30', leaveType: 'Annual Leave', code: 'AL', typeClass: 'annual', status: 'Approved', reason: 'Visiting relatives.',
    approval: { approver: 'Daniel Lim', status: 'Approved', comments: 'Approved.', approvedDate: '2026-10-15' }
  },
  {
    employeeId: 'EMP-0050', startDate: '2026-10-30', endDate: '2026-10-30', leaveType: 'Emergency Leave', code: 'EL', typeClass: 'emergency', status: 'Pending', reason: 'Urgent personal matter.',
    approval: { approver: 'Daniel Lim', status: 'Pending', comments: 'Awaiting manager review.', approvedDate: null }
  },
  {
    employeeId: 'EMP-0051', startDate: '2026-10-31', endDate: '2026-10-31', leaveType: 'Annual Leave', code: 'AL', typeClass: 'annual', status: 'Approved', reason: 'Personal day off.',
    approval: { approver: 'Farah Rahman', status: 'Approved', comments: 'Approved as requested.', approvedDate: '2026-10-18' }
  },
  {
    employeeId: 'EMP-0042', startDate: '2026-09-28', endDate: '2026-09-28', leaveType: 'Unpaid Leave', code: 'UL', typeClass: 'unpaid', status: 'Approved', reason: 'Personal commitment.',
    approval: { approver: 'Farah Rahman', status: 'Approved', comments: 'Approved after review.', approvedDate: '2026-09-20' }
  },
  {
    employeeId: 'EMP-0042', startDate: '2026-10-05', endDate: '2026-10-06', leaveType: 'Unpaid Leave', code: 'UL', typeClass: 'unpaid', status: 'Pending', reason: 'Personal matters requiring time away.',
    approval: { approver: 'Farah Rahman', status: 'Pending', comments: 'Awaiting manager review.', approvedDate: null }
  },
  {
    employeeId: 'EMP-0042', startDate: '2026-10-08', endDate: '2026-10-08', leaveType: 'Unpaid Leave', code: 'UL', typeClass: 'unpaid', status: 'Rejected', reason: 'Request for an additional personal day.',
    approval: { approver: 'Farah Rahman', status: 'Rejected', comments: 'Please use available annual leave.', approvedDate: '2026-10-04' }
  },
  {
    employeeId: 'EMP-0042', startDate: '2026-10-22', endDate: '2026-10-22', leaveType: 'Unpaid Leave', code: 'UL', typeClass: 'unpaid', status: 'Approved', reason: 'Personal commitment.',
    approval: { approver: 'Farah Rahman', status: 'Approved', comments: 'Approved after review.', approvedDate: '2026-10-16' }
  },
  {
    employeeId: 'EMP-0042', startDate: '2026-11-02', endDate: '2026-11-03', leaveType: 'Unpaid Leave', code: 'UL', typeClass: 'unpaid', status: 'Approved', reason: 'Personal leave without pay.',
    approval: { approver: 'Daniel Lim', status: 'Approved', comments: 'Approved as requested.', approvedDate: '2026-10-17' }
  }
];

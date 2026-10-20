import type { LeaveApplication } from '../models/leave.model';

export const leaveApplications: LeaveApplication[] = [
  {
    employeeId: 'EMP-0042',
    leaveType: 'Annual Leave',
    reference: 'AL-2026-101',
    dateRange: '02/11/2026 ~ 03/11/2026',
    daysTaken: '2 Days',
    status: 'Pending',
    statusClass: 'bg-light-info text-info',
    iconClass: 'text-danger bg-light-danger',
    reason: 'Taking a short family vacation.',
    approval: { approver: 'Farah Rahman', status: 'Pending', comments: 'Awaiting manager review.', approvedDate: null }
  },
  {
    employeeId: 'EMP-0043',
    leaveType: 'Medical Leave',
    reference: 'ML-2026-102',
    dateRange: '04/11/2026',
    daysTaken: '1 Day',
    status: 'Pending',
    statusClass: 'bg-light-info text-info',
    iconClass: 'text-warning bg-light-warning',
    reason: 'Medical appointment and recovery.',
    approval: { approver: 'Daniel Lim', status: 'Pending', comments: 'Awaiting supporting document.', approvedDate: null }
  },
  {
    employeeId: 'EMP-0044',
    leaveType: 'Annual Leave',
    reference: 'AL-2026-103',
    dateRange: '06/11/2026 ~ 07/11/2026',
    daysTaken: '2 Days',
    status: 'Pending',
    statusClass: 'bg-light-info text-info',
    iconClass: 'text-danger bg-light-danger',
    reason: 'Visiting family out of town.',
    approval: { approver: 'Farah Rahman', status: 'Pending', comments: 'Awaiting manager review.', approvedDate: null }
  },
  {
    employeeId: 'EMP-0045',
    leaveType: 'Unpaid Leave',
    reference: 'UL-2026-104',
    dateRange: '09/11/2026',
    daysTaken: '1 Day',
    status: 'Pending',
    statusClass: 'bg-light-info text-info',
    iconClass: 'text-secondary bg-light-secondary',
    reason: 'Personal matters requiring time away.',
    approval: { approver: 'Daniel Lim', status: 'Pending', comments: 'Awaiting manager review.', approvedDate: null }
  },
  {
    employeeId: 'EMP-0046',
    leaveType: 'Emergency Leave',
    reference: 'EL-2026-105',
    dateRange: '10/11/2026',
    daysTaken: '1 Day',
    status: 'Pending',
    statusClass: 'bg-light-info text-info',
    iconClass: 'text-info bg-light-info',
    reason: 'Urgent family matter.',
    approval: { approver: 'Farah Rahman', status: 'Pending', comments: 'Awaiting manager review.', approvedDate: null }
  },
  {
    employeeId: 'EMP-0047',
    leaveType: 'Annual Leave',
    reference: 'AL-2026-106',
    dateRange: '12/11/2026 ~ 13/11/2026',
    daysTaken: '2 Days',
    status: 'Approved',
    statusClass: 'bg-light-primary text-primary',
    iconClass: 'text-danger bg-light-danger',
    reason: 'Personal travel.',
    approval: { approver: 'Daniel Lim', status: 'Approved', comments: 'Approved as requested.', approvedDate: '2026-10-20' }
  },
  {
    employeeId: 'EMP-0048',
    leaveType: 'Medical Leave',
    reference: 'ML-2026-107',
    dateRange: '16/11/2026',
    daysTaken: '1 Day',
    status: 'Approved',
    statusClass: 'bg-light-primary text-primary',
    iconClass: 'text-warning bg-light-warning',
    reason: 'Follow-up medical consultation.',
    approval: { approver: 'Farah Rahman', status: 'Approved', comments: 'Supporting document verified.', approvedDate: '2026-10-19' }
  },
  {
    employeeId: 'EMP-0049',
    leaveType: 'Annual Leave',
    reference: 'AL-2026-108',
    dateRange: '18/11/2026 ~ 20/11/2026',
    daysTaken: '3 Days',
    status: 'Approved',
    statusClass: 'bg-light-primary text-primary',
    iconClass: 'text-danger bg-light-danger',
    reason: 'Family holiday.',
    approval: { approver: 'Daniel Lim', status: 'Approved', comments: 'Approved as requested.', approvedDate: '2026-10-15' }
  },
  {
    employeeId: 'EMP-0050',
    leaveType: 'Emergency Leave',
    reference: 'EL-2026-109',
    dateRange: '23/11/2026',
    daysTaken: '1 Day',
    status: 'Rejected',
    statusClass: 'bg-light-danger text-danger',
    iconClass: 'text-info bg-light-info',
    reason: 'Personal matter.',
    approval: { approver: 'Daniel Lim', status: 'Rejected', comments: 'Please submit the request under annual leave.', approvedDate: '2026-10-20' }
  },
  {
    employeeId: 'EMP-0051',
    leaveType: 'Unpaid Leave',
    reference: 'UL-2026-110',
    dateRange: '25/11/2026 ~ 26/11/2026',
    daysTaken: '2 Days',
    status: 'Rejected',
    statusClass: 'bg-light-danger text-danger',
    iconClass: 'text-secondary bg-light-secondary',
    reason: 'Personal commitment.',
    approval: { approver: 'Farah Rahman', status: 'Rejected', comments: 'Please use available annual leave.', approvedDate: '2026-10-21' }
  }
];

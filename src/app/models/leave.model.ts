export interface CalendarDay {
  date: number;
  dateKey: string;
  dayName: string;
  isWeekend: boolean;
  isToday: boolean;
}

export interface LeaveRecord {
  employeeId: string;
  startDate: string;
  endDate: string;
  leaveType: string;
  code: string;
  typeClass: string;
  status: string;
  reason: string;
  approval: LeaveApproval;
}

export interface LeaveApplication {
  employeeId: string;
  leaveType: string;
  reference: string;
  dateRange: string;
  daysTaken: string;
  status: string;
  statusClass: string;
  iconClass: string;
  reason: string;
  approval: LeaveApproval;
}

export interface LeaveApproval {
  approver: string;
  status: string;
  comments: string;
  approvedDate: string | null;
}

export interface EmployeeLeaveBalance {
  entitled: number;
  taken: number;
  balance: number;
}

export interface EmployeeLeaveBalances {
  annual: EmployeeLeaveBalance;
  medical: EmployeeLeaveBalance;
}


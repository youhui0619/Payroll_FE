export type OvertimeType = 'NORMAL_WORKING_DAY' | 'REST_DAY' | 'PUBLIC_HOLIDAY';
export type OvertimeStatus = 'Pending' | 'Approved' | 'Rejected' | 'Paid';

export interface OvertimeApproval {
  approver: string;
  approvedDate: string | null;
  comments: string;
}

export interface OvertimeRequestRecord {
  id: string;
  requestDate: string;
  overtimeDate: string;
  employeeId: string;
  employeeName: string;
  departmentId: string;
  departmentName: string;
  overtimeType: OvertimeType;
  startTime: string;
  endTime: string;
  totalMinutes: number;
  breakDurationMinutes: number;
  netMinutes: number;
  hourlyRateMultiplier: number;
  earningCode: string;
  description: string;
  supportingDocuments: string[];
  status: OvertimeStatus;
  submittedAt: string;
  approval: OvertimeApproval;
}

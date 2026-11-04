export interface DailyAttendanceRecord {
  employeeId: string;
  date: string;
  clockIn: string;
  clockOut: string;
  durationMinutes: number;
  hoursWorkedMinutes: number;
  overtimeMinutes: number;
  remark: string;
}

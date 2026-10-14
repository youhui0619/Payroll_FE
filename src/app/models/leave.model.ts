
export interface CalendarDay {
  date: number;
  dateKey: string;
  dayName: string;
  isWeekend: boolean;
  isToday: boolean;
}

export interface Employee {
  employeeId: string;
  name: string;
}

export interface LeaveRecord {
  employeeId: string;
  startDate: string;
  endDate: string;
  leaveType: string;
  code: string;
  typeClass: string;
  status: string;
}

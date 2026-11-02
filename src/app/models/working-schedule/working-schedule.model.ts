import type { EmploymentType } from '../workforce/employment-status.model';

export type WorkingDayName = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface WorkingDaySchedule {
  day: WorkingDayName;
  isWorkingDay: boolean;
  startTime: string;
  endTime: string;
  breakStartTime: string;
  breakEndTime: string;
}

export interface WorkingSchedule {
  days: WorkingDaySchedule[];
}

export type WorkingScheduleSettings = Record<EmploymentType, WorkingSchedule>;

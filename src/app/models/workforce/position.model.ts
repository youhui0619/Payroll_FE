export type PositionJobLevel = 'ENTRY' | 'INTERMEDIATE' | 'SENIOR' | 'LEAD' | 'MANAGER' | 'DIRECTOR';

export interface PositionDepartmentSummary {
  id: string;
  code: string;
  name: string;
}

export interface Position {
  id: string;
  code: string;
  title: string;
  jobLevel: PositionJobLevel;
  description: string;
  departmentId: string;
  department?: PositionDepartmentSummary;
  employeeCount?: number;
  reportsTo: string | null;
  effectiveFrom: string;
  effectiveTo: string | null;
  active: boolean
}

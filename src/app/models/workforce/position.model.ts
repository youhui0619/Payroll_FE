export type PositionJobLevel = 'ENTRY' | 'INTERMEDIATE' | 'SENIOR' | 'LEAD' | 'MANAGER' | 'DIRECTOR';

export interface Position {
  id: string;
  code: string;
  title: string;
  jobLevel: PositionJobLevel;
  description: string;
  departmentId: string;
  reportsTo: string | null;
  effectiveFrom: string | null;
  effectiveTo: string | null;
}

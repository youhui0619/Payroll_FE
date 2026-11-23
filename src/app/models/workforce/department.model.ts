export type DepartmentStatus = 'ACTIVE' | 'INACTIVE';

export interface Department {
  id: string;
  name: string;
  code: string;
  description: string;
  parentDepartmentId: string | null;
  headOfDepartmentId: string | null;
  totalEmployees: number;
  totalPositions: number
  effectiveFrom: string;
  effectiveTo: string | null;
  active: boolean
}

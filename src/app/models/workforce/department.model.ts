export type DepartmentStatus = 'ACTIVE' | 'INACTIVE';

export interface Department {
  id: string;
  name: string;
  code: string;
  description: string;
  parentDepartmentId: string | null;
  headOfDepartmentId: string | null;
  totalEmployees: number;
  effectiveFrom: string | null;
  effectiveTo: string | null;
  status: DepartmentStatus;
}

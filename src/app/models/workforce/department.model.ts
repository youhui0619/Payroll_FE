export type DepartmentStatus = 'Active' | 'Inactive' | 'Draft';

export interface Department {
  id: string;
  name: string;
  code: string;
  shortName: string;
  remark: string;
  parentDepartmentId: string | null;
  headOfDepartmentId: string | null;
  totalEmployees: number;
  effectiveFrom: string | null;
  effectiveTo: string | null;
  status: DepartmentStatus;
}

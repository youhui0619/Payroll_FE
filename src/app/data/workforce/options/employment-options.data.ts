import type { EmploymentStatus, EmploymentType } from '../../../models/workforce/employment-status.model';

export interface EmploymentOption<T extends string> {
  value: T;
  label: string;
}

export const employmentStatuses: readonly EmploymentOption<EmploymentStatus>[] = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'PROBATION', label: 'Probation' },
  { value: 'SUSPENDED', label: 'Suspended' },
  { value: 'RESIGNED', label: 'Resigned' },
  { value: 'TERMINATED', label: 'Terminated' },
  { value: 'RETIRED', label: 'Retired' }
];

export const employmentTypes: EmploymentOption<EmploymentType>[] = [
  { value: 'PERMANENT', label: 'Permanent' },
  { value: 'CONTRACT', label: 'Contract' },
  { value: 'PART-TIME', label: 'Part-time' },
  { value: 'INTERN', label: 'Intern' },
  { value: 'TEMPORARY', label: 'Temporary' },
  { value: 'TRAINEE', label: 'Trainee' },
  { value: 'FREELANCE', label: 'Freelance' },
  { value: 'CASUAL', label: 'Casual / Daily Worker' }
];

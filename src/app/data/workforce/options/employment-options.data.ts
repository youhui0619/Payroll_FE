import type { EmploymentStatus, EmploymentType } from '../../../models/workforce/employment-status.model';

export interface EmploymentOption<T extends string> {
  value: T;
  label: string;
}

export const employmentStatuses: readonly EmploymentOption<EmploymentStatus>[] = [
  { value: 'Active', label: 'Active' },
  { value: 'Probation', label: 'Probation' },
  { value: 'Suspended', label: 'Suspended' },
  { value: 'Resigned', label: 'Resigned' },
  { value: 'Terminated', label: 'Terminated' },
  { value: 'Retired', label: 'Retired' }
];

export const employmentTypes: readonly EmploymentOption<EmploymentType>[] = [
  { value: 'Permanent', label: 'Permanent' },
  { value: 'Contract', label: 'Contract' },
  { value: 'Part-time', label: 'Part-time' },
  { value: 'Intern', label: 'Intern' },
  { value: 'Temporary', label: 'Temporary' },
  { value: 'Trainee', label: 'Trainee' },
  { value: 'Freelance', label: 'Freelance' },
  { value: 'Casual', label: 'Casual / Daily Worker' }
];

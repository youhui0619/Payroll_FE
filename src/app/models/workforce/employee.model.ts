import type { LeaveServiceEntitlementTier } from '../leave/leave-policy.model';
import type { EmploymentStatus, EmploymentType } from './employment-status.model';
import type { WorkingSchedule } from '../working-schedule/working-schedule.model';

export type OvertimeCalculationBasis = 'HOURLY_RATE' | 'DAILY_RATE_CONVERTED' | 'MONTHLY_SALARY_CONVERTED';

export interface EmployeeSelectOption<T extends string = string> {
  value: T;
  name: string;
}

export const genderOptions: EmployeeSelectOption[] = [
  { value: 'MALE', name: 'Male' },
  { value: 'FEMALE', name: 'Female' }
];

export const nationalityOptions: EmployeeSelectOption[] = [
  { value: 'MALAYSIAN', name: 'Malaysian' },
  { value: 'SINGAPOREAN', name: 'Singaporean' }
];

export const raceOptions: EmployeeSelectOption[] = [
  { value: 'MALAY', name: 'Malay' },
  { value: 'CHINESE', name: 'Chinese' },
  { value: 'INDIAN', name: 'Indian' },
  { value: 'OTHER', name: 'Other' }
];

export const religionOptions: EmployeeSelectOption[] = [
  { value: 'ISLAM', name: 'Islam' },
  { value: 'BUDDISM', name: 'Buddhism' },
  { value: 'CHRISTIANITY', name: 'Christianity' },
  { value: 'HINDUISM', name: 'Hinduism' },
  { value: 'OTHER', name: 'Other' }
];

export const maritalStatusOptions: EmployeeSelectOption[] = [
  { value: 'SINGLE', name: 'Single' },
  { value: 'MARRIED', name: 'Married' },
  { value: 'DIVORCED', name: 'Divorced' },
  { value: 'WIDOWED', name: 'Widowed' }
];

export const countryOptions: EmployeeSelectOption[] = [
  { value: 'MALAYSIA', name: 'Malaysia' },
  { value: 'SINGAPORE', name: 'Singapore' }
];

export const salaryTypeOptions: EmployeeSelectOption[] = [
  { value: 'MONTHLY', name: 'Monthly' },
  { value: 'DAILY', name: 'Daily' },
  { value: 'HOURLY', name: 'Hourly' }
];

export const paymentMethodOptions: EmployeeSelectOption[] = [
  { value: 'BANK', name: 'Transfer by bank' },
  { value: 'CASH', name: 'Cash' },
  { value: 'CHEQUE', name: 'Cheque' }
];

export const bankOptions: EmployeeSelectOption[] = [
  { value: 'AFFIN_BANK', name: 'Affin Bank' },
  { value: 'AGROBANK', name: 'Agrobank' },
  { value: 'ALLIANCE_BANK', name: 'Alliance Bank' },
  { value: 'AMBANK', name: 'AmBank' },
  { value: 'BANK_ISLAM', name: 'Bank Islam' },
  { value: 'BANK_MUAMALAT', name: 'Bank Muamalat' },
  { value: 'BANK_OF_CHINA', name: 'Bank of China' },
  { value: 'BANK_RAKYAT', name: 'Bank Rakyat' },
  { value: 'BNP_PARIBAS', name: 'BNP Paribas' },
  { value: 'BSN', name: 'Bank Simpanan Nasional (BSN)' },
  { value: 'CIMB', name: 'CIMB Bank' },
  { value: 'CITIBANK', name: 'Citibank' },
  { value: 'DEUTSCHE_BANK', name: 'Deutsche Bank' },
  { value: 'HONG_LEONG_BANK', name: 'Hong Leong Bank' },
  { value: 'HSBC', name: 'HSBC Bank' },
  { value: 'ICBC', name: 'Industrial and Commercial Bank of China (ICBC)' },
  { value: 'JPMORGAN_CHASE_BANK', name: 'J.P. Morgan Chase Bank' },
  { value: 'KUWAIT_FINANCE_HOUSE', name: 'Kuwait Finance House' },
  { value: 'MAYBANK', name: 'Maybank' },
  { value: 'MBSB_BANK', name: 'MBSB Bank' },
  { value: 'MIZUHO_BANK', name: 'Mizuho Bank' },
  { value: 'MUFG_BANK', name: 'MUFG Bank' },
  { value: 'OCBC_BANK', name: 'OCBC Bank' },
  { value: 'PUBLIC_BANK', name: 'Public Bank' },
  { value: 'RHB', name: 'RHB Bank' },
  { value: 'SMBC', name: 'Sumitomo Mitsui Banking Corporation (SMBC)' },
  { value: 'STANDARD_CHARTERED_BANK', name: 'Standard Chartered Bank' },
  { value: 'UOB', name: 'UOB Bank' },
  { value: 'AL_RAJHI_BANK', name: 'Al Rajhi Bank' }
];

export const epfRateOptions: EmployeeSelectOption[] = [
  { value: '11', name: '11%' },
  { value: '9', name: '9%' }
];

export const contributionCategoryOptions: EmployeeSelectOption[] = [
  { value: 'CATEGORY1', name: 'Category 1 - Employer + Employee' },
  { value: 'CATEGORY2', name: 'Category 2 - Employer only' },
  { value: 'NONE', name: 'Not applicable' }
];

export const eisStatusOptions: EmployeeSelectOption[] = [
  { value: 'ACTIVE', name: 'Active' },
  { value: 'INACTIVE', name: 'Inactive' },
  { value: 'NONE', name: 'Not applicable' }
];

export const emergencyContactRelationshipOptions: EmployeeSelectOption[] = [
  { value: 'SPOUSE', name: 'Spouse' },
  { value: 'CHILD', name: 'Child' },
  { value: 'PARENT', name: 'Parent' },
  { value: 'SIBLING', name: 'Sibling' },
  { value: 'GUARDIAN', name: 'Guardian' },
  { value: 'RELATIVE', name: 'Relative' },
  { value: 'FAMILY_MEMBER', name: 'Family member' },
  { value: 'FRIEND', name: 'Friend' },
  { value: 'OTHER', name: 'Other' }
];

export const stateOptions = [
  { value: 'JOHOR', name: 'Johor' },
  { value: 'KEDAH', name: 'Kedah' },
  { value: 'KELANTAN', name: 'Kelantan' },
  { value: 'KUALA_LUMPUR', name: 'Kuala Lumpur' },
  { value: 'LABUAN', name: 'Labuan' },
  { value: 'MELAKA', name: 'Melaka' },
  { value: 'NEGERI_SEMBILAN', name: 'Negeri Sembilan' },
  { value: 'PAHANG', name: 'Pahang' },
  { value: 'PENANG', name: 'Penang' },
  { value: 'PERAK', name: 'Perak' },
  { value: 'PERLIS', name: 'Perlis' },
  { value: 'PUTRAJAYA', name: 'Putrajaya' },
  { value: 'SABAH', name: 'Sabah' },
  { value: 'SARAWAK', name: 'Sarawak' },
  { value: 'SELANGOR', name: 'Selangor' },
  { value: 'TERENGGANU', name: 'Terengganu' }
];

export const employmentStatuses: readonly EmployeeSelectOption<EmploymentStatus>[] = [
  { value: 'ACTIVE', name: 'Active' },
  { value: 'PROBATION', name: 'Probation' },
  { value: 'SUSPENDED', name: 'Suspended' },
  { value: 'RESIGNED', name: 'Resigned' },
  { value: 'TERMINATED', name: 'Terminated' },
  { value: 'RETIRED', name: 'Retired' }
];

export const employmentTypes: EmployeeSelectOption<EmploymentType>[] = [
  { value: 'PERMANENT', name: 'Permanent' },
  { value: 'CONTRACT', name: 'Contract' },
  { value: 'PART-TIME', name: 'Part-time' },
  { value: 'INTERN', name: 'Intern' },
  { value: 'TEMPORARY', name: 'Temporary' },
  { value: 'TRAINEE', name: 'Trainee' },
  { value: 'FREELANCE', name: 'Freelance' },
  { value: 'CASUAL', name: 'Casual / Daily Worker' }
];

export const noManagerOption = { value: null, name: 'None' } as const;

export const statutoryEntitlementOptions = [
  { code: 'EPF', name: 'EPF / KWSP', setting: 'includeEpf' },
  { code: 'SOCSO', name: 'SOCSO / PERKESO', setting: 'includeSocso' },
  { code: 'LHDN', name: 'LHDN (PCB / MTD)', setting: 'includePcb' },
  { code: 'EIS', name: 'EIS / SIP', setting: 'includeEis' },
  { code: 'HRD_CORP_LEVY', name: 'HRD Corp Levy', setting: 'includeHrdCorpLevy' }
] as const;

export const overtimeBasisOptions: EmployeeSelectOption<OvertimeCalculationBasis>[] = [
  { value: 'HOURLY_RATE', name: 'Hourly rate' },
  { value: 'DAILY_RATE_CONVERTED', name: 'Daily rate converted to hourly' },
  { value: 'MONTHLY_SALARY_CONVERTED', name: 'Monthly salary converted to hourly' }
];

/** Employee list/overview response, including the related department and position summaries. */
export interface EmployeeOverview {
  id: string;
  employeeId: string;
  employeeNo: string;
  name: string;
  employmentType: EmploymentType;
  employmentStatus: EmploymentStatus;
  department: {
    id: string;
    code: string;
    name: string;
  };
  position: {
    id: string;
    code: string;
    title: string;
  };
}

/** Employee record used by existing directory, leave, and payroll views. */
export interface Employee {
  id: string;
  employeeNo: string;
  name: string;
  initials: string;
  nricPassportNo: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  race: string;
  religion: string;
  maritalStatus: string;
  tin: string;
  email: string;
  contactNo: string;
  address: string;
  department: string;
  position: string;
  reportingManager: string;
  workLocationId: string;
  employmentStatus: EmploymentStatus;
  employmentType: EmploymentType;
  joinedDate: string;
  confirmationDate: string | null;
  resignationDate: string | null;
  workingSchedule: WorkingSchedule;
  basicSalary: number;
  salaryType: string;
  paymentMethod: string;
  bank: string;
  bankAccount: string;
  epfEmployeeNo: string;
  epfEmployerNo: string;
  epfRate: string;
  kwspNo: string;
  socsoNo: string;
  contributionCategory: string;
  eisStatus: string;
  hrdRegisterNo: string;
  statutoryEntitlementCodes: string[];
  commissionSettingCodes: string[];
  includeOvertime: boolean;
  overtimeCalculationBasis: OvertimeCalculationBasis;
  overtimeHourlyRate: number | null;
  leavePolicyCodes?: string[];
  leaveEntitlementOverrides?: Record<string, number | null>;
  leaveServiceEntitlementTiers?: Record<string, LeaveServiceEntitlementTier[]>;
  emergencyContactName: string;
  emergencyContactRelationship: string;
  emergencyContactNo: string;
  emergencyContactAddress?: string;
}

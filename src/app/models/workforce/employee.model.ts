import type { LeaveServiceEntitlementTier } from '../leave/leave-policy.model';
import type { EmploymentStatus, EmploymentType } from './employment-status.model';
import type { WorkingSchedule } from '../working-schedule/working-schedule.model';

export type OvertimeCalculationBasis = 'HOURLY_RATE' | 'DAILY_RATE_CONVERTED' | 'MONTHLY_SALARY_CONVERTED';

/** Flat employee payload produced by the Workforce > Employees create form. */
export interface EmployeeCreatePayload {
  employeeNo: string;
  name: string;
  nricPassportNo: string;
  dateOfBirth: string | null;
  gender: string;
  nationality: string;
  race: string;
  religion: string;
  maritalStatus: string;
  email: string;
  contactNo: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  postcode: string;
  state: string;
  country: string;
  employmentStatus: EmploymentStatus | null;
  employmentType: EmploymentType | null;
  workingSchedule: WorkingSchedule;
  departmentId: string;
  positionId: string | null;
  managerId: string | null;
  locationId: string;
  joinedDate: string | null;
  confirmationDate: string | null;
  resignationDate: string | null;
  basicSalary: number | null;
  salaryType: string;
  paymentMethod: string;
  bank: string;
  bankAccount: string;
  epfEmployeeNo: string;
  epfEmployerNo: string;
  epfRate: string;
  socsoNo: string;
  contributionCategory: string;
  eisStatus: string;
  hrdRegisterNo: string;
  statutoryEntitlementCodes: string[];
  commissionSettingCodes: string[];
  includeOvertime: boolean;
  overtimeCalculationBasis: OvertimeCalculationBasis;
  overtimeHourlyRate: number | null;
  leavePolicyCodes: string[];
  leaveEntitlementOverrides: Record<string, number | null>;
  leaveServiceEntitlementTiers: Record<string, LeaveServiceEntitlementTier[]>;
  medicalLeaveEntitlement: number | null;
  medicalLeavePeriod: 'month' | 'year';
  emergencyContactName: string;
  emergencyContactRelationship: string;
  emergencyContactNo: string;
  emergencyContactAddressLine1: string;
  emergencyContactAddressLine2: string | null;
  emergencyContactCity: string;
  emergencyContactPostcode: string;
  emergencyContactState: string;
  emergencyContactCountry: string;
}

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
  employeeId: string;
  employeeName: string;
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
}

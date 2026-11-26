import { LeaveApproval } from "./leave.model";

export type LeaveEntitlementUnit = 'DAILY' | 'HOURLY';
export type LeavePolicyType = 'PAID' | 'UNPAID';
export type LeaveEntitlementCalculation = 'FIXED' | 'SERVICE';
export type LeaveEntitlementGrantMethod = 'ANNUAL' | 'MONTHLY_ACCRUAL' | 'SERVICE_ANNIVERSARY' | 'MANUAL';
export type LeaveYearBasis = 'CALENDAR' | 'EMPLOYMENT_ANNIVERSARY' | 'FINANCIAL';
export type LeaveCarryForwardPolicy = 'NONE' | 'LIMITED' | 'UNLIMITED' | 'HR_REVIEW';
export type LeaveApprovalOverflow = 'MANAGER' | 'MANAGER_HR' | 'HR_ONLY' | 'NO_APPROVAL';
export type LeaveEligibility = 'ALL_EMPLOYEES' | 'PERMANENT' | 'PROBATION' | 'PART_TIME' | 'CONTRACT_WORKER' | 'INTERN';

export interface LeaveServiceEntitlementTier {
  serviceFrom: number | null;
  serviceTo: number | null;
  daysPerYear: number | null;
}

export interface LeavePolicy {
  policyId: string;
  companyId: string;

  // Basic information
  code: string;
  name: string;
  description: string;
  active: boolean;
  leaveType: LeavePolicyType;
  entitlementUnit: LeaveEntitlementUnit;
  entitlementCalculationMethod: LeaveEntitlementCalculation;
  defaultEntitlement: number | null;
  serviceEntitlementTiers: LeaveServiceEntitlementTier[];
  entitlementGrantMethod: LeaveEntitlementGrantMethod;
  eligibility: LeaveEligibility;
  leaveYear: LeaveYearBasis;
  carryForwardPolicy: LeaveCarryForwardPolicy;
  maximumCarryForward: number | null;
  approval: LeaveApproval;
  approvalOverflow: LeaveApprovalOverflow;
  minimumAdvanceNotice: number | null;
  noticeDays: number | null;
  allowHalfDay: boolean;
  requireSupportingDocuments: boolean;
  allowEmployeeSpecificSettings: boolean;
  paid: boolean;
  effectiveFrom: string | null;
  effectiveTo: string | null;
  balance?: number;
}

export const approvalList = [
  { value: 'MANAGER', name: 'Manager' },
  { value: 'MANAGER_HR', name: 'Manager & HR' },
  { value: 'HR_ONLY', name: 'HR Only' },
  { value: 'NO_APPROVAL', name: 'No Approval' }
];
export type LeavePolicyStatus = 'ACTIVE' | 'INACTIVE';
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
  leaveCode: string;
  leaveName: string;
  description: string;
  status: LeavePolicyStatus;
  entitlementUnit: LeaveEntitlementUnit;
  leaveType: LeavePolicyType;
  entitlementCalculationMethod: LeaveEntitlementCalculation;
  defaultEntitlement: number | null;
  serviceEntitlementTiers: LeaveServiceEntitlementTier[];
  entitlementGrantMethod: LeaveEntitlementGrantMethod;
  eligibility: LeaveEligibility;
  leaveYear: LeaveYearBasis;
  carryForwardPolicy: LeaveCarryForwardPolicy;
  maximumCarryForward: number | null;
  approvalOverflow: LeaveApprovalOverflow;
  minimumAdvanceNotice: number | null;
  allowHalfDay: boolean;
  requireSupportingDocuments: boolean;
}

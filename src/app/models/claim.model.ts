export type ClaimType =
  | 'TRAVEL'
  | 'MEALS'
  | 'ACCOMMODATION'
  | 'TRANSPORTATION'
  | 'MEDICAL'
  | 'COMMUNICATION'
  | 'OTHER';

export type ClaimPaymentMethod = 'PAYROLL' | 'BANK_TRANSFER' | 'CASH';
export type ClaimStatus = 'Pending' | 'Approved' | 'Rejected' | 'Paid';

export interface ClaimApproval {
  approver: string;
  approvedDate: string | null;
  comments: string;
}

export interface ExpenseClaimRecord {
  id: string;
  claimDate: string;
  employeeId: string;
  employeeName: string;
  departmentId: string;
  departmentName: string;
  claimType: ClaimType;
  description: string;
  amount: number;
  currency: 'MYR';
  paymentMethod: ClaimPaymentMethod;
  supportingDocuments: string[];
  status: ClaimStatus;
  submittedAt: string;
  approval: ClaimApproval;
}

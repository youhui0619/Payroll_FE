export interface PayslipLeaveBalance {
  available: number;
  granted: number;
  taken: number;
  carriedForward: number;
}

export interface Payslip {
  employeeId: string;
  period: string;
  status: string;
  leaveReferences: string[];
  claimReferences: string[];
  company: {
    name: string;
    registrationNumber: string;
    llpNumber: string;
    address: string;
  };
  employee: {
    name: string;
    id: string;
    position: string;
    department: string;
    epfMembershipNumber: string;
    gender: string;
  };
  leaveBalances: {
    annual: PayslipLeaveBalance;
    medical: PayslipLeaveBalance;
  };
  earnings: {
    basicPay: number;
    unpaidLeave: number;
    overtime: number;
    allowance: number;
    bonus: number;
    grossPay: number;
  };
  deductions: {
    epf: number;
    socso: number;
    lindungan24Jam: number;
    eis: number;
    pcb: number;
    advance: number;
    other: number;
    total: number;
  };
  employerContributions: {
    epf: number;
    socso: number;
    eis: number;
  };
  contributionBases: {
    epf: number;
    perkeso: number;
  };
  netPay: number;
  paymentMethod: string;
}

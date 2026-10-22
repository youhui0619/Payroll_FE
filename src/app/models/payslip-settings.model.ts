export type PayslipPageSize = 'A4' | 'LETTER';
export type PayslipPageOrientation = 'PORTRAIT' | 'LANDSCAPE';
export type PayslipPublishingMethod = 'MANUAL' | 'AUTOMATIC';
export type PayslipEmployeeVisibility = 'EMPLOYEES_AND_ADMINS' | 'ADMINS_ONLY';

export interface PayslipSettings {
  pageSize: PayslipPageSize;
  pageOrientation: PayslipPageOrientation;
  payslipNumberFormat: string;
  pdfFilenameFormat: string;
  passwordProtectedPdf: boolean;
  companyLogo: boolean;
  employeeDetails: boolean;
  departmentAndPosition: boolean;
  employmentType: boolean;
  payPeriodAndPaymentDate: boolean;
  salaryAndEarnings: boolean;
  itemizedDeductions: boolean;
  employerContributions: boolean;
  yearToDateTotals: boolean;
  leaveBalance: boolean;
  bankAccountDetails: boolean;
  maskBankAccountNumber: boolean;
  displayFooterMessage: boolean;
  footerText: string;
  publishingMethod: PayslipPublishingMethod;
  employeeVisibility: PayslipEmployeeVisibility;
  notifyEmployees: boolean;
}

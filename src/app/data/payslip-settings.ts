import type { PayslipSettings } from '../models/payslip-settings.model';

export const payslipSettings: PayslipSettings = {
  pageSize: 'A4',
  pageOrientation: 'PORTRAIT',
  payslipNumberFormat: 'PAY-{YYYY}-{MM}-{EMPLOYEE_ID}',
  pdfFilenameFormat: '{EMPLOYEE_ID}-{YYYY}-{MM}-payslip',
  passwordProtectedPdf: false,
  companyLogo: true,
  employeeDetails: true,
  departmentAndPosition: true,
  employmentType: false,
  payPeriodAndPaymentDate: true,
  salaryAndEarnings: true,
  itemizedDeductions: true,
  employerContributions: true,
  yearToDateTotals: true,
  leaveBalance: true,
  bankAccountDetails: false,
  maskBankAccountNumber: true,
  displayFooterMessage: false,
  footerText: '',
  publishingMethod: 'MANUAL',
  employeeVisibility: 'EMPLOYEES_AND_ADMINS',
  notifyEmployees: true
};

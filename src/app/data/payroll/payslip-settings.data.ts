import type { PayslipSettings } from '../../models/payroll/payslip-settings.model';

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
  employeeExpensesList: true,
  dailyAttendanceRecord: true,
  leaveList: true,
  bankAccountDetails: false,
  maskBankAccountNumber: true,
  displayFooterMessage: false,
  footerText: '',
  publishingMethod: 'MANUAL',
  employeeVisibility: 'EMPLOYEES_AND_ADMINS',
  notifyEmployees: true
};

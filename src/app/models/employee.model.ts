export interface EmployeeRecord {
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
  workLocation: string;
  employmentStatus: string;
  employmentType: string;
  joinedDate: string;
  confirmationDate: string;
  resignationDate: string | null;
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
  emergencyContactName: string;
  emergencyContactRelationship: string;
  emergencyContactNo: string;
}

export interface EmployeePersonalInfo {
  employeeId: string | null;
  employeeName: string | null;
  nricPassportNo: string | null;
  dateOfBirth: Date | null;
  gender: string | null;
  nationality: string | null;
  race: string | null;
  religion: string | null;
  maritalStatus: string | null;
  email: string | null;
  contactNo: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  postcode: string | null;
  state: string | null;
  country: string | null;
}

export interface EmployeeEmploymentInfo {
  employmentStatus: string | null;
  employmentType: string | null;
  department: string | null;
  position: string | null;
  reportingManager: string | null;
  workLocation: string | null;
  joinedDate: Date | null;
  confirmationDate: Date | null;
  resignationDate: Date | null;
}

export interface EmployeePayrollInfo {
  basicSalary: number | null;
  salaryType: string | null;
  paymentMethod: string | null;
  bank: string | null;
  bankAccount: string | null;
  epfEmployeeNo: string | null;
  epfEmployerNo: string | null;
  epfRate: string | null;
  socsoNo: string | null;
  contributionCategory: string | null;
  eisStatus: string | null;
  hrdRegisterNo: string | null;
  statutoryEntitlementCodes: string[];
  commissionSettingCodes: string[];
}

export interface EmployeeTaxInformation {
  agreeWithTerms: boolean | null;
}

export interface EmployeeLeaveInformation {
  leavePolicyCodes: string[];
  annualLeaveEntitlement: number | null;
  annualLeavePeriod: 'month' | 'year';
  medicalLeaveEntitlement: number | null;
  medicalLeavePeriod: 'month' | 'year';
}

export interface EmployeeEmergencyContact {
  contactName: string | null;
  relationship: string | null;
  contactNo: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  postcode: string | null;
  state: string | null;
  country: string | null;
}

export interface EmployeeFormData {
  personal: EmployeePersonalInfo;
  employment: EmployeeEmploymentInfo;
  payroll: EmployeePayrollInfo;
  taxInformation: EmployeeTaxInformation;
  leave: EmployeeLeaveInformation;
  emergencyContact: EmployeeEmergencyContact;
}

export const EMPTY_EMPLOYEE_FORM_DATA: EmployeeFormData = {
  personal: {
    employeeId: '',
    employeeName: '',
    nricPassportNo: '',
    dateOfBirth: null,
    gender: '',
    nationality: '',
    race: '',
    religion: '',
    maritalStatus: '',
    email: '',
    contactNo: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    postcode: '',
    state: '',
    country: '',
  },
  employment: {
    employmentStatus: '',
    employmentType: '',
    department: '',
    position: '',
    reportingManager: '',
    workLocation: '',
    joinedDate: null,
    confirmationDate: null,
    resignationDate: null,
  },
  payroll: {
    basicSalary: null,
    salaryType: '',
    paymentMethod: '',
    bank: '',
    bankAccount: '',
    epfEmployeeNo: '',
    epfEmployerNo: '',
    epfRate: '',
    socsoNo: '',
    contributionCategory: '',
    eisStatus: '',
    hrdRegisterNo: '',
    statutoryEntitlementCodes: [],
    commissionSettingCodes: [],
  },
  taxInformation: {
    agreeWithTerms: false,
  },
  leave: {
    leavePolicyCodes: ['AL', 'ML'],
    annualLeaveEntitlement: null,
    annualLeavePeriod: 'year',
    medicalLeaveEntitlement: null,
    medicalLeavePeriod: 'year',
  },
  emergencyContact: {
    contactName: '',
    relationship: '',
    contactNo: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    postcode: '',
    state: '',
    country: '',
  },
};

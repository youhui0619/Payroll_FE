import type { EmployeeRecord } from '../models/employee.model';

export const employees: EmployeeRecord[] = [
  {
    employeeId: 'EMP-0042',
    employeeName: 'Aisyah Nur Abdullah',
    initials: 'AN',
    nricPassportNo: '900101-14-5678',
    dateOfBirth: '1990-01-01',
    gender: 'Female',
    nationality: 'Malaysian',
    race: 'Malay',
    religion: 'Islam',
    maritalStatus: 'Single',
    tin: 'IG58660031000',
    email: 'aisyah.abdullah@example.com',
    contactNo: '+60 12-345 6789',
    address: '12, Jalan Bukit Kempas 1/18, Taman Bukit Kempas, 81200 Johor Bahru, Johor',
    department: 'Finance',
    position: 'Finance Executive',
    reportingManager: 'Finance Manager',
    workLocation: 'Johor Bahru Office',
    employmentStatus: 'Active',
    employmentType: 'Permanent',
    joinedDate: '2022-03-01',
    confirmationDate: '2022-06-01',
    resignationDate: null,
    basicSalary: 4500,
    salaryType: 'Monthly',
    paymentMethod: 'Transfer by bank',
    bank: 'Maybank',
    bankAccount: '1234567890',
    epfEmployeeNo: 'EPF-0042',
    epfEmployerNo: 'ER-0042',
    kwspNo: '21454610',
    socsoNo: 'SOCSO-0042',
    eisStatus: 'Active',
    emergencyContactName: 'Nur Abdullah',
    emergencyContactRelationship: 'Parent',
    emergencyContactNo: '+60 12-111 2222'
  },
  {
    employeeId: 'EMP-0043',
    employeeName: 'Daniel Lim Wei Jian',
    initials: 'DL',
    nricPassportNo: '880505-10-4321',
    dateOfBirth: '1988-05-05',
    gender: 'Male',
    nationality: 'Malaysian',
    race: 'Chinese',
    religion: 'Buddhism',
    maritalStatus: 'Married',
    tin: 'IG5530939090',
    email: 'daniel.lim@example.com',
    contactNo: '+60 13-456 7890',
    address: '8, Jalan Kempas Utama 2/5, 81200 Johor Bahru, Johor',
    department: 'Operations',
    position: 'Operations Executive',
    reportingManager: 'Operations Manager',
    workLocation: 'Johor Bahru Office',
    employmentStatus: 'Active',
    employmentType: 'Permanent',
    joinedDate: '2021-07-15',
    confirmationDate: '2021-10-15',
    resignationDate: null,
    basicSalary: 5200,
    salaryType: 'Monthly',
    paymentMethod: 'Transfer by bank',
    bank: 'CIMB',
    bankAccount: '9876543210',
    epfEmployeeNo: 'EPF-0043',
    epfEmployerNo: 'ER-0043',
    kwspNo: '12016768',
    socsoNo: 'SOCSO-0043',
    eisStatus: 'Active',
    emergencyContactName: 'Lim Wei Ming',
    emergencyContactRelationship: 'Sibling',
    emergencyContactNo: '+60 16-222 3333'
  }
];

export function getEmployee(employeeId: string): EmployeeRecord {
  const employee = employees.find(record => record.employeeId === employeeId);
  if (!employee) {
    throw new Error(`Employee not found: ${employeeId}`);
  }
  return employee;
}

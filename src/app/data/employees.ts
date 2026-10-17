import type { EmployeeRecord } from '../models/employee.model';

type SampleEmployeeInput = Pick<EmployeeRecord,
  'employeeId' | 'employeeName' | 'nricPassportNo' | 'gender' | 'race' |
  'religion' | 'department' | 'position' | 'basicSalary' | 'contactNo'>;

function createSampleEmployee(input: SampleEmployeeInput): EmployeeRecord {
  const employeeNumber = input.employeeId.slice(-4);
  const initials = input.employeeName
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part[0].toUpperCase())
    .join('');

  return {
    ...input,
    initials,
    dateOfBirth: '1992-04-15',
    nationality: 'Malaysian',
    maritalStatus: 'Single',
    tin: `IG${employeeNumber}001000`,
    email: `${input.employeeName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
    address: '12, Jalan Bukit Kempas, 81200 Johor Bahru, Johor',
    reportingManager: `${input.department} Manager`,
    workLocation: 'Johor Bahru Office',
    employmentStatus: 'Active',
    employmentType: 'Permanent',
    joinedDate: '2023-01-15',
    confirmationDate: '2023-04-15',
    resignationDate: null,
    salaryType: 'Monthly',
    paymentMethod: 'Transfer by bank',
    bank: 'Maybank',
    bankAccount: `100000${employeeNumber}`,
    epfEmployeeNo: `EPF-${employeeNumber}`,
    epfEmployerNo: `ER-${employeeNumber}`,
    kwspNo: `21${employeeNumber}4610`,
    socsoNo: `SOCSO-${employeeNumber}`,
    eisStatus: 'Active',
    emergencyContactName: `Family of ${input.employeeName.split(' ')[0]}`,
    emergencyContactRelationship: 'Family member',
    emergencyContactNo: input.contactNo
  };
}

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
  },
  createSampleEmployee({
    employeeId: 'EMP-0044', employeeName: 'Nurul Huda Ismail', nricPassportNo: '910212-01-5678',
    gender: 'Female', race: 'Malay', religion: 'Islam', department: 'Human Resources',
    position: 'HR Executive', basicSalary: 4200, contactNo: '+60 12-444 0001'
  }),
  createSampleEmployee({
    employeeId: 'EMP-0045', employeeName: 'Kelvin Wong Jun Kai', nricPassportNo: '900630-14-6789',
    gender: 'Male', race: 'Chinese', religion: 'Buddhism', department: 'Information Technology',
    position: 'IT Support Executive', basicSalary: 4800, contactNo: '+60 12-444 0002'
  }),
  createSampleEmployee({
    employeeId: 'EMP-0046', employeeName: 'Hafiz Rahman', nricPassportNo: '920811-10-7890',
    gender: 'Male', race: 'Malay', religion: 'Islam', department: 'Sales',
    position: 'Sales Executive', basicSalary: 4000, contactNo: '+60 12-444 0003'
  }),
  createSampleEmployee({
    employeeId: 'EMP-0047', employeeName: 'Priya Nair', nricPassportNo: '930305-08-8901',
    gender: 'Female', race: 'Indian', religion: 'Hinduism', department: 'Marketing',
    position: 'Marketing Executive', basicSalary: 4100, contactNo: '+60 12-444 0004'
  }),
  createSampleEmployee({
    employeeId: 'EMP-0048', employeeName: 'Suresh Kumar', nricPassportNo: '890924-05-9012',
    gender: 'Male', race: 'Indian', religion: 'Hinduism', department: 'Customer Service',
    position: 'Customer Support Executive', basicSalary: 3600, contactNo: '+60 12-444 0005'
  }),
  createSampleEmployee({
    employeeId: 'EMP-0049', employeeName: 'Farid Iskandar', nricPassportNo: '940117-01-0123',
    gender: 'Male', race: 'Malay', religion: 'Islam', department: 'Procurement',
    position: 'Procurement Executive', basicSalary: 3900, contactNo: '+60 12-444 0006'
  }),
  createSampleEmployee({
    employeeId: 'EMP-0050', employeeName: 'Chloe Tan Mei Xin', nricPassportNo: '950719-10-1234',
    gender: 'Female', race: 'Chinese', religion: 'Christianity', department: 'Legal and Compliance',
    position: 'Compliance Executive', basicSalary: 5000, contactNo: '+60 12-444 0007'
  }),
  createSampleEmployee({
    employeeId: 'EMP-0051', employeeName: 'Jason Lee Wei Ming', nricPassportNo: '911102-14-2345',
    gender: 'Male', race: 'Chinese', religion: 'Buddhism', department: 'Corporate',
    position: 'Administrative Executive', basicSalary: 3800, contactNo: '+60 12-444 0008'
  })
];

export function getEmployee(employeeId: string): EmployeeRecord {
  const employee = employees.find(record => record.employeeId === employeeId);
  if (!employee) {
    throw new Error(`Employee not found: ${employeeId}`);
  }
  return employee;
}

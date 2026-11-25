import type { Employee, OvertimeCalculationBasis } from '../../models/workforce/employee.model';
import type { EmploymentStatus, EmploymentType } from '../../models/workforce/employment-status.model';
import type { WorkingSchedule } from '../../models/working-schedule/working-schedule.model';
import { WORKING_SCHEDULE } from '../working-schedule/working-schedule.data';

type SampleEmployeeInput = Pick<
  Employee,
  | 'employeeNo'
  | 'name'
  | 'nricPassportNo'
  | 'gender'
  | 'race'
  | 'religion'
  | 'department'
  | 'position'
  | 'basicSalary'
  | 'contactNo'
  | 'employmentStatus'
  | 'employmentType'
> & Partial<Pick<
  Employee,
  | 'id'
  | 'dateOfBirth'
  | 'nationality'
  | 'maritalStatus'
  | 'tin'
  | 'email'
  | 'address'
  | 'reportingManager'
  | 'workLocationId'
  | 'joinedDate'
  | 'confirmationDate'
  | 'resignationDate'
  | 'workingSchedule'
  | 'salaryType'
  | 'paymentMethod'
  | 'bank'
  | 'bankAccount'
  | 'epfEmployeeNo'
  | 'epfEmployerNo'
  | 'epfRate'
  | 'kwspNo'
  | 'socsoNo'
  | 'contributionCategory'
  | 'eisStatus'
  | 'hrdRegisterNo'
  | 'statutoryEntitlementCodes'
  | 'commissionSettingCodes'
  | 'includeOvertime'
  | 'overtimeCalculationBasis'
  | 'overtimeHourlyRate'
  | 'leavePolicyCodes'
  | 'leaveEntitlementOverrides'
  | 'leaveServiceEntitlementTiers'
  | 'emergencyContactName'
  | 'emergencyContactRelationship'
  | 'emergencyContactNo'
  | 'emergencyContactAddress'
>>;

const defaultStatutoryEntitlementCodes = ['EPF', 'SOCSO', 'LHDN', 'EIS', 'HRD_CORP_LEVY'];

function cloneWorkingSchedule(schedule: WorkingSchedule): WorkingSchedule {
  return { days: schedule.days.map(day => ({ ...day })) };
}

function createSampleEmployee(input: SampleEmployeeInput): Employee {
  const employeeNumber = input.employeeNo.slice(-4);
  const fullName = input.name.trim();
  const initials = fullName
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase() ?? '')
    .join('');
  const statutoryEntitlementCodes = input.statutoryEntitlementCodes ?? [...defaultStatutoryEntitlementCodes];
  const hasEpf = statutoryEntitlementCodes.includes('EPF');
  const hasSocso = statutoryEntitlementCodes.includes('SOCSO');
  const hasLhdn = statutoryEntitlementCodes.includes('LHDN');
  const hasEis = statutoryEntitlementCodes.includes('EIS');
  const hasHrdCorpLevy = statutoryEntitlementCodes.includes('HRD_CORP_LEVY');

  return {
    id: input.id ?? input.employeeNo,
    employeeNo: input.employeeNo,
    name: fullName,
    initials,
    nricPassportNo: input.nricPassportNo,
    dateOfBirth: input.dateOfBirth ?? '1992-04-15',
    gender: input.gender,
    nationality: input.nationality ?? 'MALAYSIAN',
    race: input.race,
    religion: input.religion,
    maritalStatus: input.maritalStatus ?? 'SINGLE',
    tin: input.tin ?? (hasLhdn ? `IG${employeeNumber}001000` : ''),
    email: input.email ?? `${fullName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
    contactNo: input.contactNo,
    address: input.address ?? '12, Jalan Bukit Kempas, 81200 Johor Bahru, Johor',
    department: input.department,
    position: input.position,
    reportingManager: input.reportingManager ?? `${input.department} Manager`,
    workLocationId: input.workLocationId ?? 'LOC-0003',
    employmentStatus: input.employmentStatus,
    employmentType: input.employmentType,
    joinedDate: input.joinedDate ?? '2023-01-15',
    confirmationDate: input.confirmationDate === undefined ? '2023-04-15' : input.confirmationDate,
    resignationDate: input.resignationDate ?? null,
    workingSchedule: cloneWorkingSchedule(input.workingSchedule ?? WORKING_SCHEDULE[input.employmentType]),
    basicSalary: input.basicSalary,
    salaryType: input.salaryType ?? 'MONTHLY',
    paymentMethod: input.paymentMethod ?? 'BANK',
    bank: input.bank ?? 'MAYBANK',
    bankAccount: input.bankAccount ?? `100000${employeeNumber}`,
    epfEmployeeNo: input.epfEmployeeNo ?? (hasEpf ? `EPF-${employeeNumber}` : ''),
    epfEmployerNo: input.epfEmployerNo ?? (hasEpf ? `ER-${employeeNumber}` : ''),
    epfRate: input.epfRate ?? (hasEpf ? '11' : ''),
    kwspNo: input.kwspNo ?? (hasEpf ? `21${employeeNumber}4610` : ''),
    socsoNo: input.socsoNo ?? (hasSocso ? `SOCSO-${employeeNumber}` : ''),
    contributionCategory: input.contributionCategory ?? (hasSocso ? 'CATEGORY1' : ''),
    eisStatus: input.eisStatus ?? (hasEis ? 'ACTIVE' : 'NONE'),
    hrdRegisterNo: input.hrdRegisterNo ?? (hasHrdCorpLevy ? `HRD-${employeeNumber}` : ''),
    statutoryEntitlementCodes,
    commissionSettingCodes: input.commissionSettingCodes ?? [],
    includeOvertime: input.includeOvertime ?? false,
    overtimeCalculationBasis: input.overtimeCalculationBasis ?? 'HOURLY_RATE',
    overtimeHourlyRate: input.includeOvertime && (input.overtimeCalculationBasis ?? 'HOURLY_RATE') === 'HOURLY_RATE'
      ? input.overtimeHourlyRate ?? null
      : null,
    leavePolicyCodes: input.leavePolicyCodes ?? ['AL', 'ML'],
    leaveEntitlementOverrides: input.leaveEntitlementOverrides ?? {},
    leaveServiceEntitlementTiers: input.leaveServiceEntitlementTiers ?? {},
    emergencyContactName: input.emergencyContactName ?? `Family of ${fullName.split(' ')[0]}`,
    emergencyContactRelationship: input.emergencyContactRelationship ?? 'FAMILY_MEMBER',
    emergencyContactNo: input.emergencyContactNo ?? input.contactNo,
    emergencyContactAddress: input.emergencyContactAddress ?? '12, Jalan Bukit Kempas, 81200 Johor Bahru, Johor'
  };
}

export const employees: Employee[] = [
  createSampleEmployee({
    employeeNo: 'EMP-0042', name: 'Aisyah Nur Abdullah', nricPassportNo: '900101-14-5678',
    gender: 'FEMALE', race: 'MALAY', religion: 'ISLAM', department: 'Finance', position: 'Finance Executive',
    basicSalary: 4500, contactNo: '+60 12-345 6789', employmentStatus: 'ACTIVE', employmentType: 'PERMANENT',
    dateOfBirth: '1990-01-01', joinedDate: '2022-03-01', confirmationDate: '2022-06-01',
    includeOvertime: true, overtimeHourlyRate: 32
  }),
  createSampleEmployee({
    employeeNo: 'EMP-0043', name: 'Daniel Lim Wei Jian', nricPassportNo: '880505-10-4321',
    gender: 'MALE', race: 'CHINESE', religion: 'BUDDISM', department: 'Operations', position: 'Operations Executive',
    basicSalary: 5200, contactNo: '+60 13-456 7890', employmentStatus: 'ACTIVE', employmentType: 'PERMANENT',
    dateOfBirth: '1988-05-05', joinedDate: '2021-07-15', confirmationDate: '2021-10-15',
    overtimeCalculationBasis: 'DAILY_RATE_CONVERTED', includeOvertime: true
  }),
  createSampleEmployee({
    employeeNo: 'EMP-0044', name: 'Nurul Huda Ismail', nricPassportNo: '910212-01-5678',
    gender: 'FEMALE', race: 'MALAY', religion: 'ISLAM', department: 'Human Resources', position: 'HR Executive',
    basicSalary: 4200, contactNo: '+60 12-444 0001', employmentStatus: 'ACTIVE', employmentType: 'CONTRACT',
    overtimeCalculationBasis: 'MONTHLY_SALARY_CONVERTED', includeOvertime: true
  }),
  createSampleEmployee({
    employeeNo: 'EMP-0045', name: 'Kelvin Wong Jun Kai', nricPassportNo: '900630-14-6789',
    gender: 'MALE', race: 'CHINESE', religion: 'BUDDISM', department: 'Information Technology', position: 'IT Support Executive',
    basicSalary: 4800, contactNo: '+60 12-444 0002', employmentStatus: 'ACTIVE', employmentType: 'PART-TIME',
    includeOvertime: true, overtimeHourlyRate: 28.5
  }),
  createSampleEmployee({
    employeeNo: 'EMP-0046', name: 'Hafiz Rahman', nricPassportNo: '920811-10-7890',
    gender: 'MALE', race: 'MALAY', religion: 'ISLAM', department: 'Sales', position: 'Sales Executive',
    basicSalary: 4000, contactNo: '+60 12-444 0003', employmentStatus: 'PROBATION', employmentType: 'INTERN',
    confirmationDate: null, commissionSettingCodes: ['SALES-COMM', 'NEW-CLIENT', 'QTR-PERF']
  }),
  createSampleEmployee({
    employeeNo: 'EMP-0047', name: 'Priya Nair', nricPassportNo: '930305-08-8901',
    gender: 'FEMALE', race: 'INDIAN', religion: 'HINDUISM', department: 'Marketing', position: 'Marketing Executive',
    basicSalary: 4100, contactNo: '+60 12-444 0004', employmentStatus: 'ACTIVE', employmentType: 'TEMPORARY'
  }),
  createSampleEmployee({
    employeeNo: 'EMP-0048', name: 'Suresh Kumar', nricPassportNo: '890924-05-9012',
    gender: 'MALE', race: 'INDIAN', religion: 'HINDUISM', department: 'Customer Service', position: 'Customer Support Executive',
    basicSalary: 3600, contactNo: '+60 12-444 0005', employmentStatus: 'PROBATION', employmentType: 'TRAINEE',
    confirmationDate: null
  }),
  createSampleEmployee({
    employeeNo: 'EMP-0049', name: 'Farid Iskandar', nricPassportNo: '940117-01-0123',
    gender: 'MALE', race: 'MALAY', religion: 'ISLAM', department: 'Procurement', position: 'Procurement Executive',
    basicSalary: 3900, contactNo: '+60 12-444 0006', employmentStatus: 'ACTIVE', employmentType: 'FREELANCE'
  }),
  createSampleEmployee({
    employeeNo: 'EMP-0050', name: 'Chloe Tan Mei Xin', nricPassportNo: '950719-10-1234',
    gender: 'FEMALE', race: 'CHINESE', religion: 'CHRISTIANITY', department: 'Legal and Compliance', position: 'Compliance Executive',
    basicSalary: 5000, contactNo: '+60 12-444 0007', employmentStatus: 'ACTIVE', employmentType: 'CASUAL'
  }),
  createSampleEmployee({
    employeeNo: 'EMP-0051', name: 'Jason Lee Wei Ming', nricPassportNo: '911102-14-2345',
    gender: 'MALE', race: 'CHINESE', religion: 'BUDDISM', department: 'Corporate', position: 'Administrative Executive',
    basicSalary: 3800, contactNo: '+60 12-444 0008', employmentStatus: 'SUSPENDED', employmentType: 'CONTRACT'
  }),
  createSampleEmployee({
    employeeNo: 'EMP-0052', name: 'Marcus Tan', nricPassportNo: '870312-10-3456',
    gender: 'MALE', race: 'CHINESE', religion: 'CHRISTIANITY', department: 'Information Technology', position: 'IT Manager',
    basicSalary: 8500, contactNo: '+60 12-444 0009', reportingManager: 'Operations Manager',
    employmentStatus: 'ACTIVE', employmentType: 'PERMANENT', includeOvertime: true, overtimeHourlyRate: 50
  }),
  createSampleEmployee({
    employeeNo: 'EMP-0053', name: 'Siti Amina Hassan', nricPassportNo: '950624-01-4567',
    gender: 'FEMALE', race: 'MALAY', religion: 'ISLAM', department: 'Information Technology', position: 'Software Developer',
    basicSalary: 6200, contactNo: '+60 12-444 0010', reportingManager: 'IT Manager',
    employmentStatus: 'RESIGNED', employmentType: 'PERMANENT', joinedDate: '2022-01-10', confirmationDate: '2022-04-10',
    resignationDate: '2025-06-30'
  }),
  createSampleEmployee({
    employeeNo: 'EMP-0054', name: 'Arjun Menon', nricPassportNo: '920815-08-5678',
    gender: 'MALE', race: 'INDIAN', religion: 'HINDUISM', department: 'Information Technology', position: 'Systems Administrator',
    basicSalary: 5800, contactNo: '+60 12-444 0011', reportingManager: 'IT Manager',
    employmentStatus: 'TERMINATED', employmentType: 'PERMANENT', resignationDate: '2025-02-28', statutoryEntitlementCodes: []
  }),
  createSampleEmployee({
    employeeNo: 'EMP-0055', name: 'Ethan Chua', nricPassportNo: '900927-10-6789',
    gender: 'MALE', race: 'CHINESE', religion: 'BUDDISM', department: 'Information Technology', position: 'Network Engineer',
    basicSalary: 7000, contactNo: '+60 12-444 0012', reportingManager: 'IT Manager',
    employmentStatus: 'RETIRED', employmentType: 'PERMANENT', dateOfBirth: '1964-09-27', joinedDate: '2000-03-01',
    confirmationDate: '2000-06-01', resignationDate: '2025-12-31', statutoryEntitlementCodes: []
  })
];

export function getEmployee(employeeNo: string): Employee {
  const employee = employees.find(record => record.employeeNo === employeeNo || record.id === employeeNo);
  if (!employee) throw new Error(`Employee not found: ${employeeNo}`);
  return employee;
}

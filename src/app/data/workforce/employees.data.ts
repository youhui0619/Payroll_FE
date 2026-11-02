import type { EmployeeRecord, OvertimeCalculationBasis } from '../../models/workforce/employee.model';
import type { WorkingDayName, WorkingDaySchedule, WorkingSchedule } from '../../models/working-schedule/working-schedule.model';
import { WORKING_SCHEDULE } from '../working-schedule/working-schedule.data';
import { payrollSettings } from '../payroll/payroll-settings.data';

type SampleEmployeeInput = Pick<EmployeeRecord,
  'employeeId' | 'employeeName' | 'nricPassportNo' | 'gender' | 'race' |
  'religion' | 'department' | 'position' | 'basicSalary' | 'contactNo' |
  'employmentStatus' | 'employmentType'> & {
    dateOfBirth?: string;
    joinedDate?: string;
    confirmationDate?: string | null;
    resignationDate?: string | null;
    workingSchedule?: WorkingSchedule;
    reportingManager?: string;
    commissionSettingCodes?: string[];
    includeOvertime?: boolean;
    overtimeCalculationBasis?: OvertimeCalculationBasis;
    overtimeHourlyRate?: number | null;
    epfRate?: string;
    contributionCategory?: string;
    hrdRegisterNo?: string;
    statutoryEntitlementCodes?: string[];
  };

function cloneWorkingSchedule(schedule: WorkingSchedule): WorkingSchedule {
  return { days: schedule.days.map(day => ({ ...day })) };
}

type WorkingDayScheduleOverride = Pick<WorkingDaySchedule, 'day'> & Partial<Omit<WorkingDaySchedule, 'day'>>;

function createWorkingScheduleOverride(
  baseSchedule: WorkingSchedule,
  overrides: WorkingDayScheduleOverride[]
): WorkingSchedule {
  const overridesByDay = new Map<WorkingDayName, Partial<WorkingDaySchedule>>(
    overrides.map(override => [override.day, override])
  );

  return {
    days: baseSchedule.days.map(day => ({ ...day, ...overridesByDay.get(day.day) }))
  };
}

const defaultStatutoryEntitlementCodes = [
  ...(payrollSettings.includeEpf ? ['EPF'] : []),
  ...(payrollSettings.includeSocso ? ['SOCSO'] : []),
  ...(payrollSettings.includePcb ? ['LHDN'] : []),
  ...(payrollSettings.includeEis ? ['EIS'] : []),
  ...(payrollSettings.includeHrdCorpLevy ? ['HRD_CORP_LEVY'] : []),
];

function createSampleEmployee(input: SampleEmployeeInput): EmployeeRecord {
  const employeeNumber = input.employeeId.slice(-4);
  const statutoryEntitlementCodes = input.statutoryEntitlementCodes ?? [...defaultStatutoryEntitlementCodes];
  const hasEpf = statutoryEntitlementCodes.includes('EPF');
  const hasSocso = statutoryEntitlementCodes.includes('SOCSO');
  const hasLhdn = statutoryEntitlementCodes.includes('LHDN');
  const hasEis = statutoryEntitlementCodes.includes('EIS');
  const hasHrdCorpLevy = statutoryEntitlementCodes.includes('HRD_CORP_LEVY');
  const initials = input.employeeName
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part[0].toUpperCase())
    .join('');

  return {
    ...input,
    initials,
    dateOfBirth: input.dateOfBirth ?? '1992-04-15',
    nationality: 'Malaysian',
    maritalStatus: 'Single',
    tin: hasLhdn ? `IG${employeeNumber}001000` : '',
    email: `${input.employeeName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
    address: '12, Jalan Bukit Kempas, 81200 Johor Bahru, Johor',
    reportingManager: input.reportingManager ?? `${input.department} Manager`,
    workLocation: 'Johor Bahru Office',
    employmentStatus: input.employmentStatus,
    employmentType: input.employmentType,
    joinedDate: input.joinedDate ?? '2023-01-15',
    confirmationDate: input.confirmationDate === undefined ? '2023-04-15' : input.confirmationDate,
    resignationDate: input.resignationDate ?? null,
    workingSchedule: cloneWorkingSchedule(input.workingSchedule ?? WORKING_SCHEDULE[input.employmentType]),
    salaryType: 'Monthly',
    paymentMethod: 'Transfer by bank',
    bank: 'Maybank',
    bankAccount: `100000${employeeNumber}`,
    epfEmployeeNo: hasEpf ? `EPF-${employeeNumber}` : '',
    epfEmployerNo: hasEpf ? `ER-${employeeNumber}` : '',
    epfRate: input.epfRate ?? (hasEpf ? '11' : ''),
    kwspNo: hasEpf ? `21${employeeNumber}4610` : '',
    socsoNo: hasSocso ? `SOCSO-${employeeNumber}` : '',
    contributionCategory: input.contributionCategory ?? (hasSocso ? 'category1' : ''),
    eisStatus: hasEis ? 'Active' : 'Not Applicable',
    hrdRegisterNo: hasHrdCorpLevy ? (input.hrdRegisterNo ?? `HRD-${employeeNumber}`) : '',
    statutoryEntitlementCodes,
    commissionSettingCodes: input.commissionSettingCodes ?? [],
    includeOvertime: input.includeOvertime ?? false,
    overtimeCalculationBasis: input.overtimeCalculationBasis ?? 'HOURLY_RATE',
    overtimeHourlyRate: input.includeOvertime && (input.overtimeCalculationBasis ?? 'HOURLY_RATE') === 'HOURLY_RATE'
      ? input.overtimeHourlyRate ?? null
      : null,
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
    workingSchedule: createWorkingScheduleOverride(WORKING_SCHEDULE.Permanent, [
      { day: 'Monday', startTime: '08:30', endTime: '17:30', breakStartTime: '12:30', breakEndTime: '13:30' },
      { day: 'Tuesday', startTime: '08:30', endTime: '17:30', breakStartTime: '12:30', breakEndTime: '13:30' },
      { day: 'Wednesday', startTime: '08:30', endTime: '17:30', breakStartTime: '12:30', breakEndTime: '13:30' },
      { day: 'Thursday', startTime: '08:30', endTime: '17:30', breakStartTime: '12:30', breakEndTime: '13:30' },
      { day: 'Friday', startTime: '08:30', endTime: '17:30', breakStartTime: '12:30', breakEndTime: '13:30' },
      { day: 'Saturday', isWorkingDay: false }
    ]),
    basicSalary: 4500,
    salaryType: 'Monthly',
    paymentMethod: 'Transfer by bank',
    bank: 'Maybank',
    bankAccount: '1234567890',
    epfEmployeeNo: 'EPF-0042',
    epfEmployerNo: 'ER-0042',
    epfRate: '11',
    kwspNo: '21454610',
    socsoNo: 'SOCSO-0042',
    contributionCategory: 'category1',
    eisStatus: 'Active',
    hrdRegisterNo: '',
    statutoryEntitlementCodes: [...defaultStatutoryEntitlementCodes],
    commissionSettingCodes: [],
    includeOvertime: true,
    overtimeCalculationBasis: 'HOURLY_RATE',
    overtimeHourlyRate: 32,
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
    workingSchedule: createWorkingScheduleOverride(WORKING_SCHEDULE.Permanent, [
      { day: 'Monday', startTime: '08:00', endTime: '17:00', breakStartTime: '12:00', breakEndTime: '13:00' },
      { day: 'Tuesday', startTime: '08:00', endTime: '17:00', breakStartTime: '12:00', breakEndTime: '13:00' },
      { day: 'Wednesday', startTime: '08:00', endTime: '17:00', breakStartTime: '12:00', breakEndTime: '13:00' },
      { day: 'Thursday', startTime: '08:00', endTime: '17:00', breakStartTime: '12:00', breakEndTime: '13:00' },
      { day: 'Friday', startTime: '08:00', endTime: '17:00', breakStartTime: '12:00', breakEndTime: '13:00' },
      { day: 'Saturday', startTime: '08:00', endTime: '12:00', breakStartTime: '', breakEndTime: '' }
    ]),
    basicSalary: 5200,
    salaryType: 'Monthly',
    paymentMethod: 'Transfer by bank',
    bank: 'CIMB',
    bankAccount: '9876543210',
    epfEmployeeNo: 'EPF-0043',
    epfEmployerNo: 'ER-0043',
    epfRate: '11',
    kwspNo: '12016768',
    socsoNo: 'SOCSO-0043',
    contributionCategory: 'category1',
    eisStatus: 'Active',
    hrdRegisterNo: '',
    statutoryEntitlementCodes: [...defaultStatutoryEntitlementCodes],
    commissionSettingCodes: [],
    includeOvertime: true,
    overtimeCalculationBasis: 'DAILY_RATE_CONVERTED',
    overtimeHourlyRate: null,
    emergencyContactName: 'Lim Wei Ming',
    emergencyContactRelationship: 'Sibling',
    emergencyContactNo: '+60 16-222 3333'
  },
  createSampleEmployee({
    employeeId: 'EMP-0044', employeeName: 'Nurul Huda Ismail', nricPassportNo: '910212-01-5678',
    gender: 'Female', race: 'Malay', religion: 'Islam', department: 'Human Resources',
    position: 'HR Executive', basicSalary: 4200, contactNo: '+60 12-444 0001',
    employmentType: 'Contract', employmentStatus: 'Active',
    includeOvertime: true, overtimeCalculationBasis: 'MONTHLY_SALARY_CONVERTED'
  }),
  createSampleEmployee({
    employeeId: 'EMP-0045', employeeName: 'Kelvin Wong Jun Kai', nricPassportNo: '900630-14-6789',
    gender: 'Male', race: 'Chinese', religion: 'Buddhism', department: 'Information Technology',
    position: 'IT Support Executive', basicSalary: 4800, contactNo: '+60 12-444 0002',
    employmentType: 'Part-time', employmentStatus: 'Active',
    includeOvertime: true, overtimeCalculationBasis: 'HOURLY_RATE', overtimeHourlyRate: 28.5
  }),
  createSampleEmployee({
    employeeId: 'EMP-0046', employeeName: 'Hafiz Rahman', nricPassportNo: '920811-10-7890',
    gender: 'Male', race: 'Malay', religion: 'Islam', department: 'Sales',
    position: 'Sales Executive', basicSalary: 4000, contactNo: '+60 12-444 0003',
    employmentType: 'Intern', employmentStatus: 'Probation', confirmationDate: null,
    commissionSettingCodes: ['SALES-COMM', 'NEW-CLIENT', 'QTR-PERF']
  }),
  createSampleEmployee({
    employeeId: 'EMP-0047', employeeName: 'Priya Nair', nricPassportNo: '930305-08-8901',
    gender: 'Female', race: 'Indian', religion: 'Hinduism', department: 'Marketing',
    position: 'Marketing Executive', basicSalary: 4100, contactNo: '+60 12-444 0004',
    employmentType: 'Temporary', employmentStatus: 'Active'
  }),
  createSampleEmployee({
    employeeId: 'EMP-0048', employeeName: 'Suresh Kumar', nricPassportNo: '890924-05-9012',
    gender: 'Male', race: 'Indian', religion: 'Hinduism', department: 'Customer Service',
    position: 'Customer Support Executive', basicSalary: 3600, contactNo: '+60 12-444 0005',
    employmentType: 'Trainee', employmentStatus: 'Probation', confirmationDate: null
  }),
  createSampleEmployee({
    employeeId: 'EMP-0049', employeeName: 'Farid Iskandar', nricPassportNo: '940117-01-0123',
    gender: 'Male', race: 'Malay', religion: 'Islam', department: 'Procurement',
    position: 'Procurement Executive', basicSalary: 3900, contactNo: '+60 12-444 0006',
    employmentType: 'Freelance', employmentStatus: 'Active'
  }),
  createSampleEmployee({
    employeeId: 'EMP-0050', employeeName: 'Chloe Tan Mei Xin', nricPassportNo: '950719-10-1234',
    gender: 'Female', race: 'Chinese', religion: 'Christianity', department: 'Legal and Compliance',
    position: 'Compliance Executive', basicSalary: 5000, contactNo: '+60 12-444 0007',
    employmentType: 'Casual', employmentStatus: 'Active'
  }),
  createSampleEmployee({
    employeeId: 'EMP-0051', employeeName: 'Jason Lee Wei Ming', nricPassportNo: '911102-14-2345',
    gender: 'Male', race: 'Chinese', religion: 'Buddhism', department: 'Corporate',
    position: 'Administrative Executive', basicSalary: 3800, contactNo: '+60 12-444 0008',
    employmentType: 'Contract', employmentStatus: 'Suspended'
  }),
  createSampleEmployee({
    employeeId: 'EMP-0052', employeeName: 'Marcus Tan', nricPassportNo: '870312-10-3456',
    gender: 'Male', race: 'Chinese', religion: 'Christianity', department: 'Information Technology',
    position: 'IT Manager', basicSalary: 8500, contactNo: '+60 12-444 0009', reportingManager: 'Operations Manager',
    employmentType: 'Permanent', employmentStatus: 'Active',
    includeOvertime: true, overtimeCalculationBasis: 'HOURLY_RATE', overtimeHourlyRate: 50
  }),
  createSampleEmployee({
    employeeId: 'EMP-0053', employeeName: 'Siti Amina Hassan', nricPassportNo: '950624-01-4567',
    gender: 'Female', race: 'Malay', religion: 'Islam', department: 'Information Technology',
    position: 'Software Developer', basicSalary: 6200, contactNo: '+60 12-444 0010', reportingManager: 'IT Manager',
    employmentType: 'Permanent', employmentStatus: 'Resigned',
    joinedDate: '2022-01-10', confirmationDate: '2022-04-10', resignationDate: '2025-06-30'
  }),
  createSampleEmployee({
    employeeId: 'EMP-0054', employeeName: 'Arjun Menon', nricPassportNo: '920815-08-5678',
    gender: 'Male', race: 'Indian', religion: 'Hinduism', department: 'Information Technology',
    position: 'Systems Administrator', basicSalary: 5800, contactNo: '+60 12-444 0011', reportingManager: 'IT Manager',
    employmentType: 'Permanent', employmentStatus: 'Terminated', resignationDate: '2025-02-28',
    statutoryEntitlementCodes: []
  }),
  createSampleEmployee({
    employeeId: 'EMP-0055', employeeName: 'Ethan Chua', nricPassportNo: '900927-10-6789',
    gender: 'Male', race: 'Chinese', religion: 'Buddhism', department: 'Information Technology',
    position: 'Network Engineer', basicSalary: 7000, contactNo: '+60 12-444 0012', reportingManager: 'IT Manager',
    employmentType: 'Permanent', employmentStatus: 'Retired', dateOfBirth: '1964-09-27',
    joinedDate: '2000-03-01', confirmationDate: '2000-06-01', resignationDate: '2025-12-31',
    statutoryEntitlementCodes: []
  })
];

export function getEmployee(employeeId: string): EmployeeRecord {
  const employee = employees.find(record => record.employeeId === employeeId);
  if (!employee) {
    throw new Error(`Employee not found: ${employeeId}`);
  }
  return employee;
}

import type { Position } from '../models/position.model';

export const positions: Position[] = [
  {
    id: 'POS-0001',
    code: 'CORP-DIR',
    title: 'Corporate Director',
    jobLevel: 'DIRECTOR',
    description: 'Leads company strategy, governance, and overall business performance.',
    departmentId: 'DEP-0001',
    reportsTo: null,
    effectiveFrom: '2020-01-01',
    effectiveTo: null
  },
  {
    id: 'POS-0002',
    code: 'FIN-MGR',
    title: 'Finance Manager',
    jobLevel: 'MANAGER',
    description: 'Leads accounting, payroll, budgeting, and financial reporting.',
    departmentId: 'DEP-0002',
    reportsTo: 'Corporate Director',
    effectiveFrom: '2020-01-01',
    effectiveTo: null
  },
  {
    id: 'POS-0003',
    code: 'OPS-MGR',
    title: 'Operations Manager',
    jobLevel: 'MANAGER',
    description: 'Oversees daily operations, service delivery, and operational planning.',
    departmentId: 'DEP-0003',
    reportsTo: 'Corporate Director',
    effectiveFrom: '2020-01-01',
    effectiveTo: null
  },
  {
    id: 'POS-0004',
    code: 'HR-MGR',
    title: 'Human Resources Manager',
    jobLevel: 'MANAGER',
    description: 'Leads workforce planning, employee relations, and people operations.',
    departmentId: 'DEP-0004',
    reportsTo: 'Corporate Director',
    effectiveFrom: '2021-01-01',
    effectiveTo: null
  },
  {
    id: 'POS-0005',
    code: 'IT-MGR',
    title: 'IT Manager',
    jobLevel: 'MANAGER',
    description: 'Oversees business systems, infrastructure, and technical support.',
    departmentId: 'DEP-0005',
    reportsTo: 'Operations Manager',
    effectiveFrom: '2021-01-01',
    effectiveTo: null
  },
  {
    id: 'POS-0006',
    code: 'FIN-EXEC',
    title: 'Finance Executive',
    jobLevel: 'INTERMEDIATE',
    description: 'Supports accounting operations, payroll processing, and reporting.',
    departmentId: 'DEP-0002',
    reportsTo: 'Finance Manager',
    effectiveFrom: '2022-03-01',
    effectiveTo: null
  },
  {
    id: 'POS-0007',
    code: 'OPS-EXEC',
    title: 'Operations Executive',
    jobLevel: 'INTERMEDIATE',
    description: 'Coordinates daily workflows and supports service delivery.',
    departmentId: 'DEP-0003',
    reportsTo: 'Operations Manager',
    effectiveFrom: '2021-07-15',
    effectiveTo: null
  },
  {
    id: 'POS-0008',
    code: 'HR-EXEC',
    title: 'HR Executive',
    jobLevel: 'ENTRY',
    description: 'Supports recruitment, employee records, and HR administration.',
    departmentId: 'DEP-0004',
    reportsTo: 'Human Resources Manager',
    effectiveFrom: '2023-01-15',
    effectiveTo: null
  },
  {
    id: 'POS-0009',
    code: 'IT-SUPPORT',
    title: 'IT Support Executive',
    jobLevel: 'ENTRY',
    description: 'Provides first-line technical assistance and maintains user equipment.',
    departmentId: 'DEP-0005',
    reportsTo: 'IT Manager',
    effectiveFrom: '2023-01-15',
    effectiveTo: null
  },
  {
    id: 'POS-0010',
    code: 'SALES-EXEC',
    title: 'Sales Executive',
    jobLevel: 'INTERMEDIATE',
    description: 'Builds customer relationships and supports new business development.',
    departmentId: 'DEP-0006',
    reportsTo: 'Corporate Director',
    effectiveFrom: '2023-01-15',
    effectiveTo: null
  },
  {
    id: 'POS-0011',
    code: 'IT-SOFT-DEV',
    title: 'Software Developer',
    jobLevel: 'INTERMEDIATE',
    description: 'Builds and maintains internal applications and business system integrations.',
    departmentId: 'DEP-0005',
    reportsTo: 'IT Manager',
    effectiveFrom: '2023-01-15',
    effectiveTo: null
  },
  {
    id: 'POS-0012',
    code: 'IT-SYS-ADMIN',
    title: 'Systems Administrator',
    jobLevel: 'INTERMEDIATE',
    description: 'Maintains servers, user accounts, and core business system availability.',
    departmentId: 'DEP-0005',
    reportsTo: 'IT Manager',
    effectiveFrom: '2023-01-15',
    effectiveTo: null
  },
  {
    id: 'POS-0013',
    code: 'IT-NET-ENG',
    title: 'Network Engineer',
    jobLevel: 'SENIOR',
    description: 'Maintains secure and reliable network infrastructure across company locations.',
    departmentId: 'DEP-0005',
    reportsTo: 'IT Manager',
    effectiveFrom: '2023-01-15',
    effectiveTo: null
  }
];

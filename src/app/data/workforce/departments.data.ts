import type { Department } from '../../models/workforce/department.model';

export const departments: Department[] = [
  {
    id: 'DEP-0001',
    name: 'Corporate',
    code: 'CORP',
    description: 'Company-wide administration and leadership.',
    parentDepartmentId: null,
    headOfDepartmentId: null,
    totalEmployees: 1,
    effectiveFrom: '2020-01-01',
    effectiveTo: null,
    status: 'ACTIVE'
  },
  {
    id: 'DEP-0002',
    name: 'Finance',
    code: 'FIN',
    description: 'Accounting, payroll, and financial reporting.',
    parentDepartmentId: 'DEP-0001',
    headOfDepartmentId: 'EMP-0042',
    totalEmployees: 1,
    effectiveFrom: '2020-01-01',
    effectiveTo: null,
    status: 'ACTIVE'
  },
  {
    id: 'DEP-0003',
    name: 'Operations',
    code: 'OPS',
    description: 'Daily business and service operations.',
    parentDepartmentId: 'DEP-0001',
    headOfDepartmentId: 'EMP-0043',
    totalEmployees: 1,
    effectiveFrom: '2020-01-01',
    effectiveTo: null,
    status: 'ACTIVE'
  },
  {
    id: 'DEP-0004',
    name: 'Human Resources',
    code: 'HR',
    description: 'People operations, hiring, and employee support.',
    parentDepartmentId: 'DEP-0001',
    headOfDepartmentId: 'EMP-0042',
    totalEmployees: 1,
    effectiveFrom: '2021-01-01',
    effectiveTo: null,
    status: 'ACTIVE'
  },
  {
    id: 'DEP-0005',
    name: 'Information Technology',
    code: 'IT',
    description: 'Internal systems and technical support.',
    parentDepartmentId: 'DEP-0003',
    headOfDepartmentId: 'EMP-0052',
    totalEmployees: 5,
    effectiveFrom: '2021-01-01',
    effectiveTo: null,
    status: 'ACTIVE'
  },
  {
    id: 'DEP-0006',
    name: 'Sales',
    code: 'SLS',
    description: 'Customer acquisition and account management.',
    parentDepartmentId: 'DEP-0001',
    headOfDepartmentId: 'EMP-0043',
    totalEmployees: 1,
    effectiveFrom: '2021-01-01',
    effectiveTo: null,
    status: 'ACTIVE'
  },
  {
    id: 'DEP-0007',
    name: 'Marketing',
    code: 'MKT',
    description: 'Brand, communications, and marketing campaigns.',
    parentDepartmentId: 'DEP-0001',
    headOfDepartmentId: 'EMP-0042',
    totalEmployees: 1,
    effectiveFrom: '2021-04-01',
    effectiveTo: null,
    status: 'ACTIVE'
  },
  {
    id: 'DEP-0008',
    name: 'Customer Service',
    code: 'CS',
    description: 'Customer enquiries and after-sales support.',
    parentDepartmentId: 'DEP-0003',
    headOfDepartmentId: 'EMP-0043',
    totalEmployees: 1,
    effectiveFrom: '2022-01-01',
    effectiveTo: null,
    status: 'ACTIVE'
  },
  {
    id: 'DEP-0009',
    name: 'Procurement',
    code: 'PRC',
    description: 'Supplier sourcing and purchasing operations.',
    parentDepartmentId: 'DEP-0003',
    headOfDepartmentId: 'EMP-0043',
    totalEmployees: 1,
    effectiveFrom: '2022-01-01',
    effectiveTo: null,
    status: 'ACTIVE'
  },
  {
    id: 'DEP-0010',
    name: 'Legal and Compliance',
    code: 'LGL',
    description: 'Legal affairs, governance, and regulatory compliance.',
    parentDepartmentId: 'DEP-0001',
    headOfDepartmentId: 'EMP-0042',
    totalEmployees: 1,
    effectiveFrom: '2022-06-01',
    effectiveTo: null,
    status: 'ACTIVE'
  }
];

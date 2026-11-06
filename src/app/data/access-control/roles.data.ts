import { permissionModules } from './permission-modules.data';
import type { AccessControlRole, RolePermission } from '../../models/access-control/role.model';

function makePermissions(enabledModules: string[], fullAccessModules: string[] = []): RolePermission[] {
  return permissionModules.map(module => {
    const enabled = enabledModules.includes(module.key);
    const fullAccess = fullAccessModules.includes(module.key);
    return {
      module: module.key,
      view: enabled,
      create: fullAccess,
      edit: fullAccess,
      delete: fullAccess
    };
  });
}

export const roles: AccessControlRole[] = [
  {
    id: 'ROLE-0001',
    name: 'Administrator',
    description: 'Full access to all areas and actions.',
    status: 'ACTIVE',
    permissions: permissionModules.map(module => ({ module: module.key, view: true, create: true, edit: true, delete: true }))
  },
  {
    id: 'ROLE-0002',
    name: 'HR Manager',
    description: 'Manages workforce records and time-off processes.',
    status: 'ACTIVE',
    permissions: makePermissions(['dashboard', 'employees', 'departments', 'positions', 'workLocations', 'attendance', 'leave', 'overtime', 'payslips'], ['employees', 'departments', 'positions', 'workLocations', 'leave', 'overtime'])
  },
  {
    id: 'ROLE-0003',
    name: 'Payroll Manager',
    description: 'Manages payroll, payslips, expenses, and incentives.',
    status: 'ACTIVE',
    permissions: makePermissions(['dashboard', 'employees', 'payroll', 'payslips', 'employeeExpenses', 'commissions'], ['payroll', 'payslips', 'employeeExpenses', 'commissions'])
  },
  {
    id: 'ROLE-0004',
    name: 'Manager',
    description: 'Views team information and manages team requests.',
    status: 'ACTIVE',
    permissions: makePermissions(['dashboard', 'employees', 'attendance', 'leave', 'overtime'], ['leave', 'overtime'])
  },
  {
    id: 'ROLE-0005',
    name: 'Employee',
    description: 'Accesses personal attendance, leave, and payslip information.',
    status: 'ACTIVE',
    permissions: makePermissions(['dashboard', 'attendance', 'leave', 'overtime', 'payslips', 'employeeExpenses'], ['leave', 'overtime', 'employeeExpenses'])
  }
];

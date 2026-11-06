import type { PermissionModule } from '../../models/access-control/role.model';

export const permissionModules: PermissionModule[] = [
  { key: 'dashboard', label: 'Dashboard', group: 'General' },
  { key: 'employees', label: 'Employees', group: 'Workforce' },
  { key: 'departments', label: 'Departments', group: 'Workforce' },
  { key: 'positions', label: 'Positions', group: 'Workforce' },
  { key: 'workLocations', label: 'Work locations', group: 'Workforce' },
  { key: 'attendance', label: 'Attendance', group: 'Time & Leave' },
  { key: 'leave', label: 'Leave', group: 'Time & Leave' },
  { key: 'overtime', label: 'Overtime', group: 'Time & Leave' },
  { key: 'payroll', label: 'Payroll', group: 'Payroll' },
  { key: 'payslips', label: 'Payslips', group: 'Payroll' },
  { key: 'employeeExpenses', label: 'Employee expenses', group: 'Payroll' },
  { key: 'commissions', label: 'Commission & incentives', group: 'Payroll' },
  { key: 'companySettings', label: 'Company and system settings', group: 'Settings' },
  { key: 'accessControl', label: 'Users and access control', group: 'Settings' },
];

export type UserRole = 'Administrator' | 'HR Manager' | 'Payroll Manager' | 'Manager' | 'Employee';
export type UserStatus = 'ACTIVE' | 'INACTIVE';

export interface AccessControlPermission {
  module: string;
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
}

export interface AccessControlUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  permissions: AccessControlPermission[];
}

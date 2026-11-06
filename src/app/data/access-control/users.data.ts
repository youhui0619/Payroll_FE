import type { AccessControlUser } from '../../models/access-control/user.model';

export const users: AccessControlUser[] = [
  {
    id: 'USR-0001',
    fullName: 'Alicia Tan',
    email: 'alicia.tan@example.com',
    roles: ['HR Manager', 'Manager', 'Employee'],
    status: 'ACTIVE'
  },
  {
    id: 'USR-0002',
    fullName: 'Daniel Lee',
    email: 'daniel.lee@example.com',
    roles: ['Payroll Manager'],
    status: 'ACTIVE'
  },
  {
    id: 'USR-0003',
    fullName: 'Mei Wong',
    email: 'mei.wong@example.com',
    roles: ['Employee'],
    status: 'INACTIVE'
  }
];

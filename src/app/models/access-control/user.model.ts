export type UserStatus = 'ACTIVE' | 'INACTIVE';

export interface AccessControlUser {
  id: string;
  fullName: string;
  email: string;
  roles: string[];
  status: UserStatus;
}

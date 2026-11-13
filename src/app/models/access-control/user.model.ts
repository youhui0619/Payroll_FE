export type UserStatus = 'ACTIVE' | 'INACTIVE';

export interface AccessControlUser {
  id: string;
  name: string;
  email: string;
  roles: string[];
  status: UserStatus;
}

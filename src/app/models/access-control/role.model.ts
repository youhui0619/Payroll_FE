export type RoleStatus = 'ACTIVE' | 'INACTIVE';

export interface RolePermission {
  module: string;
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
}

export interface AccessControlRole {
  id: string;
  name: string;
  description: string;
  status: RoleStatus;
  permissions: RolePermission[];
}

export interface PermissionModule {
  key: string;
  label: string;
  group: string;
}

import { FormControl } from "@angular/forms";

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


export type PermissionControls = {
  view: FormControl<boolean>;
  create: FormControl<boolean>;
  edit: FormControl<boolean>;
  delete: FormControl<boolean>;
};

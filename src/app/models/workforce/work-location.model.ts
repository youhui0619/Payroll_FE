export type WorkLocationType = 'OFFICE' | 'BRANCH' | 'WAREHOUSE' | 'REMOTE';

export interface WorkLocation {
  id: string;
  code: string;
  name: string;
  type: WorkLocationType;
  remark: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  postcode: string;
  state: string;
  country: string;
}

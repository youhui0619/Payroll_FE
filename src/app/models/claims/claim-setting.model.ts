export type ClaimTypeSettingStatus = 'ACTIVE' | 'INACTIVE';

export interface ClaimTypeSetting {
  code: string;
  name: string;
  description: string;
  status: ClaimTypeSettingStatus;
}

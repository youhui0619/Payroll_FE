export type PublicHolidayScope = 'National' | 'State';
export type PublicHolidayStatus = 'ACTIVE' | 'INACTIVE';

export interface PublicHolidayRecord {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  scope: PublicHolidayScope;
  regions: string[];
  status: PublicHolidayStatus;
}

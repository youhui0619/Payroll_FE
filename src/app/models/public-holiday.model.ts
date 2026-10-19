export type PublicHolidayScope = 'National' | 'State';
export type PublicHolidayStatus = 'Active' | 'Inactive';

export interface PublicHolidayRecord {
  id: string;
  name: string;
  date: string;
  day: string;
  scope: PublicHolidayScope;
  regions: string[];
  status: PublicHolidayStatus;
}

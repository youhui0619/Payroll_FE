export type PublicHolidayScope = 'NATIONAL' | 'STATE';

export interface PublicHoliday {
  id: string;
  name: string;
  description: string;
  scope: PublicHolidayScope;
  regions: string[];
  startDate: Date | null;
  endDate: Date| null;
  active: boolean;
}

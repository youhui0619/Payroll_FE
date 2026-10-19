import type { PublicHolidayRecord } from '../models/public-holiday.model';

export const publicHolidays: PublicHolidayRecord[] = [
  { id: 'PH-2026-001', name: "Lunar New Year's Day", description: 'Chinese New Year public holiday.', startDate: '2026-02-17', endDate: '2026-02-18', scope: 'National', regions: [], status: 'ACTIVE' },
  { id: 'PH-2026-002', name: 'Hari Raya Puasa', description: 'Hari Raya Puasa celebration.', startDate: '2026-03-21', endDate: '2026-03-22', scope: 'National', regions: [], status: 'ACTIVE' },
  { id: 'PH-2026-003', name: 'Labour Day', description: 'Annual Labour Day public holiday.', startDate: '2026-05-01', endDate: '2026-05-01', scope: 'National', regions: [], status: 'ACTIVE' },
  { id: 'PH-2026-004', name: 'Hari Thaipusam', description: 'State public holiday observed in selected locations.', startDate: '2026-02-01', endDate: '2026-02-01', scope: 'State', regions: ['Johor', 'Kuala Lumpur', 'Negeri Sembilan', 'Penang', 'Perak', 'Putrajaya', 'Selangor'], status: 'ACTIVE' },
  { id: 'PH-2026-005', name: 'Hari Keputeraan Sultan Johor', description: 'Official birthday of the Sultan of Johor.', startDate: '2026-03-23', endDate: '2026-03-23', scope: 'State', regions: ['Johor'], status: 'ACTIVE' },
  { id: 'PH-2026-006', name: 'Gawai Dayak', description: 'Harvest festival public holiday in Sarawak.', startDate: '2026-06-01', endDate: '2026-06-02', scope: 'State', regions: ['Sarawak'], status: 'ACTIVE' },
  { id: 'PH-2026-007', name: "Yang di-Pertuan Agong's Birthday", description: 'Official birthday of the Yang di-Pertuan Agong.', startDate: '2026-06-01', endDate: '2026-06-01', scope: 'National', regions: [], status: 'ACTIVE' },
  { id: 'PH-2026-008', name: 'Merdeka Day', description: 'Malaysia National Day.', startDate: '2026-08-31', endDate: '2026-08-31', scope: 'National', regions: [], status: 'ACTIVE' },
  { id: 'PH-2026-009', name: 'Malaysia Day', description: 'Commemoration of the formation of Malaysia.', startDate: '2026-09-16', endDate: '2026-09-16', scope: 'National', regions: [], status: 'ACTIVE' },
  { id: 'PH-2026-010', name: 'Christmas Day', description: 'Christmas Day public holiday.', startDate: '2026-12-25', endDate: '2026-12-25', scope: 'National', regions: [], status: 'ACTIVE' }
];

export function getPublicHolidaysForDate(date: string, location: string): PublicHolidayRecord[] {
  return getPublicHolidaysForLocation(location).filter(holiday => holiday.startDate <= date && holiday.endDate >= date);
}

export function getPublicHolidaysForLocation(location: string): PublicHolidayRecord[] {
  const normalizedLocation = location.toLowerCase();
  return publicHolidays.filter(holiday => {
    if (holiday.status !== 'ACTIVE') return false;
    if (holiday.scope === 'National') return true;
    return holiday.regions.some(region => normalizedLocation.includes(region.toLowerCase()));
  });
}

import type { PublicHolidayRecord } from '../models/public-holiday.model';

export const publicHolidays: PublicHolidayRecord[] = [
  { id: 'PH-2026-001', name: "Lunar New Year's Day", date: '2026-02-17', day: 'Tuesday', scope: 'National', regions: ['All States'], status: 'Active' },
  { id: 'PH-2026-002', name: 'Hari Raya Puasa', date: '2026-03-21', day: 'Saturday', scope: 'National', regions: ['All States'], status: 'Active' },
  { id: 'PH-2026-003', name: 'Labour Day', date: '2026-05-01', day: 'Friday', scope: 'National', regions: ['All States'], status: 'Active' },
  { id: 'PH-2026-004', name: 'Hari Thaipusam', date: '2026-02-01', day: 'Sunday', scope: 'State', regions: ['Johor', 'Kuala Lumpur', 'Negeri Sembilan', 'Penang', 'Perak', 'Putrajaya', 'Selangor'], status: 'Active' },
  { id: 'PH-2026-005', name: 'Hari Keputeraan Sultan Johor', date: '2026-03-23', day: 'Monday', scope: 'State', regions: ['Johor'], status: 'Active' },
  { id: 'PH-2026-006', name: 'Gawai Dayak', date: '2026-06-01', day: 'Monday', scope: 'State', regions: ['Sarawak'], status: 'Active' },
  { id: 'PH-2026-007', name: "Yang di-Pertuan Agong's Birthday", date: '2026-06-01', day: 'Monday', scope: 'National', regions: ['All States'], status: 'Active' },
  { id: 'PH-2026-008', name: 'Merdeka Day', date: '2026-08-31', day: 'Monday', scope: 'National', regions: ['All States'], status: 'Active' },
  { id: 'PH-2026-009', name: 'Malaysia Day', date: '2026-09-16', day: 'Wednesday', scope: 'National', regions: ['All States'], status: 'Active' },
  { id: 'PH-2026-010', name: 'Christmas Day', date: '2026-12-25', day: 'Friday', scope: 'National', regions: ['All States'], status: 'Active' }
];

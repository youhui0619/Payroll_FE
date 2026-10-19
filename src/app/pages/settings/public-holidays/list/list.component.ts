import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MaterialImports, MaterialProviders } from '../../../../shared/material-imports';
import { publicHolidays } from '../../../../data/public-holidays';
import type { PublicHolidayRecord } from '../../../../models/public-holiday.model';

@Component({
  selector: 'app-list',
  imports: [CommonModule, ...MaterialImports, RouterLink],
  providers: [...MaterialProviders],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  readonly holidays: PublicHolidayRecord[] = publicHolidays;
  searchTerm = '';
  selectedYear = '';
  selectedScope = '';
  selectedStatus = '';

  get years(): string[] {
    return [...new Set(this.holidays.flatMap(holiday => {
      const startYear = Number(holiday.startDate.slice(0, 4));
      const endYear = Number(holiday.endDate.slice(0, 4));
      return Array.from({ length: endYear - startYear + 1 }, (_, index) => String(startYear + index));
    }))].sort();
  }

  get filteredHolidays(): PublicHolidayRecord[] {
    const query = this.searchTerm.trim().toLowerCase();
    return this.holidays.filter(holiday => {
      const matchesSearch = !query || [holiday.name, holiday.id, holiday.description, holiday.startDate, holiday.endDate, holiday.scope, ...holiday.regions]
        .some(value => value.toLowerCase().includes(query));
      const matchesYear = !this.selectedYear || holiday.startDate.slice(0, 4) <= this.selectedYear && holiday.endDate.slice(0, 4) >= this.selectedYear;
      const matchesScope = !this.selectedScope || holiday.scope === this.selectedScope;
      const matchesStatus = !this.selectedStatus || holiday.status === this.selectedStatus;
      return matchesSearch && matchesYear && matchesScope && matchesStatus;
    });
  }

  get activeHolidayCount(): number {
    return this.holidays.filter(holiday => holiday.status === 'ACTIVE').length;
  }

  get inactiveHolidayCount(): number {
    return this.holidays.filter(holiday => holiday.status === 'INACTIVE').length;
  }

  get upcomingHolidayCount(): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.holidays.filter(holiday => holiday.status === 'ACTIVE' && new Date(`${holiday.endDate}T00:00:00`) >= today).length;
  }

  getHolidayDateLabel(holiday: PublicHolidayRecord): string {
    return holiday.startDate === holiday.endDate
      ? holiday.startDate
      : `${holiday.startDate} – ${holiday.endDate}`;
  }

  getHolidayDayLabel(holiday: PublicHolidayRecord): string {
    const startDay = new Date(`${holiday.startDate}T00:00:00`).toLocaleDateString('en-MY', { weekday: 'long' });
    if (holiday.startDate === holiday.endDate) return startDay;
    const endDay = new Date(`${holiday.endDate}T00:00:00`).toLocaleDateString('en-MY', { weekday: 'long' });
    return `${startDay} – ${endDay}`;
  }

  getHolidayRegionTitle(holiday: PublicHolidayRecord): string {
    return holiday.scope === 'National' ? 'All States' : holiday.regions.join(', ');
  }

  getHolidayRegionLabel(holiday: PublicHolidayRecord): string {
    return holiday.scope === 'National'
      ? 'All states'
      : `${holiday.regions.length} states`;
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedYear = '';
    this.selectedScope = '';
    this.selectedStatus = '';
  }
}

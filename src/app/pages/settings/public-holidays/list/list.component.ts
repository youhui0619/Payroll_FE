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
    return [...new Set(this.holidays.map(holiday => holiday.date.slice(0, 4)))].sort();
  }

  get filteredHolidays(): PublicHolidayRecord[] {
    const query = this.searchTerm.trim().toLowerCase();
    return this.holidays.filter(holiday => {
      const matchesSearch = !query || [holiday.name, holiday.id, holiday.date, holiday.day, holiday.scope, ...holiday.regions]
        .some(value => value.toLowerCase().includes(query));
      const matchesYear = !this.selectedYear || holiday.date.startsWith(this.selectedYear);
      const matchesScope = !this.selectedScope || holiday.scope === this.selectedScope;
      const matchesStatus = !this.selectedStatus || holiday.status === this.selectedStatus;
      return matchesSearch && matchesYear && matchesScope && matchesStatus;
    });
  }

  get activeHolidayCount(): number {
    return this.holidays.filter(holiday => holiday.status === 'Active').length;
  }

  get inactiveHolidayCount(): number {
    return this.holidays.filter(holiday => holiday.status === 'Inactive').length;
  }

  get upcomingHolidayCount(): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.holidays.filter(holiday => holiday.status === 'Active' && new Date(`${holiday.date}T00:00:00`) >= today).length;
  }

  getHolidayRegionTitle(holiday: PublicHolidayRecord): string {
    return holiday.regions.join(', ');
  }

  getHolidayRegionLabel(holiday: PublicHolidayRecord): string {
    return holiday.regions.includes('All States')
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

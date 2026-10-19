import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MaterialImports, MaterialProviders } from '../../../../shared/material-imports';
import { publicHolidays } from '../../../../data/public-holidays';
import type { PublicHolidayRecord } from '../../../../models/public-holiday.model';

@Component({
  selector: 'app-view',
  standalone: true,
  imports: [...MaterialImports, CommonModule, RouterLink],
  providers: [...MaterialProviders],
  templateUrl: './view.component.html',
  styleUrl: './view.component.scss'
})
export class ViewComponent {
  readonly holiday: PublicHolidayRecord | undefined;

  constructor(route: ActivatedRoute) {
    const holidayId = route.snapshot.paramMap.get('id');
    this.holiday = publicHolidays.find(item => item.id === holidayId);
  }

  get holidayRegions(): string {
    if (!this.holiday) return '';
    return this.holiday.scope === 'National'
      ? 'All states'
      : this.holiday.regions.join(', ');
  }
}

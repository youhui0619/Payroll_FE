import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MaterialImports, MaterialProviders } from '../../../../shared/material-imports';
import { publicHolidays } from '../../../../data/public-holidays';
import type { PublicHolidayRecord } from '../../../../models/public-holiday.model';
import { NavigationService } from '../../../../services/navigation.service';

@Component({
  selector: 'app-view',
  standalone: true,
  imports: [...MaterialImports, CommonModule, RouterLink],
  providers: [...MaterialProviders],
  templateUrl: './view.component.html',
  styleUrl: './view.component.scss'
})
export class ViewComponent {
  private readonly navigation = inject(NavigationService);
  holiday: PublicHolidayRecord | undefined;

  goBack(): void { void this.navigation.back('/settings/public-holidays/list'); }

  constructor(route: ActivatedRoute) {
    route.paramMap.pipe(takeUntilDestroyed()).subscribe(params => {
      const holidayId = params.get('id');
      this.holiday = publicHolidays.find(item => item.id === holidayId);
    });
  }

  get holidayRegions(): string {
    if (!this.holiday) return '';
    return this.holiday.scope === 'National'
      ? 'All states'
      : this.holiday.regions.join(', ');
  }
}

import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormRecord, ReactiveFormsModule } from '@angular/forms';
import { REGIONAL_PREFERENCE_GROUPS, REGIONAL_PREFERENCE_VALUES } from '../../../../data/regional-preferences.data';
import { MaterialImports, MaterialProviders } from '../../../../shared/material-imports';
import { RegionalPreferencesService } from '../../../../services/regional-preferences.service';
import { RegionalCurrencyPipe } from '../../../../shared/pipes/regional-format.pipes';

@Component({
  selector: 'app-regional-preferences',
  standalone: true,
  imports: [...MaterialImports, CommonModule, ReactiveFormsModule, RegionalCurrencyPipe],
  providers: [...MaterialProviders],
  templateUrl: './regional-preferences.component.html',
  styleUrl: './regional-preferences.component.scss'
})
export class RegionalPreferencesComponent implements OnInit {
  private readonly regionalPreferences = inject(RegionalPreferencesService);
  readonly preferenceGroups = REGIONAL_PREFERENCE_GROUPS;
  readonly preferencesForm = new FormRecord<FormControl<string>>({});
  readonly datePreviewSample = new Date();

  ngOnInit(): void {
    for (const group of this.preferenceGroups) {
      for (const preference of group.preferences) {
        this.preferencesForm.addControl(
          preference.id,
          new FormControl(this.regionalPreferences.getValue(preference.id) || REGIONAL_PREFERENCE_VALUES[preference.id] || '', { nonNullable: true })
        );
      }
    }
  }

  onSubmit(): void {
    this.regionalPreferences.save(this.preferencesForm.getRawValue());
  }

}

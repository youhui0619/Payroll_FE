import { getCurrencySymbol } from '@angular/common';
import { Injectable } from '@angular/core';
import { REGIONAL_PREFERENCE_VALUES } from '../data/regional-preferences.data';

export type RegionalPreferenceValues = Record<string, string>;

@Injectable({ providedIn: 'root' })
export class RegionalPreferencesService {
  private readonly storageKey = 'regional-preferences';
  private values: RegionalPreferenceValues = this.load();

  get currency(): string { return this.values['currency']; }
  get currencySymbol(): string { return getCurrencySymbol(this.currency, 'narrow', 'en-US'); }
  get numberFormat(): string { return this.values['numberFormat']; }
  get dateFormat(): string { return this.values['dateFormat']; }
  get timeFormat(): string { return this.values['timeFormat']; }
  get timeZone(): string { return this.values['timeZone']; }

  getValue(id: string): string { return this.values[id] ?? ''; }

  save(values: RegionalPreferenceValues): void {
    this.values = { ...REGIONAL_PREFERENCE_VALUES, ...values };
    localStorage.setItem(this.storageKey, JSON.stringify(this.values));
  }

  private load(): RegionalPreferenceValues {
    try {
      const saved = JSON.parse(localStorage.getItem(this.storageKey) ?? '{}') as RegionalPreferenceValues;
      return { ...REGIONAL_PREFERENCE_VALUES, ...saved };
    } catch {
      return { ...REGIONAL_PREFERENCE_VALUES };
    }
  }
}

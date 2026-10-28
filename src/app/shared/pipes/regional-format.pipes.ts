import { DatePipe, DecimalPipe, getCurrencySymbol, registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { Pipe, PipeTransform, inject } from '@angular/core';
import { RegionalPreferencesService } from '../../services/regional-preferences.service';

registerLocaleData(localeDe);

function localeFor(numberFormat: string): string {
  return numberFormat === '1.234,56' ? 'de-DE' : 'en-US';
}

function offsetFor(timeZone: string): string {
  return timeZone.replace('UTC', '').replace('−', '-').replace('±', '+');
}

@Pipe({ name: 'regionalNumber', standalone: true, pure: false })
export class RegionalNumberPipe implements PipeTransform {
  private readonly preferences = inject(RegionalPreferencesService);
  private readonly pipe = new DecimalPipe('en-US');

  transform(value: number | string | null | undefined, digitsInfo = '1.0-3'): string | null {
    return this.pipe.transform(value, digitsInfo, localeFor(this.preferences.numberFormat));
  }
}

@Pipe({ name: 'regionalCurrency', standalone: true, pure: false })
export class RegionalCurrencyPipe implements PipeTransform {
  private readonly preferences = inject(RegionalPreferencesService);
  private readonly numberPipe = new DecimalPipe('en-US');

  transform(value: number | string | null | undefined, digitsInfo = '1.2-2', currency = this.preferences.currency): string | null {
    const amount = this.numberPipe.transform(value, digitsInfo, localeFor(this.preferences.numberFormat));
    if (amount === null) return null;

    const symbol = getCurrencySymbol(currency, 'narrow', localeFor(this.preferences.numberFormat));
    return `${symbol}\u00a0${amount}`;
  }
}

@Pipe({ name: 'regionalCurrencySymbol', standalone: true, pure: false })
export class RegionalCurrencySymbolPipe implements PipeTransform {
  private readonly preferences = inject(RegionalPreferencesService);

  transform(_value?: unknown): string {
    return getCurrencySymbol(this.preferences.currency, 'narrow', localeFor(this.preferences.numberFormat));
  }
}

@Pipe({ name: 'regionalDate', standalone: true, pure: false })
export class RegionalDatePipe implements PipeTransform {
  private readonly preferences = inject(RegionalPreferencesService);
  private readonly pipe = new DatePipe('en-US');

  transform(value: Date | string | number | null | undefined, format?: string): string | null {
    const pattern = format ?? `${this.preferences.dateFormat} ${this.preferences.timeFormat === '12h' ? 'h:mm a' : 'HH:mm'}`;
    return this.pipe.transform(value, pattern, offsetFor(this.preferences.timeZone), localeFor(this.preferences.numberFormat));
  }
}

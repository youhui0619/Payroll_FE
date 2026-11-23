import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { REGIONAL_LANGUAGE_OPTIONS, REGIONAL_TIME_ZONE_OPTIONS, REGIONAL_TIME_FORMAT_OPTIONS, REGIONAL_CURRENCY_OPTIONS, REGIONAL_NUMBER_FORMAT_OPTIONS } from '../../../../data/settings/regional-preferences.data';
import { MaterialImports, MaterialProviders } from '../../../../shared/material-imports';
import { RegionalCurrencyPipe } from '../../../../shared/pipes/regional-format.pipes';
import { RegionalSettingApiService } from '../../../../services/api/regional-setting.service';
import { ToastService } from '../../../../shared/components/toast/toast.service';

@Component({
  selector: 'app-regional-preferences',
  standalone: true,
  imports: [...MaterialImports, CommonModule, ReactiveFormsModule, RegionalCurrencyPipe],
  providers: [...MaterialProviders, RegionalSettingApiService],
  templateUrl: './regional-preferences.component.html',
  styleUrl: './regional-preferences.component.scss'
})
export class RegionalPreferencesComponent {
  constructor(
    private toastService: ToastService,
    private apiService: RegionalSettingApiService,
  ) {}

  @Input() showSubmitButton = true;
  regionalPreferences: any | null = null;
  form = new FormGroup({
    language: new FormControl("", { nonNullable: true }),
    timeZone: new FormControl("", { nonNullable: true }),
    dateFormat: new FormControl("", { nonNullable: true }),
    timeFormat: new FormControl("", { nonNullable: true }),
    currency: new FormControl("", { nonNullable: true }),
    numberFormat: new FormControl("", { nonNullable: true }),
  });
  submitting: boolean = false;
  datePreviewSample = new Date();

  languageOptions = REGIONAL_LANGUAGE_OPTIONS;
  timeZoneOptions = REGIONAL_TIME_ZONE_OPTIONS;
  timeFormatOptions = REGIONAL_TIME_FORMAT_OPTIONS;
  currencyOptions = REGIONAL_CURRENCY_OPTIONS;
  numberFormatOptions = REGIONAL_NUMBER_FORMAT_OPTIONS;

  ngOnInit() {
    this.getRegionalSetting()
  }

  getRegionalSetting(){
    this.apiService.getRegionalSetting().subscribe({
      next: (response) => {
        this.regionalPreferences = response.data;
        console.log("regionalPreferences:", this.regionalPreferences);
        if(this.regionalPreferences){
          this.form.patchValue(this.regionalPreferences)
        }
      },
      error: (error) => {
        this.toastService.show({
          title: error.error.code,
          message: error.error.message,
          icon: 'danger'
        });
      },
    });
  }

  get previewTimeZone(): string {
    return this.form.controls.timeZone.value.replace('UTC', '').replace('−', '-').replace('±', '+');
  }

  get previewTimeFormat(): string {
    return this.form.controls.timeFormat.value === '12h' ? 'h:mm a' : 'HH:mm';
  }

  onSubmit(form: FormGroup) {
    const data = form.value;
    this.apiService.updateRegionalSetting(data).subscribe({
      next: (response) => {
        this.form.markAsPristine();
        this.toastService.show({
          title: "Success",
          message: "Regional preference has been updated.",
          icon: 'success'
        });

        this.submitting = false;
      },
      error: (error) => {
        console.log("Error:", error);
        const errorResponse = error?.error;

        if (errorResponse?.errors?.length) {
          errorResponse.errors.forEach((err: any) => {
            this.toastService.show({
              title: errorResponse.code,
              message: err.message,
              icon: 'danger'
            });
          });
        } else {
          this.toastService.show({
            title: errorResponse?.code || 'Error',
            message: errorResponse?.message || 'Something went wrong.',
            icon: 'danger'
          });
        }
        this.submitting = false;
      }
    });
  }

}

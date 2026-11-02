import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialImports, MaterialProviders } from '../../../../shared/material-imports';
import { COMPANY_PROFILE } from '../../../../data/company/company.data';
import type { CompanyFinancialYearStartMonth } from '../../../../models/company/company.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [...MaterialImports, ReactiveFormsModule],
  providers: [...MaterialProviders],
  templateUrl: './profile.component.html'
})
export class ProfileComponent {
  readonly companyProfile = COMPANY_PROFILE;
  readonly financialMonths: { value: CompanyFinancialYearStartMonth; label: string }[] = [
    { value: 'JANUARY', label: 'January' },
    { value: 'FEBRUARY', label: 'February' },
    { value: 'MARCH', label: 'March' },
    { value: 'APRIL', label: 'April' },
    { value: 'MAY', label: 'May' },
    { value: 'JUNE', label: 'June' },
    { value: 'JULY', label: 'July' },
    { value: 'AUGUST', label: 'August' },
    { value: 'SEPTEMBER', label: 'September' },
    { value: 'OCTOBER', label: 'October' },
    { value: 'NOVEMBER', label: 'November' },
    { value: 'DECEMBER', label: 'December' }
  ];

  readonly companyForm = new FormGroup({
    name: new FormControl(this.companyProfile.name, { nonNullable: true, validators: [Validators.required] }),
    registrationNo: new FormControl(this.companyProfile.registrationNo, { nonNullable: true, validators: [Validators.required] }),
    contactNo: new FormControl(this.companyProfile.contactNo, { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl(this.companyProfile.email, { nonNullable: true, validators: [Validators.required, Validators.email] }),
    sstNo: new FormControl(this.companyProfile.sstNo ?? '', { nonNullable: true }),
    taxNo: new FormControl(this.companyProfile.taxNo ?? '', { nonNullable: true }),
    website: new FormControl(this.companyProfile.website ?? '', { nonNullable: true }),
    logo: new FormControl(this.companyProfile.logo ?? '', { nonNullable: true }),
    financialStartingMonth: new FormControl<CompanyFinancialYearStartMonth>(this.companyProfile.financialStartingMonth, { nonNullable: true, validators: [Validators.required] }),
    businessAddressLine1: new FormControl(this.companyProfile.businessAddressLine1, { nonNullable: true, validators: [Validators.required] }),
    businessAddressLine2: new FormControl(this.companyProfile.businessAddressLine2, { nonNullable: true }),
    businessCity: new FormControl(this.companyProfile.businessCity, { nonNullable: true, validators: [Validators.required] }),
    businessPostcode: new FormControl(this.companyProfile.businessPostcode, { nonNullable: true, validators: [Validators.required] }),
    businessState: new FormControl(this.companyProfile.businessState, { nonNullable: true, validators: [Validators.required] }),
    businessCountry: new FormControl(this.companyProfile.businessCountry, { nonNullable: true, validators: [Validators.required] })
  });

  onSubmit(): void {
    if (this.companyForm.invalid) {
      this.companyForm.markAllAsTouched();
      return;
    }

    console.log('company profile', this.companyForm.getRawValue());
  }
}

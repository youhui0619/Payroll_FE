import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialImports, MaterialProviders } from '../../../../shared/material-imports';
import { COMPANY_PROFILE } from '../../../../data/company/company.data';
import type { CompanyFinancialYearStartMonth } from '../../../../models/company/company.model';
// import { AuthService } from '../../../../services/auth.service';
import { ToastService } from '../../../../shared/components/toast/toast.service';
import { CompanyApiService } from '../../../../services/api/company.service';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [...MaterialImports, ReactiveFormsModule],
  providers: [...MaterialProviders, CompanyApiService],
  templateUrl: './profile.component.html'
})
export class ProfileComponent {
  constructor(
    private toastService: ToastService,
    private apiService: CompanyApiService,
    // private authService: AuthService,
  ) { }

  @Input() showHeader = true;
  @Input() showSubmitButton = true;
  companyProfile = {};
  readonly financialMonths: {
    value: CompanyFinancialYearStartMonth;
    label: string;
  }[] = [
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

  form: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    registrationNo: new FormControl('', [Validators.required]),
    contactNo: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    sstNo: new FormControl(''),
    taxNo: new FormControl( ''),
    website: new FormControl(''),
    logo: new FormControl(''),
    financialStartingMonth: new FormControl<CompanyFinancialYearStartMonth>('JANUARY', [Validators.required]),
    businessAddressLine1: new FormControl('', [Validators.required]),
    businessAddressLine2: new FormControl(''),
    businessCity: new FormControl('', [Validators.required]),
    businessPostcode: new FormControl('', [Validators.required]),
    businessState: new FormControl('', [Validators.required]),
    businessCountry: new FormControl('', [Validators.required])
  });
  submitting: boolean = false;

  ngOnInit() {
    this.getCompany()
  }

  getCompany(){
    this.apiService.getCompany().subscribe({
      next: (response) => {
        this.companyProfile = response.data;
        console.log("companyProfile:", this.companyProfile);

        if(this.companyProfile){
          this.form.patchValue(this.companyProfile)
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
  onSubmit(form: FormGroup) {
    if (form.invalid) {
      form.markAllAsTouched();
      return;
    }
    this.submitting = true

    const data = form.value;
    console.log("Data", data)
    this.apiService.updateCompany(data).subscribe({
      next: (response) => {
        console.log("response", response)
        this.toastService.show({
          title: "Success",
          message: "Your company profile has been updated.",
          icon: 'success'
        });
        this.form.markAsPristine();
        this.form.markAsUntouched();
      },
      error: (error) => {
        this.toastService.show({
          title: error.error.code,
          message: error.error.message,
          icon: 'danger'
        });
      },
    });
    this.submitting = false;
  }
}

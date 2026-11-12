import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialImports, MaterialProviders } from '../../../../shared/material-imports';
import { COMPANY_PROFILE } from '../../../../data/company/company.data';
import type { CompanyFinancialYearStartMonth } from '../../../../models/company/company.model';
// import { ApiService } from '../../../../services/api.service';
// import { AuthService } from '../../../../services/auth.service';
import { ToastService } from '../../../../shared/components/toast/toast.service';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [...MaterialImports, ReactiveFormsModule],
  providers: [...MaterialProviders],
  templateUrl: './profile.component.html'
})
export class ProfileComponent {
  constructor(
    private toastService: ToastService,
    // private apiService: ApiService,
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
    this.getCompanyProfile()
  }

  getCompanyProfile(){
    this.companyProfile = COMPANY_PROFILE
    console.log("companyProfile", this.companyProfile)

    if(this.companyProfile){
      this.form.patchValue(this.companyProfile)
    }

  }
  onSubmit(form: FormGroup) {
    if (form.invalid) {
      form.markAllAsTouched();
      return;
    }

    const data = form.value;
    this.submitting = true;
    this.toastService.show({
      title: "Success",
      message: "Success Message",
      icon: 'success'
    })
    this.submitting = false;

    

    // this.apiService.login(data).subscribe({
    //   next: (response: any) => {
    //    this.toastService.show({
    //       title: error.error.code,
    //       message: error.error.message,
    //       icon: 'danger'
    //     });
    //     this.form.markAsPristine();
  //       this.form.markAsUntouched();
    //     this.authService.login(response)

    //   },
    //   error: (error) => {
    //     console.log("error", error)
    //     this.toastService.show({
    //       title: error.error.code,
    //       message: error.error.message,
    //       icon: 'danger'
    //     });
    //     this.submitting = false;
    //   }
    // })
    }
}


import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialImports, MaterialProviders } from '../../../shared/material-imports';
import { payslipSettings } from '../../../data/payroll/payslip-settings.data';
import type { PayslipSettings } from '../../../models/payroll/payslip-settings.model';
import { PayslipSettingApiService } from '../../../services/api/payslip-setting.service';
import { ToastService } from '../../../shared/components/toast/toast.service';

@Component({
  selector: 'app-payslip',
  standalone: true,
  imports: [...MaterialImports, ReactiveFormsModule],
  providers: [...MaterialProviders, PayslipSettingApiService],
  templateUrl: './payslip.component.html',
  styleUrl: './payslip.component.scss'
})
export class PayslipComponent implements OnInit {
  constructor(
    private toastService: ToastService,
    private apiService: PayslipSettingApiService,
  ) {}

  form = new FormGroup({
    pageSize: new FormControl<'A4' | 'LETTER'>('A4', { nonNullable: true, validators: [Validators.required] }),
    pageOrientation: new FormControl<'PORTRAIT' | 'LANDSCAPE'>('PORTRAIT', { nonNullable: true, validators: [Validators.required] }),
    payslipNumberFormat: new FormControl('PAY-{YYYY}-{MM}-{EMPLOYEE_ID}', { nonNullable: true, validators: [Validators.required] }),
    pdfFilenameFormat: new FormControl('{EMPLOYEE_ID}-{YYYY}-{MM}-payslip', { nonNullable: true, validators: [Validators.required] }),
    passwordProtectedPdf: new FormControl(false, { nonNullable: true }),
    companyLogo: new FormControl(true, { nonNullable: true }),
    employeeDetails: new FormControl(true, { nonNullable: true }),
    departmentAndPosition: new FormControl(true, { nonNullable: true }),
    employmentType: new FormControl(false, { nonNullable: true }),
    payPeriodAndPaymentDate: new FormControl(true, { nonNullable: true }),
    salaryAndEarnings: new FormControl(true, { nonNullable: true }),
    itemizedDeductions: new FormControl(true, { nonNullable: true }),
    employerContributions: new FormControl(true, { nonNullable: true }),
    yearToDateTotals: new FormControl(true, { nonNullable: true }),
    leaveBalance: new FormControl(true, { nonNullable: true }),
    employeeExpensesList: new FormControl(true, { nonNullable: true }),
    dailyAttendanceRecord: new FormControl(true, { nonNullable: true }),
    leaveList: new FormControl(true, { nonNullable: true }),
    bankAccountDetails: new FormControl(false, { nonNullable: true }),
    maskBankAccountNumber: new FormControl(true, { nonNullable: true }),
    displayFooterMessage: new FormControl(false, { nonNullable: true }),
    footerText: new FormControl('', { nonNullable: true }),
    publishingMethod: new FormControl<'MANUAL' | 'AUTOMATIC'>('MANUAL', { nonNullable: true, validators: [Validators.required] }),
    employeeVisibility: new FormControl<'EMPLOYEES_AND_ADMINS' | 'ADMINS_ONLY'>('EMPLOYEES_AND_ADMINS', { nonNullable: true, validators: [Validators.required] }),
    notifyEmployees: new FormControl(true, { nonNullable: true })
  });

  @ViewChild('payslipNumberFormatInput') payslipNumberFormatInput?: ElementRef<HTMLInputElement>;
  @ViewChild('pdfFilenameFormatInput') pdfFilenameFormatInput?: ElementRef<HTMLInputElement>;
  readonly payslipFormatTokens = [
    { name: 'Year (YYYY)', value: '{YYYY}' },
    { name: 'Month (MM)', value: '{MM}' },
    { name: 'Employee ID', value: '{EMPLOYEE_ID}' }
  ];

  payslipSetting: PayslipSettings | null = null;
  submitting: boolean = false;

  ngOnInit() {
    this.getPayslipSetting()
  }

  getPayslipSetting(){
    this.apiService.getPayslipSetting().subscribe({
      next: (response) => {
        this.payslipSetting = response.data;
        console.log("payslipSetting:", this.payslipSetting);
        if(this.payslipSetting){
          this.form.patchValue(this.payslipSetting)
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
    const data = form.value;
    this.apiService.updatePayslipSetting(data).subscribe({
      next: (response) => {
        this.form.markAsPristine();
        this.toastService.show({
          title: "Success",
          message: "Payslip setting has been updated.",
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


  insertPayslipFormatToken(token: string): void {
    this.insertFormatToken(token, this.payslipNumberFormatInput?.nativeElement, this.form.controls.payslipNumberFormat);
  }

  insertPdfFilenameToken(token: string): void {
    this.insertFormatToken(token, this.pdfFilenameFormatInput?.nativeElement, this.form.controls.pdfFilenameFormat);
  }

  private insertFormatToken(token: string, input: HTMLInputElement | undefined, control: FormControl<string>): void {
    const currentValue = control.value;
    const start = input?.selectionStart ?? currentValue.length;
    const end = input?.selectionEnd ?? start;
    const nextValue = `${currentValue.slice(0, start)}${token}${currentValue.slice(end)}`;

    control.setValue(nextValue);
    control.markAsDirty();
    input?.focus();
    input?.setSelectionRange(start + token.length, start + token.length);
  }

}

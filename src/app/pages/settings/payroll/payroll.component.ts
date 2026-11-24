
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialImports, MaterialProviders } from '../../../shared/material-imports';
import type { PayrollSetting } from '../../../models/payroll/payroll-settings.model';
import { PayrollSettingApiService } from '../../../services/api/payroll-setting.service';
import { ToastService } from '../../../shared/components/toast/toast.service';

@Component({
  selector: 'app-payroll',
  standalone: true,
  imports: [...MaterialImports, ReactiveFormsModule],
  providers: [...MaterialProviders, PayrollSettingApiService],
  templateUrl: './payroll.component.html',
  styleUrl: './payroll.component.scss'
})
export class PayrollComponent implements OnInit {

  constructor(
    private toastService: ToastService,
    private apiService: PayrollSettingApiService,
  ) {}

  @Input() showSubmitButton = true;
  daysOfMonth = Array.from({ length: 31 }, (_, index) => index + 1);

  form = new FormGroup({
    payrollFrequency: new FormControl<PayrollSetting['payrollFrequency'] | null>(null, { nonNullable: true, validators: [Validators.required] }),
    payrollCutoffDay: new FormControl<PayrollSetting['payrollCutoffDay'] | null>(null, { nonNullable: true, validators: [Validators.required] }),
    scheduledPayDate: new FormControl<PayrollSetting['scheduledPayDate'] | null>(null, { nonNullable: true, validators: [Validators.required] }),
    currency: new FormControl<PayrollSetting['currency'] | null>(null, { nonNullable: true, validators: [Validators.required] }),
    salaryProrationMethod: new FormControl<PayrollSetting['salaryProrationMethod'] | null>(null, { nonNullable: true, validators: [Validators.required] }),
    calculationPrecision: new FormControl<PayrollSetting['calculationPrecision'] | null>(null, { nonNullable: true, validators: [Validators.required] }),
    includeBasicSalary: new FormControl(true, { nonNullable: true }),
    includeOvertime: new FormControl(true, { nonNullable: true }),
    includeClaimsAndAllowance: new FormControl(true, { nonNullable: true }),
    includeBonus: new FormControl(true, { nonNullable: true }),
    includeCommissionAndIncentives: new FormControl(true, { nonNullable: true }),
    standardWorkingHoursPerDay: new FormControl<number | null>(null),
    normalWorkingDayMultiplier: new FormControl<number | null>(null),
    normalWorkingDayEarningCode: new FormControl('', { nonNullable: true }),
    configureRestDayRates: new FormControl(false, { nonNullable: true }),
    restDayOvertimeMultiplier: new FormControl<number | null>(null),
    restDayEarningCode: new FormControl('', { nonNullable: true }),
    configurePublicHolidayRates: new FormControl(false, { nonNullable: true }),
    publicHolidayOvertimeMultiplier: new FormControl<number | null>(null),
    publicHolidayEarningCode: new FormControl('', { nonNullable: true }),
    deductionProrationMethod: new FormControl<PayrollSetting['deductionProrationMethod']| null>(null, { nonNullable: true, validators: [Validators.required] }),
    includeEpf: new FormControl(true, { nonNullable: true }),
    includeSocso: new FormControl(true, { nonNullable: true }),
    includeEis: new FormControl(true, { nonNullable: true }),
    includePcb: new FormControl(true, { nonNullable: true }),
    includeHrdCorpLevy: new FormControl(false, { nonNullable: true }),
    paymentMethod: new FormControl<PayrollSetting['paymentMethod']| null>(null, { nonNullable: true, validators: [Validators.required] }),
    automaticallyCalculatePayroll: new FormControl(true, { nonNullable: true }),
    blockApprovalOnValidationErrors: new FormControl(true, { nonNullable: true }),
    lockAfterFinalApproval: new FormControl(true, { nonNullable: true }),
    notifyApprovers: new FormControl(true, { nonNullable: true }),
    approvalWorkflow: new FormControl<PayrollSetting['approvalWorkflow']| null>(null, { nonNullable: true, validators: [Validators.required] })
  });

  payrollSetting: PayrollSetting | null = null;
  submitting: boolean = false;
  
  ngOnInit() {
    this.getPayrollSetting()
  }

  getPayrollSetting(){
    this.apiService.getPayrollSetting().subscribe({
      next: (response) => {
        this.payrollSetting = response.data;
        console.log("payrollSetting:", this.payrollSetting);
        if(this.payrollSetting){
          this.form.patchValue(this.payrollSetting)
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
    this.apiService.updatePayrollSetting(data).subscribe({
      next: (response) => {
        this.form.markAsPristine();
        this.toastService.show({
          title: "Success",
          message: "Payroll setting has been updated.",
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

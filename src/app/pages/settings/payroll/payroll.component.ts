
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialImports, MaterialProviders } from '../../../shared/material-imports';
import {
  approvalWorkflowOptions as approvalWorkflowOptionList,
  calculationPrecisionOptions as calculationPrecisionOptionList,
  deductionProrationMethodOptions as deductionProrationMethodOptionList,
  minimumOvertimeDurationOptions as minimumOvertimeDurationOptionList,
  paymentMethodOptions as paymentMethodOptionList,
  payrollCutoffDayOptions as payrollCutoffDayOptionList,
  payrollCurrencyOptions as payrollCurrencyOptionList,
  payrollFrequencyOptions as payrollFrequencyOptionList,
  salaryProrationMethodOptions as salaryProrationMethodOptionList,
  scheduledPayDateOptions as scheduledPayDateOptionList
} from '../../../models/payroll/payroll-settings.model';
import type { PayrollDay, PayrollSetting } from '../../../models/payroll/payroll-settings.model';
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
  payrollFrequencyOptions = payrollFrequencyOptionList;
  payrollCutoffDayOptions = payrollCutoffDayOptionList;
  scheduledPayDateOptions = scheduledPayDateOptionList;
  payrollCurrencyOptions = payrollCurrencyOptionList;
  salaryProrationMethodOptions = salaryProrationMethodOptionList;
  calculationPrecisionOptions = calculationPrecisionOptionList;
  deductionProrationMethodOptions = deductionProrationMethodOptionList;
  paymentMethodOptions = paymentMethodOptionList;
  approvalWorkflowOptions = approvalWorkflowOptionList;
  minimumOvertimeDurationOptions = minimumOvertimeDurationOptionList;

  form = new FormGroup({
    payrollFrequency: new FormControl<PayrollSetting['payrollFrequency'] | null>(null, { nonNullable: true, validators: [Validators.required] }),
    payrollCutoffDay: new FormControl<PayrollSetting['payrollCutoffDay'] | null>(null, { nonNullable: true, validators: [Validators.required] }),
    scheduledPayDate: new FormControl<PayrollSetting['scheduledPayDate'] | null>(null, { nonNullable: true, validators: [Validators.required] }),
    currency: new FormControl<PayrollSetting['currency'] | null>(null, { nonNullable: true, validators: [Validators.required] }),
    salaryProrationMethod: new FormControl<PayrollSetting['salaryProrationMethod'] | null>(null, { nonNullable: true, validators: [Validators.required] }),
    calculationPrecision: new FormControl<PayrollSetting['calculationPrecision'] | null>(null, { nonNullable: true, validators: [Validators.required] }),
    includeBasicSalary: new FormControl(false, { nonNullable: true }),
    includeOvertime: new FormControl(false, { nonNullable: true }),
    includeClaimsAndAllowance: new FormControl(false, { nonNullable: true }),
    includeBonus: new FormControl(false, { nonNullable: true }),
    includeCommissionAndIncentives: new FormControl(false, { nonNullable: true }),
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
    includeEpf: new FormControl(false, { nonNullable: true }),
    includeSocso: new FormControl(false, { nonNullable: true }),
    includeEis: new FormControl(false, { nonNullable: true }),
    includePcb: new FormControl(false, { nonNullable: true }),
    includeHrdCorpLevy: new FormControl(false, { nonNullable: true }),
    paymentMethod: new FormControl<PayrollSetting['paymentMethod']| null>(null, { nonNullable: true, validators: [Validators.required] }),
    automaticallyCalculatePayroll: new FormControl(false, { nonNullable: true }),
    blockApprovalOnValidationErrors: new FormControl(false, { nonNullable: true }),
    lockAfterFinalApproval: new FormControl(false, { nonNullable: true }),
    notifyApprovers: new FormControl(false, { nonNullable: true }),
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
          this.form.patchValue({
            ...this.payrollSetting,
            payrollCutoffDay: this.normalizePayrollDay(this.payrollSetting.payrollCutoffDay),
            scheduledPayDate: this.normalizePayrollDay(this.payrollSetting.scheduledPayDate)
          });
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

  private normalizePayrollDay(value: PayrollDay | string): PayrollDay {
    if (value === 'LAST_DAY' || typeof value === 'number') return value;

    const day = Number(value);
    return Number.isInteger(day) && day >= 1 && day <= 31 ? day : value as PayrollDay;
  }

  onSubmit(form: FormGroup) {
    if (form.invalid) {
      form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const data = {
      ...form.value,
    makerChecker: true,
  };
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

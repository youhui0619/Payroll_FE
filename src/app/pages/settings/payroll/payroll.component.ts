import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialImports, MaterialProviders } from '../../../shared/material-imports';
import { payrollSettings } from '../../../data/payroll-settings';
import type { PayrollSettings } from '../../../models/payroll-settings.model';

@Component({
  selector: 'app-payroll',
  standalone: true,
  imports: [...MaterialImports, CommonModule, ReactiveFormsModule],
  providers: [...MaterialProviders],
  templateUrl: './payroll.component.html',
  styleUrl: './payroll.component.scss'
})
export class PayrollComponent implements OnInit {
  readonly daysOfMonth = Array.from({ length: 31 }, (_, index) => index + 1);

  readonly payrollForm = new FormGroup({
    payrollFrequency: new FormControl<PayrollSettings['payrollFrequency']>('MONTHLY', { nonNullable: true, validators: [Validators.required] }),
    payrollCutoffDay: new FormControl<PayrollSettings['payrollCutoffDay']>('LAST_DAY', { nonNullable: true, validators: [Validators.required] }),
    scheduledPayDate: new FormControl<PayrollSettings['scheduledPayDate']>(1, { nonNullable: true, validators: [Validators.required] }),
    currency: new FormControl<PayrollSettings['currency']>('MYR', { nonNullable: true, validators: [Validators.required] }),
    salaryProrationMethod: new FormControl<PayrollSettings['salaryProrationMethod']>('CALENDAR_DAYS', { nonNullable: true, validators: [Validators.required] }),
    calculationPrecision: new FormControl<PayrollSettings['calculationPrecision']>(2, { nonNullable: true, validators: [Validators.required] }),
    includeBasicSalary: new FormControl(true, { nonNullable: true }),
    includeOvertime: new FormControl(true, { nonNullable: true }),
    includeAllowances: new FormControl(true, { nonNullable: true }),
    includeBonus: new FormControl(true, { nonNullable: true }),
    includeCommissionAndIncentives: new FormControl(true, { nonNullable: true }),
    overtimeCalculationBasis: new FormControl<PayrollSettings['overtimeCalculationBasis']>('HOURLY_RATE', { nonNullable: true, validators: [Validators.required] }),
    standardWorkingHoursPerDay: new FormControl<number | null>(null),
    normalWorkingDayMultiplier: new FormControl<number | null>(null),
    normalWorkingDayEarningCode: new FormControl('', { nonNullable: true }),
    configureRestDayRates: new FormControl(false, { nonNullable: true }),
    restDayWorkingHoursPerDay: new FormControl<number | null>(null),
    restDayEarningCode: new FormControl('', { nonNullable: true }),
    configurePublicHolidayRates: new FormControl(false, { nonNullable: true }),
    publicHolidayWorkingHoursPerDay: new FormControl<number | null>(null),
    publicHolidayEarningCode: new FormControl('', { nonNullable: true }),
    deductionProrationMethod: new FormControl<PayrollSettings['deductionProrationMethod']>('FOLLOW_SALARY_PRORATION', { nonNullable: true, validators: [Validators.required] }),
    enableEpf: new FormControl(true, { nonNullable: true }),
    enableSocso: new FormControl(true, { nonNullable: true }),
    enableEis: new FormControl(true, { nonNullable: true }),
    enablePcb: new FormControl(true, { nonNullable: true }),
    enableHrdCorpLevy: new FormControl(false, { nonNullable: true }),
    paymentMethod: new FormControl<PayrollSettings['paymentMethod']>('BANK_TRANSFER', { nonNullable: true, validators: [Validators.required] }),
    automaticallyCalculatePayroll: new FormControl(true, { nonNullable: true }),
    blockApprovalOnValidationErrors: new FormControl(true, { nonNullable: true }),
    lockAfterFinalApproval: new FormControl(true, { nonNullable: true }),
    notifyApprovers: new FormControl(true, { nonNullable: true }),
    approvalWorkflow: new FormControl<PayrollSettings['approvalWorkflow']>('ONE_APPROVER', { nonNullable: true, validators: [Validators.required] })
  });

  submittedPayrollSettings: PayrollSettings | null = null;
  submitted = false;

  ngOnInit(): void {
    this.patchPayrollForm();
  }

  private patchPayrollForm(settings: PayrollSettings = payrollSettings): void {
    const formValues = Object.fromEntries(
      Object.entries(settings).filter(([key]) => this.payrollForm.contains(key))
    );

    this.payrollForm.patchValue(formValues);
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.payrollForm.invalid) {
      this.payrollForm.markAllAsTouched();
      return;
    }

    this.submittedPayrollSettings = this.payrollForm.getRawValue();
  }
}

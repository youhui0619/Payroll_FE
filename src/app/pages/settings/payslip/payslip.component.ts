import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialImports, MaterialProviders } from '../../../shared/material-imports';
import { payslipSettings } from '../../../data/payslip-settings';
import type { PayslipSettings } from '../../../models/payslip-settings.model';

@Component({
  selector: 'app-payslip',
  standalone: true,
  imports: [...MaterialImports, CommonModule, ReactiveFormsModule],
  providers: [...MaterialProviders],
  templateUrl: './payslip.component.html',
  styleUrl: './payslip.component.scss'
})
export class PayslipComponent implements OnInit {
  readonly payslipForm = new FormGroup({
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
    bankAccountDetails: new FormControl(false, { nonNullable: true }),
    maskBankAccountNumber: new FormControl(true, { nonNullable: true }),
    displayFooterMessage: new FormControl(false, { nonNullable: true }),
    footerText: new FormControl('', { nonNullable: true }),
    publishingMethod: new FormControl<'MANUAL' | 'AUTOMATIC'>('MANUAL', { nonNullable: true, validators: [Validators.required] }),
    employeeVisibility: new FormControl<'EMPLOYEES_AND_ADMINS' | 'ADMINS_ONLY'>('EMPLOYEES_AND_ADMINS', { nonNullable: true, validators: [Validators.required] }),
    notifyEmployees: new FormControl(true, { nonNullable: true })
  });

  submittedPayslipSettings: PayslipSettings | null = null;
  submitted = false;

  ngOnInit(): void {
    this.patchPayslipForm();
  }

  private patchPayslipForm(settings: PayslipSettings = payslipSettings): void {
    const formValues = Object.fromEntries(
      Object.entries(settings).filter(([key]) => this.payslipForm.contains(key))
    );

    this.payslipForm.patchValue(formValues);
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.payslipForm.invalid) {
      this.payslipForm.markAllAsTouched();
      return;
    }
    this.submittedPayslipSettings = this.payslipForm.getRawValue();
  }
}

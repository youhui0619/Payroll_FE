import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialImports, MaterialProviders } from '../../../../shared/material-imports';
import { RouterLink } from '@angular/router';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { DropzoneComponent } from '../../../../shared/dropzone/dropzone.component';
import { defaultLeaveEntitlements } from '../../../../data/leave-balances';
import type { LeaveEntitlementPeriod } from '../../../../models/leave.model';


@Component({
  selector: 'app-create',
  imports: [...MaterialImports, CommonModule, FormsModule, ReactiveFormsModule,  ToastrModule, DropzoneComponent, RouterLink],
  providers: [...MaterialProviders, ToastrService],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent {

  employeeForm = new FormGroup({
    personal: new FormGroup({
      employeeId: new FormControl(''),
      employeeName: new FormControl(''),
      nricPassportNo: new FormControl(''),
      dateOfBirth: new FormControl<Date | null>(null),
      gender: new FormControl(''),
      nationality: new FormControl(''),
      race: new FormControl(''),
      religion: new FormControl(''),
      maritalStatus: new FormControl(''),
      email: new FormControl(''),
      contactNo: new FormControl(''),
      addressLine1: new FormControl(''),
      addressLine2: new FormControl(''),
      city: new FormControl(''),
      postcode: new FormControl(''),
      state: new FormControl(''),
      country: new FormControl(''),
    }),
    employment: new FormGroup({
      employmentStatus: new FormControl(''),
      employmentType: new FormControl(''),
      department: new FormControl(''),
      position: new FormControl(''),
      reportingManager: new FormControl(''),
      workLocation: new FormControl(''),
      joinedDate: new FormControl<Date | null>(null),
      confirmationDate: new FormControl<Date | null>(null),
      resignationDate: new FormControl<Date | null>(null),
    }),
    payroll: new FormGroup({
      basicSalary: new FormControl<number | null>(null),
      salaryType: new FormControl(''),
      paymentMethod: new FormControl(''),
      bank: new FormControl(''),
      bankAccount: new FormControl(''),
      epfEmployeeNo: new FormControl(''),
      epfEmployerNo: new FormControl(''),
      socsoNo: new FormControl(''),
      eisStatus: new FormControl(''),
    }),
    taxInformation: new FormGroup({
      agreeWithTerms: new FormControl(false),
    }),
    leave: new FormGroup({
      annualLeaveEntitlement: new FormControl<number | null>(defaultLeaveEntitlements.annual.amount),
      annualLeavePeriod: new FormControl<LeaveEntitlementPeriod>(defaultLeaveEntitlements.annual.period, { nonNullable: true }),
      medicalLeaveEntitlement: new FormControl<number | null>(defaultLeaveEntitlements.medical.amount),
      medicalLeavePeriod: new FormControl<LeaveEntitlementPeriod>(defaultLeaveEntitlements.medical.period, { nonNullable: true }),
    }),
    emergencyContact: new FormGroup({
      contactName: new FormControl(''),
      relationship: new FormControl(''),
      contactNo: new FormControl(''),
      addressLine1: new FormControl(''),
      addressLine2: new FormControl(''),
      city: new FormControl(''),
      postcode: new FormControl(''),
      state: new FormControl(''),
      country: new FormControl(''),
    }),
  });

  readonly leaveYear = new Date().getFullYear();

  get annualLeaveYearlyEntitlement(): number {
    return this.toYearlyEntitlement(
      this.employeeForm.controls.leave.controls.annualLeaveEntitlement.value,
      this.employeeForm.controls.leave.controls.annualLeavePeriod.value
    );
  }

  get medicalLeaveYearlyEntitlement(): number {
    return this.toYearlyEntitlement(
      this.employeeForm.controls.leave.controls.medicalLeaveEntitlement.value,
      this.employeeForm.controls.leave.controls.medicalLeavePeriod.value
    );
  }

  private toYearlyEntitlement(amount: number | null, period: LeaveEntitlementPeriod): number {
    if (amount === null || !Number.isFinite(amount)) return 0;
    return Math.max(0, amount) * (period === 'month' ? 12 : 1);
  }

  onSubmit(): void {
    console.log('form.value', this.employeeForm.value);
  }
}

import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialImports, MaterialProviders } from '../../../../shared/material-imports';
import { RouterLink } from '@angular/router';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { DropzoneComponent } from '../../../../shared/dropzone/dropzone.component';
import { defaultLeaveEntitlements } from '../../../../data/leave-balances';
import { leavePolicies } from '../../../../data/leave-policies';
import type { LeaveEntitlementPeriod } from '../../../../models/leave.model';
import type { LeavePolicy } from '../../../../models/leave-policy.model';


@Component({
  selector: 'app-create',
  imports: [...MaterialImports, CommonModule, FormsModule, ReactiveFormsModule,  ToastrModule, DropzoneComponent, RouterLink],
  providers: [...MaterialProviders, ToastrService],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent {

  readonly leavePolicies: LeavePolicy[] = leavePolicies.filter(policy => policy.status === 'ACTIVE');

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
      leavePolicyCodes: new FormControl<string[]>([], { nonNullable: true }),
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

  get selectedLeavePolicies(): LeavePolicy[] {
    const selectedCodes = new Set(this.employeeForm.controls.leave.controls.leavePolicyCodes.value);
    return this.leavePolicies.filter(policy => selectedCodes.has(policy.leaveCode));
  }

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

  isLeavePolicySelected(leaveCode: string): boolean {
    return this.employeeForm.controls.leave.controls.leavePolicyCodes.value.includes(leaveCode);
  }

  setLeavePolicySelected(leaveCode: string, selected: boolean): void {
    const codes = this.employeeForm.controls.leave.controls.leavePolicyCodes;
    const selectedCodes = new Set(codes.value);

    if (selected) selectedCodes.add(leaveCode);
    else selectedCodes.delete(leaveCode);

    codes.setValue([...selectedCodes]);
  }

  onSubmit(): void {
    console.log('form.value', this.employeeForm.value);
  }

  entitlementLabel(policy: LeavePolicy): string {
    if (policy.entitlementCalculationMethod === 'SERVICE') {
      const tiers = policy.serviceEntitlementTiers
        .filter(tier => tier.serviceFrom !== null && tier.daysPerYear !== null)
        .map(tier => {
          const yearRange = tier.serviceTo === null
            ? `${tier.serviceFrom}+ years`
            : `${tier.serviceFrom}–${tier.serviceTo} years`;
          return `${yearRange}: ${tier.daysPerYear} ${this.entitlementUnitLabel(policy)} per year`;
        });
      return tiers.length > 0 ? tiers.join(' · ') : 'Based on length of service';
    }

    if (policy.entitlementGrantMethod === 'MANUAL') return 'Set manually';
    return `${policy.defaultEntitlement ?? 0} ${this.entitlementUnitLabel(policy)} per year`;
  }

  leaveBalanceLabel(policy: LeavePolicy): string {
    const isServiceBased = policy.entitlementCalculationMethod === 'SERVICE';
    const entitlement = isServiceBased ? this.serviceBasedEntitlement(policy) : policy.defaultEntitlement;

    if (isServiceBased && entitlement === null) return 'Enter joined date';
    if (entitlement === null || (policy.entitlementGrantMethod === 'MANUAL' && policy.defaultEntitlement === null)) {
      return '—';
    }

    return `${entitlement} ${this.entitlementUnitLabel(policy)}`;
  }

  private serviceBasedEntitlement(policy: LeavePolicy): number | null {
    const joinedDate = this.employeeForm.controls.employment.controls.joinedDate.value;
    if (!joinedDate || Number.isNaN(joinedDate.getTime())) return null;

    const today = new Date();
    let yearsOfService = today.getFullYear() - joinedDate.getFullYear();
    const beforeAnniversary = today.getMonth() < joinedDate.getMonth()
      || (today.getMonth() === joinedDate.getMonth() && today.getDate() < joinedDate.getDate());
    if (beforeAnniversary) yearsOfService--;
    yearsOfService = Math.max(0, yearsOfService);

    const tier = policy.serviceEntitlementTiers.find(item =>
      item.serviceFrom !== null
      && yearsOfService >= item.serviceFrom
      && (item.serviceTo === null || yearsOfService < item.serviceTo)
    );
    return tier?.daysPerYear ?? null;
  }

  private entitlementUnitLabel(policy: LeavePolicy): string {
    return policy.entitlementUnit === 'DAILY' ? 'days' : 'hours';
  }
}

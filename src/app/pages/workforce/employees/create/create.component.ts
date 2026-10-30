import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialImports, MaterialProviders } from '../../../../shared/material-imports';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { DropzoneComponent } from '../../../../shared/dropzone/dropzone.component';
import { defaultLeaveEntitlements } from '../../../../data/leave-balances';
import { leavePolicies } from '../../../../data/leave-policies';
import type { LeaveEntitlementPeriod } from '../../../../models/leave.model';
import type { LeavePolicy } from '../../../../models/leave-policy.model';
import { departments } from '../../../../data/departments';
import { positions } from '../../../../data/positions';
import type { Department } from '../../../../models/department.model';
import type { Position } from '../../../../models/position.model';
import { commissionIncentiveSettings } from '../../../../data/commission-incentive-settings';
import { payrollSettings } from '../../../../data/payroll-settings';
import type {
  CommissionCalculationFrequency,
  CommissionCalculationMethod,
  CommissionIncentiveSetting
} from '../../../../models/commission-incentive-setting.model';

const statutoryEntitlementOptions = [
  { code: 'EPF', name: 'EPF / KWSP', setting: 'includeEpf' },
  { code: 'SOCSO', name: 'SOCSO / PERKESO', setting: 'includeSocso' },
  { code: 'LHDN', name: 'LHDN (PCB / MTD)', setting: 'includePcb' },
  { code: 'EIS', name: 'EIS / SIP', setting: 'includeEis' },
  { code: 'HRD_CORP_LEVY', name: 'HRD Corp Levy', setting: 'includeHrdCorpLevy' },
] as const;


@Component({
  selector: 'app-create',
  imports: [...MaterialImports, CommonModule, FormsModule, ReactiveFormsModule,  ToastrModule, DropzoneComponent],
  providers: [...MaterialProviders, ToastrService],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent {

  readonly departments: Department[] = departments.filter(department => department.status === 'Active');
  readonly positions: Position[] = positions;
  readonly leavePolicies: LeavePolicy[] = leavePolicies.filter(policy => policy.status === 'ACTIVE');
  readonly commissionIncentiveSettings: CommissionIncentiveSetting[] = commissionIncentiveSettings;
  readonly availableStatutoryEntitlements = statutoryEntitlementOptions.filter(option => payrollSettings[option.setting]);

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
      epfRate: new FormControl(''),
      socsoNo: new FormControl(''),
      contributionCategory: new FormControl(''),
      eisStatus: new FormControl(''),
      hrdRegisterNo: new FormControl(''),
      statutoryEntitlementCodes: new FormControl<string[]>(this.availableStatutoryEntitlements.map(option => option.code), { nonNullable: true }),
      commissionSettingCodes: new FormControl<string[]>([], { nonNullable: true }),
    }),
    taxInformation: new FormGroup({
      agreeWithTerms: new FormControl(false),
    }),
    leave: new FormGroup({
      leavePolicyCodes: new FormControl<string[]>(['AL', 'ML'], { nonNullable: true }),
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

  get availablePositions(): Position[] {
    const departmentName = this.employeeForm.controls.employment.controls.department.value;
    const department = this.departments.find(item => item.name === departmentName);
    if (!department) return [];

    return this.positions.filter(position =>
      position.departmentId === department.id && this.isEffective(position.effectiveFrom, position.effectiveTo)
    );
  }

  get hasAvailablePositions(): boolean {
    return this.availablePositions.length > 0;
  }

  get availableCommissionSettings(): CommissionIncentiveSetting[] {
    const employeeId = (this.employeeForm.controls.personal.controls.employeeId.value ?? '').trim();
    const department = this.departments.find(item => item.name === this.employeeForm.controls.employment.controls.department.value);
    const position = this.positions.find(item => item.title === this.employeeForm.controls.employment.controls.position.value);

    return this.commissionIncentiveSettings.filter(setting => {
      switch (setting.eligibleEmployees) {
        case 'ALL_EMPLOYEES':
          return true;
        case 'SELECTED_DEPARTMENTS':
          return !!department && setting.eligibleDepartmentIds.includes(department.id);
        case 'SELECTED_POSITIONS':
          return !!position && setting.eligiblePositionIds.includes(position.id);
        case 'SELECTED_EMPLOYEES':
          return !!employeeId && setting.eligibleEmployeeIds.includes(employeeId);
      }
    });
  }

  isCommissionSelected(code: string): boolean {
    return this.employeeForm.controls.payroll.controls.commissionSettingCodes.value.includes(code);
  }

  setCommissionSelected(code: string, selected: boolean): void {
    const codes = this.employeeForm.controls.payroll.controls.commissionSettingCodes;
    const selectedCodes = new Set(codes.value);

    if (selected) selectedCodes.add(code);
    else selectedCodes.delete(code);

    codes.setValue([...selectedCodes]);
  }

  isStatutoryEntitlementSelected(code: string): boolean {
    return this.employeeForm.controls.payroll.controls.statutoryEntitlementCodes.value.includes(code);
  }

  setStatutoryEntitlementSelected(code: string, selected: boolean): void {
    const codes = this.employeeForm.controls.payroll.controls.statutoryEntitlementCodes;
    const selectedCodes = new Set(codes.value);

    if (selected) selectedCodes.add(code);
    else selectedCodes.delete(code);

    codes.setValue([...selectedCodes]);
  }

  commissionCalculationLabel(setting: CommissionIncentiveSetting): string {
    if (setting.calculationMethod === 'PERCENTAGE_OF_REVENUE') return `${setting.rate ?? 0}% of revenue`;
    if (setting.calculationMethod === 'PERCENTAGE_OF_PROFIT') return `${setting.rate ?? 0}% of profit`;
    if (['PERCENTAGE_OF_SALES', 'TIERED_RATE'].includes(setting.calculationMethod)) return `${setting.rate ?? 0}% of sales`;
    return `MYR ${setting.amount ?? 0}`;
  }

  commissionCalculationMethodLabel(method: CommissionCalculationMethod): string {
    const labels: Record<CommissionCalculationMethod, string> = {
      PERCENTAGE_OF_SALES: 'Percentage of Sales',
      PERCENTAGE_OF_REVENUE: 'Percentage of Revenue',
      PERCENTAGE_OF_PROFIT: 'Percentage of Profit',
      FIXED_PER_TRANSACTION: 'Fixed Amount per Transaction',
      TIERED_RATE: 'Tiered Rate',
      TARGET_BASED: 'Target-Based Calculation',
      FIXED_AMOUNT: 'Fixed Amount'
    };
    return labels[method];
  }

  commissionCalculationFrequencyLabel(frequency: CommissionCalculationFrequency): string {
    const labels: Record<CommissionCalculationFrequency, string> = {
      PER_TRANSACTION: 'Per transaction',
      WEEKLY: 'Weekly',
      BIWEEKLY: 'Every two weeks',
      MONTHLY: 'Monthly',
      QUARTERLY: 'Quarterly'
    };
    return labels[frequency];
  }

  onDepartmentChange(): void {
    this.employeeForm.controls.employment.controls.position.setValue('');
  }

  private isEffective(effectiveFrom: string | null, effectiveTo: string | null): boolean {
    const today = new Date().toISOString().slice(0, 10);
    return (!effectiveFrom || effectiveFrom <= today) && (!effectiveTo || effectiveTo >= today);
  }

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
    const availableStatutoryCodes = new Set<string>(this.availableStatutoryEntitlements.map(option => option.code));
    const selectedStatutoryCodes = this.employeeForm.controls.payroll.controls.statutoryEntitlementCodes;
    selectedStatutoryCodes.setValue(selectedStatutoryCodes.value.filter(code => availableStatutoryCodes.has(code)));
    const availableCodes = new Set(this.availableCommissionSettings.map(setting => setting.code));
    const selectedCodes = this.employeeForm.controls.payroll.controls.commissionSettingCodes;
    selectedCodes.setValue(selectedCodes.value.filter(code => availableCodes.has(code)));
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

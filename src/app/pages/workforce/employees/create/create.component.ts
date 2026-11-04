import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormRecord, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialImports, MaterialProviders } from '../../../../shared/material-imports';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { DropzoneComponent } from '../../../../shared/dropzone/dropzone.component';
import { defaultLeaveEntitlements } from '../../../../data/leave/leave-balances.data';
import { leavePolicies } from '../../../../data/leave/leave-policies.data';
import type { LeaveEntitlementPeriod } from '../../../../models/leave/leave.model';
import type { LeavePolicy, LeaveServiceEntitlementTier } from '../../../../models/leave/leave-policy.model';
import { departments } from '../../../../data/workforce/departments.data';
import { positions } from '../../../../data/workforce/positions.data';
import { workLocations } from '../../../../data/workforce/work-locations.data';
import type { Department } from '../../../../models/workforce/department.model';
import type { Position } from '../../../../models/workforce/position.model';
import type { WorkLocation } from '../../../../models/workforce/work-location.model';
import type { OvertimeCalculationBasis } from '../../../../models/workforce/employee.model';
import type { EmploymentStatus, EmploymentType } from '../../../../models/workforce/employment-status.model';
import { employmentStatuses, employmentTypes } from '../../../../data/workforce/options/employment-options.data';
import { commissionIncentiveSettings } from '../../../../data/commission/commission-incentive-settings.data';
import { payrollSettings } from '../../../../data/payroll/payroll-settings.data';
import { WORKING_SCHEDULE } from '../../../../data/working-schedule/working-schedule.data';
import { NavigationService } from '../../../../services/navigation.service';
import type { WorkingDayName, WorkingDaySchedule, WorkingSchedule } from '../../../../models/working-schedule/working-schedule.model';
import type {
  CommissionCalculationFrequency,
  CommissionCalculationMethod,
  CommissionIncentiveSetting
} from '../../../../models/commission/commission-incentive-setting.model';

const statutoryEntitlementOptions = [
  { code: 'EPF', name: 'EPF / KWSP', setting: 'includeEpf' },
  { code: 'SOCSO', name: 'SOCSO / PERKESO', setting: 'includeSocso' },
  { code: 'LHDN', name: 'LHDN (PCB / MTD)', setting: 'includePcb' },
  { code: 'EIS', name: 'EIS / SIP', setting: 'includeEis' },
  { code: 'HRD_CORP_LEVY', name: 'HRD Corp Levy', setting: 'includeHrdCorpLevy' },
] as const;

type LeaveServiceTierForm = FormGroup<{
  serviceFrom: FormControl<number | null>;
  serviceTo: FormControl<number | null>;
  daysPerYear: FormControl<number | null>;
}>;

function createLeaveServiceTierForm(tier: LeaveServiceEntitlementTier): LeaveServiceTierForm {
  return new FormGroup({
    serviceFrom: new FormControl<number | null>(tier.serviceFrom, [Validators.required, Validators.min(0)]),
    serviceTo: new FormControl<number | null>(tier.serviceTo, [Validators.min(0)]),
    daysPerYear: new FormControl<number | null>(tier.daysPerYear, [Validators.required, Validators.min(0)])
  });
}

type EmployeeWorkingDayForm = FormGroup<{
  day: FormControl<WorkingDayName>;
  isWorkingDay: FormControl<boolean>;
  startTime: FormControl<string>;
  endTime: FormControl<string>;
  breakStartTime: FormControl<string>;
  breakEndTime: FormControl<string>;
}>;

type EmployeeWorkingScheduleForm = FormGroup<{
  days: FormArray<EmployeeWorkingDayForm>;
}>;

function createWorkingDayForm(day: WorkingDaySchedule): EmployeeWorkingDayForm {
  return new FormGroup({
    day: new FormControl(day.day, { nonNullable: true }),
    isWorkingDay: new FormControl(day.isWorkingDay, { nonNullable: true }),
    startTime: new FormControl(day.startTime, { nonNullable: true }),
    endTime: new FormControl(day.endTime, { nonNullable: true }),
    breakStartTime: new FormControl(day.breakStartTime, { nonNullable: true }),
    breakEndTime: new FormControl(day.breakEndTime, { nonNullable: true })
  });
}

function createWorkingScheduleForm(schedule: WorkingSchedule): EmployeeWorkingScheduleForm {
  return new FormGroup({
    days: new FormArray(schedule.days.map(createWorkingDayForm))
  });
}


@Component({
  selector: 'app-create',
  imports: [...MaterialImports, CommonModule, FormsModule, ReactiveFormsModule,  ToastrModule, DropzoneComponent],
  providers: [...MaterialProviders, ToastrService],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent {

  private navigation = inject(NavigationService);
  private readonly editingLeavePolicyCodes = new Set<string>();

  constructor() {
    for (const policy of this.leavePolicies) {
      if (policy.entitlementCalculationMethod === 'SERVICE') {
        const tiers = new FormArray<LeaveServiceTierForm>((policy.serviceEntitlementTiers ?? []).map(createLeaveServiceTierForm));
        this.employeeForm.controls.leave.controls.leaveServiceEntitlementTiers.addControl(policy.leaveCode, tiers);
        this.updateLeaveServiceToValidators(policy.leaveCode);
      } else {
        this.employeeForm.controls.leave.controls.leaveEntitlementOverrides.addControl(
          policy.leaveCode,
          new FormControl<number | null>(policy.defaultEntitlement, [Validators.min(0)])
        );
      }
    }
  }

  readonly departments: Department[] = departments.filter(department => department.status === 'Active');
  readonly positions: Position[] = positions;
  readonly workLocations = workLocations;
  readonly workLocationSearch = new FormControl<WorkLocation | string>('', { nonNullable: true });
  readonly employmentStatuses = employmentStatuses;
  readonly employmentTypes = employmentTypes;
  readonly leavePolicies: LeavePolicy[] = leavePolicies.filter(policy => policy.status === 'ACTIVE');
  readonly commissionIncentiveSettings: CommissionIncentiveSetting[] = commissionIncentiveSettings;
  readonly availableStatutoryEntitlements = statutoryEntitlementOptions.filter(option => payrollSettings[option.setting]);
  readonly overtimeEnabledInPayrollSettings = payrollSettings.includeOvertime;
  readonly overtimeBasisOptions: { value: OvertimeCalculationBasis; label: string }[] = [
    { value: 'HOURLY_RATE', label: 'Hourly rate' },
    { value: 'DAILY_RATE_CONVERTED', label: 'Daily rate converted to hourly' },
    { value: 'MONTHLY_SALARY_CONVERTED', label: 'Monthly salary converted to hourly' }
  ];

  get selectedWorkLocation(): WorkLocation | undefined {
    const locationId = this.employeeForm.controls.employment.controls.workLocationId.value;
    return this.workLocations.find(location => location.id === locationId);
  }

  get filteredWorkLocations(): WorkLocation[] {
    const searchValue = this.workLocationSearch.value;
    const query = typeof searchValue === 'string' ? searchValue.trim().toLowerCase() : '';
    return this.workLocations.filter(location => !query || [
      location.name,
      location.code,
      location.city,
      location.state
    ].some(value => value.toLowerCase().includes(query)));
  }

  readonly workLocationDisplayName = (value: WorkLocation | string | null): string => {
    return value && typeof value === 'object' ? value.name : value ?? '';
  };

  onWorkLocationSelected(location: WorkLocation): void {
    this.employeeForm.controls.employment.controls.workLocationId.setValue(location.id);
    this.workLocationSearch.setValue(location);
  }

  onWorkLocationSearchInput(): void {
    if (typeof this.workLocationSearch.value === 'string') {
      this.employeeForm.controls.employment.controls.workLocationId.setValue('');
    }
  }

  goBack() {
    return this.navigation.back('/workforce/employees/list');
  }

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
      employmentStatus: new FormControl<EmploymentStatus | null>(null),
      employmentType: new FormControl<EmploymentType | null>(null),
      workingSchedule: createWorkingScheduleForm(WORKING_SCHEDULE.Permanent),
      department: new FormControl(''),
      position: new FormControl(''),
      reportingManager: new FormControl(''),
      workLocationId: new FormControl(''),
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
      includeOvertime: new FormControl(false, { nonNullable: true }),
      overtimeCalculationBasis: new FormControl<OvertimeCalculationBasis>('HOURLY_RATE', { nonNullable: true }),
      overtimeHourlyRate: new FormControl<number | null>(null),
    }),
    taxInformation: new FormGroup({
      agreeWithTerms: new FormControl(false),
    }),
    leave: new FormGroup({
      leavePolicyCodes: new FormControl<string[]>(['AL', 'ML'], { nonNullable: true }),
      leaveEntitlementOverrides: new FormRecord<FormControl<number | null>>({}),
      leaveServiceEntitlementTiers: new FormRecord<FormArray<LeaveServiceTierForm>>({}),
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

  setOvertimeIncluded(selected: boolean): void {
    const payroll = this.employeeForm.controls.payroll.controls;
    payroll.includeOvertime.setValue(selected);
    if (selected && payroll.overtimeCalculationBasis.value === 'HOURLY_RATE') {
      payroll.overtimeHourlyRate.setValidators([Validators.required, Validators.min(0.01)]);
    } else {
      payroll.overtimeHourlyRate.clearValidators();
      if (!selected) payroll.overtimeHourlyRate.setValue(null);
    }
    payroll.overtimeHourlyRate.updateValueAndValidity();
  }

  setOvertimeCalculationBasis(basis: OvertimeCalculationBasis): void {
    const payroll = this.employeeForm.controls.payroll.controls;
    payroll.overtimeCalculationBasis.setValue(basis);
    if (payroll.includeOvertime.value && basis === 'HOURLY_RATE') {
      payroll.overtimeHourlyRate.setValidators([Validators.required, Validators.min(0.01)]);
    } else {
      payroll.overtimeHourlyRate.clearValidators();
      payroll.overtimeHourlyRate.setValue(null);
    }
    payroll.overtimeHourlyRate.updateValueAndValidity();
  }

  get overtimeCalculationBasisLabel(): string {
    const labels: Record<OvertimeCalculationBasis, string> = {
      HOURLY_RATE: 'Hourly rate',
      DAILY_RATE_CONVERTED: 'Daily rate converted to hourly',
      MONTHLY_SALARY_CONVERTED: 'Monthly salary converted to hourly'
    };
    return labels[this.employeeForm.controls.payroll.controls.overtimeCalculationBasis.value];
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

  onEmploymentTypeChange(type: EmploymentType | null): void {
    if (!type) return;

    const scheduleDays = this.employeeForm.controls.employment.controls.workingSchedule.controls.days;
    WORKING_SCHEDULE[type].days.forEach((day, index) => {
      scheduleDays.at(index)?.patchValue(day);
    });
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

  serviceEntitlementTiers(leaveCode: string): FormArray<LeaveServiceTierForm> {
    return this.employeeForm.controls.leave.controls.leaveServiceEntitlementTiers.controls[leaveCode];
  }

  addLeaveServiceTier(leaveCode: string): void {
    const tiers = this.serviceEntitlementTiers(leaveCode);
    const previousTier = tiers.at(tiers.length - 1);
    tiers.push(createLeaveServiceTierForm({
      serviceFrom: previousTier?.controls.serviceTo.value ?? 0,
      serviceTo: null,
      daysPerYear: null
    }));
    this.updateLeaveServiceToValidators(leaveCode);
  }

  removeLeaveServiceTier(leaveCode: string, index: number): void {
    const tiers = this.serviceEntitlementTiers(leaveCode);
    if (tiers.length <= 1) return;
    tiers.removeAt(index);
    this.updateLeaveServiceToValidators(leaveCode);
  }

  private updateLeaveServiceToValidators(leaveCode: string): void {
    const tiers = this.serviceEntitlementTiers(leaveCode);
    tiers.controls.forEach((tier, index) => {
      tier.controls.serviceTo.setValidators(
        index < tiers.length - 1
          ? [Validators.required, Validators.min(0)]
          : [Validators.min(0)]
      );
      tier.controls.serviceTo.updateValueAndValidity({ emitEvent: false });
    });
  }

  isLeavePolicySelected(leaveCode: string): boolean {
    return this.employeeForm.controls.leave.controls.leavePolicyCodes.value.includes(leaveCode);
  }

  setLeavePolicySelected(leaveCode: string, selected: boolean): void {
    const codes = this.employeeForm.controls.leave.controls.leavePolicyCodes;
    const selectedCodes = new Set(codes.value);

    if (selected) selectedCodes.add(leaveCode);
    else {
      selectedCodes.delete(leaveCode);
      this.editingLeavePolicyCodes.delete(leaveCode);
    }

    codes.setValue([...selectedCodes]);
  }

  isEditingLeavePolicy(leaveCode: string): boolean {
    return this.editingLeavePolicyCodes.has(leaveCode);
  }

  toggleLeavePolicyEditor(leaveCode: string): void {
    if (this.editingLeavePolicyCodes.has(leaveCode)) this.editingLeavePolicyCodes.delete(leaveCode);
    else this.editingLeavePolicyCodes.add(leaveCode);
  }

  employeeEntitlementLabel(policy: LeavePolicy): string {
    const entitlement = this.employeeLeaveEntitlement(policy);
    if (entitlement === null) return policy.entitlementCalculationMethod === 'SERVICE' ? 'Enter joined date or entitlement' : 'Set employee entitlement';
    return `${entitlement} ${this.entitlementUnitLabel(policy)} per year`;
  }

  employeeEntitlementRulesLabel(policy: LeavePolicy): string {
    if (policy.entitlementCalculationMethod === 'SERVICE') {
      const tiers = this.serviceEntitlementTiers(policy.leaveCode).getRawValue()
        .filter(tier => tier.serviceFrom !== null && tier.daysPerYear !== null)
        .map(tier => {
          const range = tier.serviceTo === null
            ? `${tier.serviceFrom}+ years`
            : `${tier.serviceFrom}–${tier.serviceTo} years`;
          return `${range}: ${tier.daysPerYear} ${this.entitlementUnitLabel(policy)} per year`;
        });
      return tiers.length > 0 ? tiers.join(' · ') : 'Based on length of service';
    }
    return this.employeeEntitlementLabel(policy);
  }

  private employeeLeaveEntitlement(policy: LeavePolicy): number | null {
    if (policy.entitlementCalculationMethod !== 'SERVICE') {
      return this.employeeForm.controls.leave.controls.leaveEntitlementOverrides.controls[policy.leaveCode]?.value ?? null;
    }
    const yearsOfService = this.yearsOfService();
    if (yearsOfService === null) return null;
    const tier = (this.serviceEntitlementTiers(policy.leaveCode)?.getRawValue() ?? []).find(item =>
      item.serviceFrom !== null
      && yearsOfService >= item.serviceFrom
      && (item.serviceTo === null || yearsOfService < item.serviceTo)
    );
    return tier?.daysPerYear ?? null;
  }

  private yearsOfService(): number | null {
    const joinedDate = this.employeeForm.controls.employment.controls.joinedDate.value;
    if (!joinedDate || Number.isNaN(joinedDate.getTime())) return null;
    const today = new Date();
    let years = today.getFullYear() - joinedDate.getFullYear();
    if (today.getMonth() < joinedDate.getMonth()
      || (today.getMonth() === joinedDate.getMonth() && today.getDate() < joinedDate.getDate())) years--;
    return Math.max(0, years);
  }

  onSubmit(): void {
    const availableStatutoryCodes = new Set<string>(this.availableStatutoryEntitlements.map(option => option.code));
    const selectedStatutoryCodes = this.employeeForm.controls.payroll.controls.statutoryEntitlementCodes;
    selectedStatutoryCodes.setValue(selectedStatutoryCodes.value.filter(code => availableStatutoryCodes.has(code)));
    const availableCodes = new Set(this.availableCommissionSettings.map(setting => setting.code));
    const selectedCodes = this.employeeForm.controls.payroll.controls.commissionSettingCodes;
    selectedCodes.setValue(selectedCodes.value.filter(code => availableCodes.has(code)));
    const overtimeControls = this.employeeForm.controls.payroll.controls;
    if (!payrollSettings.includeOvertime || !overtimeControls.includeOvertime.value) {
      overtimeControls.includeOvertime.setValue(false);
      overtimeControls.overtimeHourlyRate.setValue(null);
    }
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
    const entitlement = this.employeeLeaveEntitlement(policy);

    if (entitlement === null) return policy.entitlementCalculationMethod === 'SERVICE' ? 'Enter joined date' : '—';

    return `${entitlement} ${this.entitlementUnitLabel(policy)}`;
  }

  private entitlementUnitLabel(policy: LeavePolicy): string {
    return policy.entitlementUnit === 'DAILY' ? 'days' : 'hours';
  }
}

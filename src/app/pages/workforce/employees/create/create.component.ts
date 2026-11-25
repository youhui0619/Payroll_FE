import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, FormGroupDirective, FormRecord, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialImports, MaterialProviders } from '../../../../shared/material-imports';
import { DropzoneComponent } from '../../../../shared/dropzone/dropzone.component';
import { defaultLeaveEntitlements } from '../../../../data/leave/leave-balances.data';
import { leavePolicies } from '../../../../data/leave/leave-policies.data';
import type { LeaveEntitlementPeriod } from '../../../../models/leave/leave.model';
import type { LeavePolicy, LeaveServiceEntitlementTier } from '../../../../models/leave/leave-policy.model';
import { departments } from '../../../../data/workforce/departments.data';
import { employees } from '../../../../data/workforce/employees.data';
import { positions } from '../../../../data/workforce/positions.data';
import { workLocations } from '../../../../data/workforce/work-locations.data';
import type { Department } from '../../../../models/workforce/department.model';
import type { Position } from '../../../../models/workforce/position.model';
import type { WorkLocation } from '../../../../models/workforce/work-location.model';
import type { EmployeeCreatePayload, OvertimeCalculationBasis } from '../../../../models/workforce/employee.model';
import type { EmploymentStatus, EmploymentType } from '../../../../models/workforce/employment-status.model';
import { employmentStatuses, employmentTypes } from '../../../../data/workforce/options/employment-options.data';
import { commissionIncentiveSettings } from '../../../../data/commission/commission-incentive-settings.data';
import { WORKING_SCHEDULE } from '../../../../data/working-schedule/working-schedule.data';
import type { WorkingDayName, WorkingDaySchedule, WorkingSchedule } from '../../../../models/working-schedule/working-schedule.model';
import type {
  CommissionCalculationFrequency,
  CommissionCalculationMethod,
  CommissionIncentiveSetting
} from '../../../../models/commission/commission-incentive-setting.model';
import { EmployeesApiService } from '../../../../services/api/employees.service';
import { ToastService } from '../../../../shared/components/toast/toast.service';
import { Router } from '@angular/router';
import { stateList } from '../../../../data/other/other.data';
import { PositionsApiService } from '../../../../services/api/positions.service';
import { DepartmentsApiService } from '../../../../services/api/departments.service';
import { WorkLocationApiService } from '../../../../services/api/work-location.service';
import { LeavePolicyApiService } from '../../../../services/api/leave-policy.service';
import { PayrollSettingApiService } from '../../../../services/api/payroll-setting.service';
import type { PayrollSetting } from '../../../../models/payroll/payroll-settings.model';

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
  imports: [...MaterialImports, CommonModule, FormsModule, ReactiveFormsModule,  DropzoneComponent],
  providers: [...MaterialProviders, EmployeesApiService, PositionsApiService, DepartmentsApiService, WorkLocationApiService, LeavePolicyApiService, PayrollSettingApiService],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent {
  constructor(
    private router: Router,
    private apiService: EmployeesApiService,
    private positionApiService: PositionsApiService,
    private departmentApiService: DepartmentsApiService,
    private workLocationApiService: WorkLocationApiService,
    private leavePolicyApiService: LeavePolicyApiService,
    private payrollSettingApiService: PayrollSettingApiService,
    private toastService: ToastService
  ) {
    this.updatePositionValidator();
    this.updateStatutoryValidators();
    this.updateBankValidators(this.form.controls.payroll.controls.paymentMethod.value);

    for (const policy of this.leavePolicies) {
      if (policy.entitlementCalculationMethod === 'SERVICE') {
        const tiers = new FormArray<LeaveServiceTierForm>((policy.serviceEntitlementTiers ?? []).map(createLeaveServiceTierForm));
        this.form.controls.leave.controls.leaveServiceEntitlementTiers.addControl(policy.code, tiers);
        this.updateLeaveServiceToValidators(policy.code);
      } else {
        this.form.controls.leave.controls.leaveEntitlementOverrides.addControl(
          policy.code,
          new FormControl<number | null>(policy.defaultEntitlement, [Validators.min(0)])
        );
      }
    }
  }

  markStepTouched(control: AbstractControl) {
    control.markAllAsTouched();
    console.log('Step validation result:', {
      valid: control.valid,
      status: control.status,
      value: control.getRawValue(),
    });
  }

  get isBankTransfer(): boolean {
    return this.form.controls.payroll.controls.paymentMethod.value === 'Transfer by bank';
  }

  onPaymentMethodChange(method: string) {
    this.updateBankValidators(method);
  }

  private updateBankValidators(method: string) {
    const { bank, bankAccount } = this.form.controls.payroll.controls;
    if (method === 'Transfer by bank') {
      bank.setValidators(Validators.required);
      bankAccount.setValidators(Validators.required);
    } else {
      bank.clearValidators();
      bankAccount.clearValidators();
      bank.setValue('');
      bankAccount.setValue('');
    }
    bank.updateValueAndValidity({ emitEvent: false });
    bankAccount.updateValueAndValidity({ emitEvent: false });
  }

  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;

  private editingLeavePolicyCodes = new Set<string>();

  stateList: any =stateList
  departmentList: Department[] = [];
  positionList: Position[] = [];
  managers = employees.filter(employee => employee.employmentStatus === 'ACTIVE');
  workLocationList: WorkLocation[] = [];
  workLocationSearch = new FormControl<WorkLocation | string>('', { nonNullable: true });
  employmentStatuses = employmentStatuses;
  employmentTypes = employmentTypes;
  leavePolicies: LeavePolicy[] = leavePolicies.filter(policy => policy.active);
  commissionIncentiveSettings: CommissionIncentiveSetting[] = commissionIncentiveSettings;
  statutoryEntitlementList: typeof statutoryEntitlementOptions[number][] = [];
  includeBasicSalary = false;
  includeOvertime = false;
  includeClaimsAndAllowance = false;
  includeBonus = false;
  includeCommissionAndIncentives = false;
  overtimeBasisOptions: { value: OvertimeCalculationBasis; label: string }[] = [
    { value: 'HOURLY_RATE', label: 'Hourly rate' },
    { value: 'DAILY_RATE_CONVERTED', label: 'Daily rate converted to hourly' },
    { value: 'MONTHLY_SALARY_CONVERTED', label: 'Monthly salary converted to hourly' }
  ];

  leavePolicyList: LeavePolicy[] = [];

  form = new FormGroup({
    personal: new FormGroup({
      employeeNo: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      nricPassportNo: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      dateOfBirth: new FormControl<Date | null>(null, Validators.required),
      gender: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      nationality: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      race: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      religion: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      maritalStatus: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
      contactNo: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      addressLine1: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      addressLine2: new FormControl(''),
      city: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      postcode: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      state: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      country: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    }),
    employment: new FormGroup({
      employmentStatus: new FormControl<EmploymentStatus | null>(null, Validators.required),
      employmentType: new FormControl<EmploymentType | null>(null, Validators.required),
      workingSchedule: createWorkingScheduleForm(WORKING_SCHEDULE.PERMANENT),
      departmentId: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      positionId: new FormControl(''),
      managerId: new FormControl(''),
      locationId: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      joinedDate: new FormControl<Date | null>(null, Validators.required),
      confirmationDate: new FormControl<Date | null>(null),
      resignationDate: new FormControl<Date | null>(null),
    }),
    payroll: new FormGroup({
      basicSalary: new FormControl<number | null>(null),
      salaryType: new FormControl('', { nonNullable: true }),
      paymentMethod: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      bank: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      bankAccount: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      epfEmployeeNo: new FormControl(''),
      epfEmployerNo: new FormControl(''),
      epfRate: new FormControl(''),
      socsoNo: new FormControl(''),
      contributionCategory: new FormControl(''),
      eisStatus: new FormControl(''),
      hrdRegisterNo: new FormControl(''),
      statutoryEntitlementCodes: new FormControl<string[]>([], { nonNullable: true }),
      commissionSettingCodes: new FormControl<string[]>([], { nonNullable: true }),
      includeOvertime: new FormControl(false, { nonNullable: true }),
      overtimeCalculationBasis: new FormControl<OvertimeCalculationBasis>('HOURLY_RATE', { nonNullable: true }),
      overtimeHourlyRate: new FormControl<number | null>(null),
    }),
    taxInformation: new FormGroup({
    }),
    leave: new FormGroup({
      leavePolicyCodes: new FormControl<string[]>(['AL', 'ML'], { nonNullable: true }),
      leaveEntitlementOverrides: new FormRecord<FormControl<number | null>>({}),
      leaveServiceEntitlementTiers: new FormRecord<FormArray<LeaveServiceTierForm>>({}),
      medicalLeaveEntitlement: new FormControl<number | null>(defaultLeaveEntitlements.medical.amount),
      medicalLeavePeriod: new FormControl<LeaveEntitlementPeriod>(defaultLeaveEntitlements.medical.period, { nonNullable: true }),
    }),
    emergencyContact: new FormGroup({
      emergencyContactName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      emergencyContactRelationship: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      emergencyContactNo: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      emergencyContactAddressLine1: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      emergencyContactAddressLine2: new FormControl(''),
      emergencyContactCity: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      emergencyContactPostcode: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      emergencyContactState: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      emergencyContactCountry: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    }),
  });
  submitting: boolean = false;


  ngOnInit() {
    this.getDepartmentList();
    this.getPositionList();
    this.getWorkLocationList();
    this.getLeavePolicyList();
    this.getPayrollSetting();
  }

  getPayrollSetting() {
    this.payrollSettingApiService.getPayrollSetting().subscribe({
      next: response => {
        const setting: PayrollSetting | null = response?.data ?? null;
        this.statutoryEntitlementList = setting
          ? statutoryEntitlementOptions.filter(option => setting[option.setting])
          : [];
        this.includeBasicSalary = setting?.includeBasicSalary ?? false;
        this.includeOvertime = setting?.includeOvertime ?? false;
        this.includeClaimsAndAllowance = setting?.includeClaimsAndAllowance ?? false;
        this.includeBonus = setting?.includeBonus ?? false;
        this.includeCommissionAndIncentives = setting?.includeCommissionAndIncentives ?? false;

        const { basicSalary, salaryType, includeOvertime, overtimeHourlyRate, commissionSettingCodes } = this.form.controls.payroll.controls;
        if (this.includeBasicSalary) {
          basicSalary.setValidators([Validators.required, Validators.min(0)]);
          salaryType.setValidators(Validators.required);
        } else {
          basicSalary.clearValidators();
          basicSalary.setValue(null);
          salaryType.clearValidators();
          salaryType.setValue('');
        }
        basicSalary.updateValueAndValidity({ emitEvent: false });
        salaryType.updateValueAndValidity({ emitEvent: false });

        if (!this.includeOvertime) {
          includeOvertime.setValue(false);
          overtimeHourlyRate.setValue(null);
          overtimeHourlyRate.clearValidators();
          overtimeHourlyRate.updateValueAndValidity({ emitEvent: false });
        }
        if (!this.includeCommissionAndIncentives) commissionSettingCodes.setValue([]);

        this.form.controls.payroll.controls.statutoryEntitlementCodes.setValue(
          this.statutoryEntitlementList.map(option => option.code)
        );
        this.updateStatutoryValidators();
      },
      error: error => {
        this.toastService.show({
          title: error?.error?.code || 'Error',
          message: error?.error?.message || 'Could not load payroll settings.',
          icon: 'danger'
        });
      }
    });
  }

  getDepartmentList(){
    this.departmentApiService.getAllDepartments(null).subscribe({
      next: (response) => {
        const departments: Department[] = response?.data ?? [];
        this.departmentList = departments.filter(department => department.active);
        console.log("departmentList:", this.departmentList);
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

  getPositionList(){
    this.positionApiService.getAllPositions(null).subscribe({
      next: (response) => {
        const positions: Position[] = response?.data ?? [];
        this.positionList = positions.filter(position => position.active);
        console.log("positionList:", this.positionList);
        this.updatePositionValidator();
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

  getWorkLocationList(){
    this.workLocationApiService.getAllWorkLocations(null).subscribe({
      next: (response) => {
        const workLocations: WorkLocation[] = response?.data ?? [];
        this.workLocationList = workLocations.filter(workLocation => workLocation.active);
        console.log("workLocationList:", this.workLocationList);
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

  getLeavePolicyList(){
    this.leavePolicyApiService.getAllLeavePolicies(null).subscribe({
      next: (response) => {
        const leavePolicies: LeavePolicy[] = response?.data ?? [];
        this.leavePolicyList = leavePolicies.filter(leavePolicy => leavePolicy.active);
        console.log("leavePolicyList:", this.leavePolicyList);
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

  get selectedWorkLocation(): WorkLocation | undefined {
    const locationId = this.form.controls.employment.controls.locationId.value;
    return this.workLocationList.find(location => location.id === locationId);
  }

  get filteredWorkLocations(): WorkLocation[] {
    const searchValue = this.workLocationSearch.value;
    const query = typeof searchValue === 'string' ? searchValue.trim().toLowerCase() : '';
    return this.workLocationList.filter(location => !query || [
      location.name,
      location.code,
      location.city,
      location.state
    ].some(value => value.toLowerCase().includes(query)));
  }

  workLocationDisplayName = (value: WorkLocation | string | null): string => {
    return value && typeof value === 'object' ? value.name : value ?? '';
  };

  onWorkLocationSelected(location: WorkLocation) {
    this.form.controls.employment.controls.locationId.setValue(location.id);
    this.workLocationSearch.setValue(location);
  }

  onWorkLocationSearchInput() {
    if (typeof this.workLocationSearch.value === 'string') {
      this.form.controls.employment.controls.locationId.setValue('');
    }
  }

  goBack() {
    return this.router.navigate(['/workforce/employees/list'])
  }

  get availablePositions(): Position[] {
    const departmentId = this.form.controls.employment.controls.departmentId.value;
    if (!departmentId) return [];

    return this.positionList.filter(position =>
      position.departmentId === departmentId && this.isEffective(position.effectiveFrom, position.effectiveTo)
    );
  }

  get hasAvailablePositions(): boolean {
    return this.availablePositions.length > 0;
  }

  get availableCommissionSettings(): any[] {
    const employeeNo = (this.form.controls.personal.controls.employeeNo.value ?? '').trim();
    const department = this.departmentList.find(item => item.id === this.form.controls.employment.controls.departmentId.value);
    const position = this.availablePositions.find(item => item.id === this.form.controls.employment.controls.positionId.value);

    return this.commissionIncentiveSettings.filter(setting => {
      switch (setting.eligibleEmployees) {
        case 'ALL_EMPLOYEES':
          return true;
        case 'SELECTED_DEPARTMENTS':
          return !!department && setting.eligibleDepartmentIds.includes(department.id);
        case 'SELECTED_POSITIONS':
          return !!position && setting.eligiblePositionIds.includes(position.id);
        case 'SELECTED_EMPLOYEES':
          return !!employeeNo && setting.eligibleEmployeeIds.includes(employeeNo);
      }
    });
  }

  isCommissionSelected(code: string): boolean {
    return this.form.controls.payroll.controls.commissionSettingCodes.value.includes(code);
  }

  setCommissionSelected(code: string, selected: boolean) {
    const codes = this.form.controls.payroll.controls.commissionSettingCodes;
    const selectedCodes = new Set(codes.value);

    if (selected) selectedCodes.add(code);
    else selectedCodes.delete(code);

    codes.setValue([...selectedCodes]);
  }

  setOvertimeIncluded(selected: boolean) {
    const payroll = this.form.controls.payroll.controls;
    payroll.includeOvertime.setValue(selected);
    if (selected && payroll.overtimeCalculationBasis.value === 'HOURLY_RATE') {
      payroll.overtimeHourlyRate.setValidators([Validators.required, Validators.min(0.01)]);
    } else {
      payroll.overtimeHourlyRate.clearValidators();
      if (!selected) payroll.overtimeHourlyRate.setValue(null);
    }
    payroll.overtimeHourlyRate.updateValueAndValidity();
  }

  setOvertimeCalculationBasis(basis: OvertimeCalculationBasis) {
    const payroll = this.form.controls.payroll.controls;
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
    return labels[this.form.controls.payroll.controls.overtimeCalculationBasis.value];
  }

  isStatutoryEntitlementSelected(code: string): boolean {
    return this.form.controls.payroll.controls.statutoryEntitlementCodes.value.includes(code);
  }

  setStatutoryEntitlementSelected(code: string, selected: boolean) {
    const codes = this.form.controls.payroll.controls.statutoryEntitlementCodes;
    const selectedCodes = new Set(codes.value);

    if (selected) selectedCodes.add(code);
    else selectedCodes.delete(code);

    codes.setValue([...selectedCodes]);
    this.updateStatutoryValidators();
  }

  private updateStatutoryValidators() {
    const controls = this.form.controls.payroll.controls;
    const rules = [
      { code: 'EPF', control: controls.epfEmployerNo },
      { code: 'EPF', control: controls.epfRate },
      { code: 'SOCSO', control: controls.socsoNo },
      { code: 'SOCSO', control: controls.contributionCategory },
      { code: 'EIS', control: controls.eisStatus },
      { code: 'HRD_CORP_LEVY', control: controls.hrdRegisterNo },
    ];

    for (const { code, control } of rules) {
      control.setValidators(this.isStatutoryEntitlementSelected(code) ? Validators.required : null);
      control.updateValueAndValidity({ emitEvent: false });
    }
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

  onDepartmentChange(): string {
    this.form.controls.employment.controls.positionId.setValue('');
    this.updatePositionValidator();
    return this.form.controls.employment.controls.departmentId.value;
  }

  private updatePositionValidator() {
    const position = this.form.controls.employment.controls.positionId;
    if (this.hasAvailablePositions) position.setValidators(Validators.required);
    else position.clearValidators();
    position.updateValueAndValidity({ emitEvent: false });
  }

  onEmploymentTypeChange(type: EmploymentType | null) {
    if (!type) return;

    const scheduleDays = this.form.controls.employment.controls.workingSchedule.controls.days;
    WORKING_SCHEDULE[type].days.forEach((day, index) => {
      scheduleDays.at(index)?.patchValue(day);
    });
  }

  private isEffective(effectiveFrom: string | null, effectiveTo: string | null): boolean {
    const today = new Date().toISOString().slice(0, 10);
    return (!effectiveFrom || effectiveFrom <= today) && (!effectiveTo || effectiveTo >= today);
  }

  leaveYear = new Date().getFullYear();

  get selectedLeavePolicies(): LeavePolicy[] {
    const selectedCodes = new Set(this.form.controls.leave.controls.leavePolicyCodes.value);
    return this.leavePolicies.filter(policy => selectedCodes.has(policy.code));
  }

  get medicalLeaveYearlyEntitlement(): number {
    return this.toYearlyEntitlement(
      this.form.controls.leave.controls.medicalLeaveEntitlement.value,
      this.form.controls.leave.controls.medicalLeavePeriod.value
    );
  }

  private toYearlyEntitlement(amount: number | null, period: LeaveEntitlementPeriod): number {
    if (amount === null || !Number.isFinite(amount)) return 0;
    return Math.max(0, amount) * (period === 'month' ? 12 : 1);
  }

  serviceEntitlementTiers(code: string): FormArray<LeaveServiceTierForm> {
    return this.form.controls.leave.controls.leaveServiceEntitlementTiers.controls[code];
  }

  addLeaveServiceTier(code: string) {
    const tiers = this.serviceEntitlementTiers(code);
    const previousTier = tiers.at(tiers.length - 1);
    tiers.push(createLeaveServiceTierForm({
      serviceFrom: previousTier?.controls.serviceTo.value ?? 0,
      serviceTo: null,
      daysPerYear: null
    }));
    this.updateLeaveServiceToValidators(code);
  }

  removeLeaveServiceTier(code: string, index: number) {
    const tiers = this.serviceEntitlementTiers(code);
    if (tiers.length <= 1) return;
    tiers.removeAt(index);
    this.updateLeaveServiceToValidators(code);
  }

  private updateLeaveServiceToValidators(code: string) {
    const tiers = this.serviceEntitlementTiers(code);
    tiers.controls.forEach((tier, index) => {
      tier.controls.serviceTo.setValidators(
        index < tiers.length - 1
          ? [Validators.required, Validators.min(0)]
          : [Validators.min(0)]
      );
      tier.controls.serviceTo.updateValueAndValidity({ emitEvent: false });
    });
  }

  isLeavePolicySelected(code: string): boolean {
    return this.form.controls.leave.controls.leavePolicyCodes.value.includes(code);
  }

  setLeavePolicySelected(code: string, selected: boolean) {
    const codes = this.form.controls.leave.controls.leavePolicyCodes;
    const selectedCodes = new Set(codes.value);

    if (selected) selectedCodes.add(code);
    else {
      selectedCodes.delete(code);
      this.editingLeavePolicyCodes.delete(code);
    }

    codes.setValue([...selectedCodes]);
  }

  isEditingLeavePolicy(code: string): boolean {
    return this.editingLeavePolicyCodes.has(code);
  }

  toggleLeavePolicyEditor(code: string) {
    if (this.editingLeavePolicyCodes.has(code)) this.editingLeavePolicyCodes.delete(code);
    else this.editingLeavePolicyCodes.add(code);
  }

  employeeEntitlementLabel(policy: LeavePolicy): string {
    const entitlement = this.employeeLeaveEntitlement(policy);
    if (entitlement === null) return policy.entitlementCalculationMethod === 'SERVICE' ? 'Enter joined date or entitlement' : 'Set employee entitlement';
    return `${entitlement} ${this.entitlementUnitLabel(policy)} per year`;
  }

  employeeEntitlementRulesLabel(policy: LeavePolicy): string {
    if (policy.entitlementCalculationMethod === 'SERVICE') {
      const tiers = this.serviceEntitlementTiers(policy.code).getRawValue()
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
      return this.form.controls.leave.controls.leaveEntitlementOverrides.controls[policy.code]?.value ?? null;
    }
    const yearsOfService = this.yearsOfService();
    if (yearsOfService === null) return null;
    const tier = (this.serviceEntitlementTiers(policy.code)?.getRawValue() ?? []).find(item =>
      item.serviceFrom !== null
      && yearsOfService >= item.serviceFrom
      && (item.serviceTo === null || yearsOfService < item.serviceTo)
    );
    return tier?.daysPerYear ?? null;
  }

  private yearsOfService(): number | null {
    const joinedDate = this.form.controls.employment.controls.joinedDate.value;
    if (!joinedDate || Number.isNaN(joinedDate.getTime())) return null;
    const today = new Date();
    let years = today.getFullYear() - joinedDate.getFullYear();
    if (today.getMonth() < joinedDate.getMonth()
      || (today.getMonth() === joinedDate.getMonth() && today.getDate() < joinedDate.getDate())) years--;
    return Math.max(0, years);
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


  onSubmit(form: FormGroup) {
    const availableStatutoryCodes = new Set<string>(this.statutoryEntitlementList.map(option => option.code));
    const selectedStatutoryCodes = this.form.controls.payroll.controls.statutoryEntitlementCodes;
    selectedStatutoryCodes.setValue(selectedStatutoryCodes.value.filter(code => availableStatutoryCodes.has(code)));
    const availableCodes = new Set(this.availableCommissionSettings.map(setting => setting.code));
    const selectedCodes = this.form.controls.payroll.controls.commissionSettingCodes;
    selectedCodes.setValue(selectedCodes.value.filter(code => availableCodes.has(code)));
    const overtimeControls = this.form.controls.payroll.controls;
    if (!this.includeOvertime || !overtimeControls.includeOvertime.value) {
      overtimeControls.includeOvertime.setValue(false);
      overtimeControls.overtimeHourlyRate.setValue(null);
    }
    const { personal, employment, payroll, taxInformation, leave, emergencyContact } = form.value;
    const { employeeNo, name, ...personalFields } = personal;
    const toDateString = (value: Date | string | null | undefined): string | null => {
      if (!value) return null;
      if (typeof value === 'string') return value;
      const year = value.getFullYear();
      const month = String(value.getMonth() + 1).padStart(2, '0');
      const day = String(value.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    const data: EmployeeCreatePayload = {
      ...personalFields,
      employeeNo: employeeNo,
      name: name,
      dateOfBirth: toDateString(personal.dateOfBirth),
      ...employment,
      positionId: employment.positionId || null,
      managerId: employment.managerId || null,
      joinedDate: toDateString(employment.joinedDate),
      confirmationDate: toDateString(employment.confirmationDate),
      resignationDate: toDateString(employment.resignationDate),
      ...payroll,
      ...taxInformation,
      ...leave,
      ...emergencyContact,
    };
    console.log('employee data', data);

    this.apiService.createEmployee(data).subscribe({
      next: (response) => {
        console.log("response", response);

        this.toastService.show({
          title: "Success",
          message: "Position has been created.",
          icon: 'success'
        });

        this.formDirective.resetForm();
        this.submitting = false;
        setTimeout(() => {
          this.router.navigate(['/organization/positions/overview']);
        }, 1000);
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

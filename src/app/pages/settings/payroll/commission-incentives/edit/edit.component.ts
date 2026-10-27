
import { Component, DestroyRef, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MaterialImports, MaterialProviders } from '../../../../../shared/material-imports';
import { commissionIncentiveSettings } from '../../../../../data/commission-incentive-settings';
import { departments } from '../../../../../data/departments';
import { employees } from '../../../../../data/employees';
import { positions } from '../../../../../data/positions';
import type {
  CommissionCalculationFrequency,
  CommissionCalculationMethod,
  CommissionEmployeeEligibility,
  CommissionIncentiveSetting,
  CommissionIncentiveType,
  CommissionPayoutTiming
} from '../../../../../models/commission-incentive-setting.model';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [...MaterialImports, ReactiveFormsModule, RouterLink],
  providers: [...MaterialProviders],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent implements OnInit {
  readonly commissionSettings = commissionIncentiveSettings;
  commissionSetting: CommissionIncentiveSetting | undefined;
  private originalCode = '';

  readonly commissionTypes: { value: CommissionIncentiveType; label: string }[] = [
    { value: 'SALES_COMMISSION', label: 'Sales Commission' },
    { value: 'TIERED_SALES_COMMISSION', label: 'Tiered Sales Commission' },
    { value: 'REVENUE_COMMISSION', label: 'Revenue Commission' },
    { value: 'PROFIT_COMMISSION', label: 'Profit-Based Commission' },
    { value: 'TARGET_ACHIEVEMENT', label: 'Sales Target Achievement Incentive' },
    { value: 'REFERRAL_INCENTIVE', label: 'Referral Incentive' },
    { value: 'COLLECTION_INCENTIVE', label: 'Payment Collection Incentive' },
    { value: 'PROJECT_INCENTIVE', label: 'Project Completion Incentive' },
    { value: 'TEAM_INCENTIVE', label: 'Team Performance Incentive' },
    { value: 'PRODUCT_INCENTIVE', label: 'Product-Specific Sales Incentive' },
    { value: 'CUSTOMER_ACQUISITION', label: 'New Customer Acquisition Incentive' },
    { value: 'CUSTOM', label: 'Other / Custom Incentive' }
  ];

  readonly calculationMethods: { value: CommissionCalculationMethod; label: string }[] = [
    { value: 'PERCENTAGE_OF_SALES', label: 'Percentage of Sales' },
    { value: 'PERCENTAGE_OF_REVENUE', label: 'Percentage of Revenue' },
    { value: 'PERCENTAGE_OF_PROFIT', label: 'Percentage of Profit' },
    { value: 'FIXED_PER_TRANSACTION', label: 'Fixed Amount per Transaction' },
    { value: 'TIERED_RATE', label: 'Tiered Rate' },
    { value: 'TARGET_BASED', label: 'Target-Based Calculation' },
    { value: 'FIXED_AMOUNT', label: 'Fixed Amount' }
  ];

  readonly calculationFrequencies: { value: CommissionCalculationFrequency; label: string }[] = [
    { value: 'PER_TRANSACTION', label: 'Per transaction' },
    { value: 'WEEKLY', label: 'Weekly' },
    { value: 'BIWEEKLY', label: 'Every two weeks' },
    { value: 'MONTHLY', label: 'Monthly' },
    { value: 'QUARTERLY', label: 'Quarterly' }
  ];

  readonly payoutTimings: { value: CommissionPayoutTiming; label: string }[] = [
    { value: 'CURRENT_PAYROLL', label: 'Current payroll cycle' },
    { value: 'NEXT_PAYROLL', label: 'Next payroll cycle' },
    { value: 'SEPARATE_PAYOUT', label: 'Separate payout' }
  ];

  readonly employeeEligibilityOptions: { value: CommissionEmployeeEligibility; label: string }[] = [
    { value: 'ALL_EMPLOYEES', label: 'All employees' },
    { value: 'SELECTED_DEPARTMENTS', label: 'Selected departments' },
    { value: 'SELECTED_POSITIONS', label: 'Selected positions' },
    { value: 'SELECTED_EMPLOYEES', label: 'Selected employees' }
  ];

  readonly departments = departments.filter(department => department.status === 'Active');
  readonly positions = positions.filter(position => position.effectiveTo === null);
  readonly employees = employees.filter(employee => employee.employmentStatus === 'Active');

  readonly commissionForm = new FormGroup({
    code: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(20), Validators.pattern(/^[A-Za-z][A-Za-z0-9_-]*$/)]
    }),
    name: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(60)] }),
    commissionType: new FormControl<CommissionIncentiveType>('SALES_COMMISSION', { nonNullable: true, validators: [Validators.required] }),
    calculationMethod: new FormControl<CommissionCalculationMethod>('PERCENTAGE_OF_SALES', { nonNullable: true, validators: [Validators.required] }),
    rate: new FormControl<number | null>(null),
    amount: new FormControl<number | null>(null),
    calculationFrequency: new FormControl<CommissionCalculationFrequency>('MONTHLY', { nonNullable: true, validators: [Validators.required] }),
    payoutTiming: new FormControl<CommissionPayoutTiming>('CURRENT_PAYROLL', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(250)] }),
    eligibleEmployees: new FormControl<CommissionEmployeeEligibility>('ALL_EMPLOYEES', { nonNullable: true, validators: [Validators.required] }),
    eligibleDepartmentIds: new FormControl<string[]>([], { nonNullable: true }),
    eligiblePositionIds: new FormControl<string[]>([], { nonNullable: true }),
    eligibleEmployeeIds: new FormControl<string[]>([], { nonNullable: true }),
    payrollEarningCode: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(20), Validators.pattern(/^[A-Za-z][A-Za-z0-9_-]*$/)] }),
    requiresApproval: new FormControl(true, { nonNullable: true })
  });

  submitted = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly destroyRef: DestroyRef
  ) {
    this.commissionForm.controls.calculationMethod.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(method => this.updateCalculationFields(method));
    this.updateCalculationFields(this.commissionForm.controls.calculationMethod.value);
    this.commissionForm.controls.eligibleEmployees.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(eligibility => this.updateEligibilityFields(eligibility));
    this.updateEligibilityFields(this.commissionForm.controls.eligibleEmployees.value);
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      const code = params.get('code');
      this.commissionSetting = this.commissionSettings.find(setting => setting.code.toUpperCase() === code?.toUpperCase());

      if (!this.commissionSetting) {
        void this.router.navigateByUrl('/settings/payroll/commission-incentives/overview');
        return;
      }

      this.originalCode = this.commissionSetting.code;
      this.patchCommissionForm(this.commissionSetting);
    });
  }

  get usesPercentageCalculation(): boolean {
    return this.usesRateCalculation(this.commissionForm.controls.calculationMethod.value);
  }

  get showDepartmentSelection(): boolean {
    return this.commissionForm.controls.eligibleEmployees.value === 'SELECTED_DEPARTMENTS';
  }

  get showPositionSelection(): boolean {
    return this.commissionForm.controls.eligibleEmployees.value === 'SELECTED_POSITIONS';
  }

  get showEmployeeSelection(): boolean {
    return this.commissionForm.controls.eligibleEmployees.value === 'SELECTED_EMPLOYEES';
  }

  onSubmit(): void {
    this.submitted = true;
    if (!this.commissionSetting) return;

    const codeControl = this.commissionForm.controls.code;
    const normalizedCode = codeControl.value.trim().toUpperCase();
    codeControl.setValue(normalizedCode, { emitEvent: false });

    const duplicateCode = this.commissionSettings.some(setting =>
      setting.code.toUpperCase() === normalizedCode && setting.code !== this.originalCode
    );
    if (duplicateCode) {
      codeControl.setErrors({ ...codeControl.errors, duplicate: true });
    }

    if (this.commissionForm.invalid) {
      this.commissionForm.markAllAsTouched();
      return;
    }

    const value = this.commissionForm.getRawValue();
    const updatedSetting: CommissionIncentiveSetting = {
      ...value,
      code: normalizedCode,
      name: value.name.trim(),
      description: value.description.trim(),
      rate: this.usesRateCalculation(value.calculationMethod) ? value.rate : null,
      amount: this.usesRateCalculation(value.calculationMethod) ? null : value.amount,
      eligibleDepartmentIds: value.eligibleEmployees === 'SELECTED_DEPARTMENTS' ? value.eligibleDepartmentIds : [],
      eligiblePositionIds: value.eligibleEmployees === 'SELECTED_POSITIONS' ? value.eligiblePositionIds : [],
      eligibleEmployeeIds: value.eligibleEmployees === 'SELECTED_EMPLOYEES' ? value.eligibleEmployeeIds : []
    };
    const settingIndex = this.commissionSettings.findIndex(setting => setting.code === this.originalCode);
    if (settingIndex < 0) return;

    this.commissionSettings[settingIndex] = updatedSetting;
    this.commissionSetting = updatedSetting;
    void this.router.navigateByUrl('/settings/payroll/commission-incentives/overview');
  }

  private patchCommissionForm(setting: CommissionIncentiveSetting): void {
    const formValues = Object.fromEntries(
      Object.entries(setting).filter(([key]) => this.commissionForm.contains(key) && !['rate', 'amount', 'eligibleDepartmentIds', 'eligiblePositionIds', 'eligibleEmployeeIds'].includes(key))
    );

    this.commissionForm.patchValue(formValues, { emitEvent: false });
    this.updateEligibilityFields(setting.eligibleEmployees);
    this.commissionForm.controls.eligibleDepartmentIds.setValue(setting.eligibleDepartmentIds ?? [], { emitEvent: false });
    this.commissionForm.controls.eligiblePositionIds.setValue(setting.eligiblePositionIds ?? [], { emitEvent: false });
    this.commissionForm.controls.eligibleEmployeeIds.setValue(setting.eligibleEmployeeIds ?? [], { emitEvent: false });
    this.updateCalculationFields(setting.calculationMethod);

    if (this.usesRateCalculation(setting.calculationMethod)) {
      this.commissionForm.controls.rate.setValue(setting.rate, { emitEvent: false });
    } else {
      this.commissionForm.controls.amount.setValue(setting.amount, { emitEvent: false });
    }
  }

  private updateCalculationFields(method: CommissionCalculationMethod): void {
    const rate = this.commissionForm.controls.rate;
    const amount = this.commissionForm.controls.amount;

    if (this.usesRateCalculation(method)) {
      amount.reset(null, { emitEvent: false });
      amount.clearValidators();
      amount.disable({ emitEvent: false });
      rate.enable({ emitEvent: false });
      rate.setValidators([Validators.required, Validators.min(0)]);
    } else {
      rate.reset(null, { emitEvent: false });
      rate.clearValidators();
      rate.disable({ emitEvent: false });
      amount.enable({ emitEvent: false });
      amount.setValidators([Validators.required, Validators.min(0)]);
    }

    rate.updateValueAndValidity({ emitEvent: false });
    amount.updateValueAndValidity({ emitEvent: false });
  }

  private usesRateCalculation(method: CommissionCalculationMethod): boolean {
    return ['PERCENTAGE_OF_SALES', 'PERCENTAGE_OF_REVENUE', 'PERCENTAGE_OF_PROFIT', 'TIERED_RATE'].includes(method);
  }

  private updateEligibilityFields(eligibility: CommissionEmployeeEligibility): void {
    const selections = [
      { key: 'SELECTED_DEPARTMENTS', control: this.commissionForm.controls.eligibleDepartmentIds },
      { key: 'SELECTED_POSITIONS', control: this.commissionForm.controls.eligiblePositionIds },
      { key: 'SELECTED_EMPLOYEES', control: this.commissionForm.controls.eligibleEmployeeIds }
    ] as const;

    selections.forEach(({ key, control }) => {
      if (eligibility === key) {
        control.enable({ emitEvent: false });
        control.setValidators([Validators.required]);
      } else {
        control.reset([], { emitEvent: false });
        control.clearValidators();
        control.disable({ emitEvent: false });
      }
      control.updateValueAndValidity({ emitEvent: false });
    });
  }
}

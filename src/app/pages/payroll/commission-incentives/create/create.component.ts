import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { employees } from '../../../../data/employees';
import { departments } from '../../../../data/departments';
import { positions } from '../../../../data/positions';
import { commissionIncentiveSettings } from '../../../../data/commission-incentive-settings';
import { commissionPayrollRecords } from '../../../../data/commission-payroll-records';
import type { EmployeeRecord } from '../../../../models/employee.model';
import type {
  CommissionCalculationFrequency,
  CommissionCalculationMethod,
  CommissionIncentiveSetting
} from '../../../../models/commission-incentive-setting.model';
import type { CommissionPayrollRecord } from '../../../../models/commission-payroll-record.model';
import { MaterialImports, MaterialProviders } from '../../../../shared/material-imports';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [...MaterialImports, CommonModule, ReactiveFormsModule],
  providers: [...MaterialProviders],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})

export class CreateComponent {
  readonly employees = employees.filter(employee => employee.employmentStatus === 'Active');
  readonly departments = departments;
  readonly positions = positions;
  readonly commissionPlans: CommissionIncentiveSetting[] = commissionIncentiveSettings;
  readonly commissionRecords = commissionPayrollRecords;
  readonly employeeSearch = new FormControl<EmployeeRecord | string>('');
  submitted = false;

  readonly assignmentForm = new FormGroup({
    employeeId: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    commissionSettingCode: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    calculationBasis: new FormControl<number | null>(null),
    referenceId: new FormControl('', { nonNullable: true }),
    notes: new FormControl('', { nonNullable: true })
  });

  get filteredEmployees(): EmployeeRecord[] {
    const searchValue = this.employeeSearch.value;
    const query = typeof searchValue === 'string' ? searchValue.trim().toLowerCase() : '';

    return this.employees.filter(employee =>
      !query || `${employee.employeeId} ${employee.employeeName}`.toLowerCase().includes(query)
    );
  }

  get selectedEmployee(): EmployeeRecord | undefined {
    return this.employees.find(employee => employee.employeeId === this.assignmentForm.controls.employeeId.value);
  }

  get availableCommissionPlans(): CommissionIncentiveSetting[] {
    const employee = this.selectedEmployee;
    if (!employee) return [];

    const department = this.departments.find(item => item.name === employee.department);
    const position = this.positions.find(item => item.title === employee.position);

    return this.commissionPlans.filter(plan => {
      switch (plan.eligibleEmployees) {
        case 'ALL_EMPLOYEES':
          return true;
        case 'SELECTED_DEPARTMENTS':
          return !!department && plan.eligibleDepartmentIds.includes(department.id);
        case 'SELECTED_POSITIONS':
          return !!position && plan.eligiblePositionIds.includes(position.id);
        case 'SELECTED_EMPLOYEES':
          return plan.eligibleEmployeeIds.includes(employee.employeeId);
      }
    });
  }

  get selectedCommissionPlan(): CommissionIncentiveSetting | undefined {
    const planCode = this.assignmentForm.controls.commissionSettingCode.value;
    return this.availableCommissionPlans.find(plan => plan.code === planCode);
  }

  get usesPercentageCalculation(): boolean {
    const method = this.selectedCommissionPlan?.calculationMethod;
    return method === 'PERCENTAGE_OF_SALES'
      || method === 'PERCENTAGE_OF_REVENUE'
      || method === 'PERCENTAGE_OF_PROFIT'
      || method === 'TIERED_RATE';
  }

  get estimatedCommissionAmount(): number | null {
    const plan = this.selectedCommissionPlan;
    if (!plan) return null;
    if (!this.usesPercentageCalculation) return plan.amount;

    const basis = this.assignmentForm.controls.calculationBasis.value;
    if (basis === null || plan.rate === null) return null;
    return basis * plan.rate / 100;
  }

  calculationMethodLabel(method: CommissionCalculationMethod): string {
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

  calculationFrequencyLabel(frequency: CommissionCalculationFrequency): string {
    const labels: Record<CommissionCalculationFrequency, string> = {
      PER_TRANSACTION: 'Per transaction',
      WEEKLY: 'Weekly',
      BIWEEKLY: 'Every two weeks',
      MONTHLY: 'Monthly',
      QUARTERLY: 'Quarterly'
    };
    return labels[frequency];
  }

  readonly employeeDisplayName = (value: EmployeeRecord | string | null): string => {
    if (value && typeof value === 'object') return `${value.employeeId} - ${value.employeeName}`;
    if (!value) return '';
    const employee = this.employees.find(item => item.employeeId === value);
    return employee ? `${employee.employeeId} - ${employee.employeeName}` : value;
  };

  onEmployeeSelected(employee: EmployeeRecord): void {
    this.submitted = false;
    this.assignmentForm.controls.employeeId.setValue(employee.employeeId);
    const eligibleCodes = new Set(this.availableCommissionPlans.map(plan => plan.code));
    const currentPlanCode = (employee.commissionSettingCodes ?? []).find(code => eligibleCodes.has(code)) ?? '';
    this.assignmentForm.controls.commissionSettingCode.setValue(currentPlanCode);
    this.assignmentForm.controls.calculationBasis.setValue(null);
    this.updateCalculationBasisValidation();
    this.employeeSearch.setValue(employee);
    this.employeeSearch.setErrors(null);
  }

  onEmployeeSearchInput(): void {
    this.submitted = false;
    this.employeeSearch.setErrors(null);
    if (typeof this.employeeSearch.value === 'string') {
      this.assignmentForm.controls.employeeId.setValue('');
      this.assignmentForm.controls.commissionSettingCode.setValue('');
      this.assignmentForm.controls.calculationBasis.setValue(null);
      this.updateCalculationBasisValidation();
    }
  }

  onCommissionPlanChange(): void {
    this.assignmentForm.controls.calculationBasis.setValue(null);
    this.updateCalculationBasisValidation();
  }

  onSubmit(): void {
    this.submitted = false;
    this.assignmentForm.markAllAsTouched();
    this.employeeSearch.markAsTouched();

    const employee = this.selectedEmployee;
    if (!employee) {
      this.submitted = true;
      this.employeeSearch.setErrors({ selectionRequired: true });
      return;
    }
    this.employeeSearch.setErrors(null);
    if (this.assignmentForm.invalid) {
      this.submitted = true;
      return;
    }

    const selectedCode = this.assignmentForm.controls.commissionSettingCode.value;
    const eligibleCodes = new Set(this.availableCommissionPlans.map(plan => plan.code));
    if (!selectedCode || !eligibleCodes.has(selectedCode)) {
      this.submitted = true;
      this.assignmentForm.controls.commissionSettingCode.setErrors({ required: true });
      return;
    }

    const plan = this.selectedCommissionPlan;
    const amount = this.estimatedCommissionAmount;
    if (!plan || amount === null) {
      this.assignmentForm.controls.commissionSettingCode.setErrors({ calculationUnavailable: true });
      this.submitted = true;
      return;
    }

    const nextId = this.commissionRecords.reduce((maximum, record) => {
      const suffix = Number(record.id.match(/(\d+)$/)?.[1]);
      return Number.isFinite(suffix) ? Math.max(maximum, suffix) : maximum;
    }, 0) + 1;
    const commissionRecord: CommissionPayrollRecord = {
      id: `CPR-${String(nextId).padStart(4, '0')}`,
      employeeId: employee.employeeId,
      employeeName: employee.employeeName,
      planCode: plan.code,
      planName: plan.name,
      payrollEarningCode: plan.payrollEarningCode,
      calculationMethod: plan.calculationMethod,
      calculationFrequency: plan.calculationFrequency,
      payoutTiming: plan.payoutTiming,
      calculationBasis: this.usesPercentageCalculation ? this.assignmentForm.controls.calculationBasis.value : null,
      rate: plan.rate,
      amount,
      referenceId: this.assignmentForm.controls.referenceId.value.trim(),
      notes: this.assignmentForm.controls.notes.value.trim(),
      createdDate: new Date().toISOString().slice(0, 10),
      approvedBy: null,
      approvedAt: null,
      approvalComment: '',
      status: plan.requiresApproval ? 'PENDING_APPROVAL' : 'READY_FOR_PAYROLL'
    };
    this.commissionRecords.push(commissionRecord);

    const selectedCodes = new Set(employee.commissionSettingCodes ?? []);
    selectedCodes.add(selectedCode);
    employee.commissionSettingCodes = [...selectedCodes];
  }

  private updateCalculationBasisValidation(): void {
    const basis = this.assignmentForm.controls.calculationBasis;
    if (this.usesPercentageCalculation) {
      basis.setValidators([Validators.required, Validators.min(0.01)]);
    } else {
      basis.clearValidators();
      basis.setValue(null, { emitEvent: false });
    }
    basis.updateValueAndValidity({ emitEvent: false });
  }
}

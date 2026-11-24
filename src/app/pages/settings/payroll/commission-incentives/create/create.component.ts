
import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, FormGroupDirective } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { MaterialImports, MaterialProviders } from '../../../../../shared/material-imports';
import {
  commissionTypes as commissionTypeOptions,
  calculationMethods as calculationMethodOptions,
  calculationFrequencies as calculationFrequencyOptions,
  payoutTimings as payoutTimingOptions,
  employeeEligibilityOptions as eligibilityOptions
} from '../../../../../models/commission/commission-incentive-setting.model';
import type {
  CommissionCalculationFrequency,
  CommissionCalculationMethod,
  CommissionEmployeeEligibility,
  CommissionIncentiveSetting,
  CommissionIncentiveType,
  CommissionPayoutTiming
} from '../../../../../models/commission/commission-incentive-setting.model';
import { DepartmentsApiService } from '../../../../../services/api/departments.service';
import { PositionsApiService } from '../../../../../services/api/positions.service';
import { ToastService } from '../../../../../shared/components/toast/toast.service';
import { EmployeesApiService } from '../../../../../services/api/employees.service';
import { EmployeeOverview } from '../../../../../models/workforce/employee.model';
import { Position } from '../../../../../models/workforce/position.model';
import { Department } from '../../../../../models/workforce/department.model';
import { CommissionSettingApiService } from '../../../../../services/api/commission-setting.service';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [...MaterialImports, ReactiveFormsModule],
  providers: [...MaterialProviders, PositionsApiService, DepartmentsApiService, EmployeesApiService, CommissionSettingApiService],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent {

  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;
  
  constructor(
    private router: Router,
    private apiService: CommissionSettingApiService,
    private positionApiService: PositionsApiService,
    private departmentApiService: DepartmentsApiService,
    private employeeApiService: EmployeesApiService,
    private toastService: ToastService
  ) {
     this.form.controls.calculationMethod.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(method => this.updateCalculationFields(method));
    this.updateCalculationFields(this.form.controls.calculationMethod.value);
    this.form.controls.eligibleEmployees.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(eligibility => this.updateEligibilityFields(eligibility));
    this.updateEligibilityFields(this.form.controls.eligibleEmployees.value);
  }

  commissionTypes = commissionTypeOptions;
  calculationMethods = calculationMethodOptions;
  calculationFrequencies = calculationFrequencyOptions;
  payoutTimings = payoutTimingOptions;
  employeeEligibilityOptions = eligibilityOptions;
  departmentList: Department[] = [];
  positionList: Position[] = [];
  employeeList: EmployeeOverview[] = [];
  form = new FormGroup({
    code: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    commissionType: new FormControl<CommissionIncentiveType | null>(null, Validators.required),
    calculationMethod: new FormControl<CommissionCalculationMethod | null>(null, Validators.required),
    rate: new FormControl<number | null>(null),
    amount: new FormControl<number | null>(null),
    calculationFrequency: new FormControl<CommissionCalculationFrequency | null>(null, Validators.required),
    payoutTiming: new FormControl<CommissionPayoutTiming | null>(null, Validators.required),
    description: new FormControl<string | null>(''),
    eligibleEmployees: new FormControl<CommissionEmployeeEligibility | null>(null, Validators.required),
    eligibleDepartmentIds: new FormControl<string[]>([], { nonNullable: true }),
    eligiblePositionIds: new FormControl<string[]>([], { nonNullable: true }),
    eligibleEmployeeIds: new FormControl<string[]>([], { nonNullable: true }),
    payrollEarningCode: new FormControl<string | null>(null, Validators.required),
    requiresApproval: new FormControl<boolean | null>(null)
  });
  submitting: boolean = false;
    
  ngOnInit() {
    this.getDepartmentList();
    this.getPositionList();
    this.getEmployeeList();
  }
  
  get usesPercentageCalculation(): boolean {
    return this.usesRateCalculation(this.form.controls.calculationMethod.value);
  }

  get showDepartmentSelection(): boolean {
    return this.form.controls.eligibleEmployees.value === 'SELECTED_DEPARTMENTS';
  }

  get showPositionSelection(): boolean {
    return this.form.controls.eligibleEmployees.value === 'SELECTED_POSITIONS';
  }

  get showEmployeeSelection(): boolean {
    return this.form.controls.eligibleEmployees.value === 'SELECTED_EMPLOYEES';
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

  getEmployeeList(){
    this.employeeApiService.getAllEmployees(null).subscribe({
      next: (response) => {
        const employees: EmployeeOverview[] = response?.data ?? [];
        this.employeeList = employees.filter(employee => {});
        console.log("employeeList:", this.employeeList);
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

  goBack() {
    return this.router.navigate(['/settings/commission-incentives/overview'])
  }

  onSubmit(form: FormGroup) {
    if (form.invalid) {
      form.markAllAsTouched();
      return;
    }

    const value = form.value;
    const data: CommissionIncentiveSetting = {
      ...value,
      rate: this.usesRateCalculation(value.calculationMethod) ? value.rate : null,
      amount: this.usesRateCalculation(value.calculationMethod) ? null : value.amount,
      eligibleDepartmentIds: value.eligibleEmployees === 'SELECTED_DEPARTMENTS' ? value.eligibleDepartmentIds : [],
      eligiblePositionIds: value.eligibleEmployees === 'SELECTED_POSITIONS' ? value.eligiblePositionIds : [],
      eligibleEmployeeIds: value.eligibleEmployees === 'SELECTED_EMPLOYEES' ? value.eligibleEmployeeIds : []
    };
    console.log("data", data)

    this.apiService.createCommissionSetting(data).subscribe({
      next: (response) => {
        console.log("response", response);

        this.toastService.show({
          title: "Success",
          message: "Commission type has been created.",
          icon: 'success'
        });

        this.formDirective.resetForm();
        this.submitting = false;
        setTimeout(() => {
          this.router.navigate(['/settings/commission-incentives/overview']);
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

  private updateCalculationFields(method: CommissionCalculationMethod | null): void {
    const rate = this.form.controls.rate;
    const amount = this.form.controls.amount;

    if (!method) {
      rate.reset(null, { emitEvent: false });
      amount.reset(null, { emitEvent: false });
      rate.clearValidators();
      amount.clearValidators();
      rate.disable({ emitEvent: false });
      amount.disable({ emitEvent: false });
    } else if (this.usesRateCalculation(method)) {
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

  private usesRateCalculation(method: CommissionCalculationMethod | null): boolean {
    if (!method) return false;
    return ['PERCENTAGE_OF_SALES', 'PERCENTAGE_OF_REVENUE', 'PERCENTAGE_OF_PROFIT', 'TIERED_RATE'].includes(method);
  }

  private updateEligibilityFields(eligibility: CommissionEmployeeEligibility | null): void {
    const selections = [
      { key: 'SELECTED_DEPARTMENTS', control: this.form.controls.eligibleDepartmentIds },
      { key: 'SELECTED_POSITIONS', control: this.form.controls.eligiblePositionIds },
      { key: 'SELECTED_EMPLOYEES', control: this.form.controls.eligibleEmployeeIds }
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

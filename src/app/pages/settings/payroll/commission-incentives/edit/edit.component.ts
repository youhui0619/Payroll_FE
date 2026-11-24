import { ChangeDetectorRef, Component, DestroyRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
import { CommissionSettingApiService } from '../../../../../services/api/commission-setting.service';
import { DepartmentsApiService } from '../../../../../services/api/departments.service';
import { PositionsApiService } from '../../../../../services/api/positions.service';
import { EmployeesApiService } from '../../../../../services/api/employees.service';
import type { Department } from '../../../../../models/workforce/department.model';
import type { Position } from '../../../../../models/workforce/position.model';
import type { EmployeeOverview } from '../../../../../models/workforce/employee.model';
import { ToastService } from '../../../../../shared/components/toast/toast.service';
import { AlertService } from '../../../../../shared/components/alert/alert.service';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [...MaterialImports, ReactiveFormsModule, RouterLink],
  providers: [...MaterialProviders, CommissionSettingApiService, DepartmentsApiService, PositionsApiService, EmployeesApiService],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private commissionApiService: CommissionSettingApiService,
    private departmentApiService: DepartmentsApiService,
    private positionApiService: PositionsApiService,
    private employeeApiService: EmployeesApiService,
    private toastService: ToastService,
    private alertService: AlertService,
    private cdr: ChangeDetectorRef
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
  
  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;

  commissionSetting: CommissionIncentiveSetting | null = null;
  commissionTypes = commissionTypeOptions;
  calculationMethods = calculationMethodOptions;
  calculationFrequencies = calculationFrequencyOptions;
  payoutTimings = payoutTimingOptions;
  employeeEligibilityOptions = eligibilityOptions;
  departmentList: Department[] = [];
  positionList: Position[] = [];
  employeeList: EmployeeOverview[] = [];
  submitting = false;
  id: any;
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
  ngOnInit() {
    this.getDepartmentList();
    this.getPositionList();
    this.getEmployeeList();
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      if (this.id) {
        this.getCommissionSetting(this.id);
      } else {
        console.error("🚨 No ID found in route!");
      }
    });  
  }

  getCommissionSetting(id: string) {
    this.commissionApiService.getCommissionSetting(id).subscribe({
      next: (response) => {
        this.commissionSetting = response.data;
        console.log("commissionSetting:", this.commissionSetting);
        if(this.commissionSetting){
          this.form.patchValue(this.commissionSetting)
        }
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

  goBack() {
    return this.router.navigate(['/settings/commission-incentives/overview']);
  }

  onSubmit(form: FormGroup) {
    if (form.invalid) {
      form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const value = form.value;
    const data: CommissionIncentiveSetting = {
      ...value,
      rate: this.usesRateCalculation(value.calculationMethod) ? value.rate : null,
      amount: this.usesRateCalculation(value.calculationMethod) ? null : value.amount,
      eligibleDepartmentIds: value.eligibleEmployees === 'SELECTED_DEPARTMENTS' ? value.eligibleDepartmentIds : [],
      eligiblePositionIds: value.eligibleEmployees === 'SELECTED_POSITIONS' ? value.eligiblePositionIds : [],
      eligibleEmployeeIds: value.eligibleEmployees === 'SELECTED_EMPLOYEES' ? value.eligibleEmployeeIds : []
    };

    this.commissionApiService.updateCommissionSetting(this.id, data).subscribe({
      next: () => {
        this.toastService.show({ title: 'Success', message: 'Commission type has been updated.', icon: 'success' });
        this.submitting = false;
        this.goBack();
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

  private updateCalculationFields(method: CommissionCalculationMethod | null) {
    const { rate, amount } = this.form.controls;
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
    return !!method && ['PERCENTAGE_OF_SALES', 'PERCENTAGE_OF_REVENUE', 'PERCENTAGE_OF_PROFIT', 'TIERED_RATE'].includes(method);
  }

  private updateEligibilityFields(eligibility: CommissionEmployeeEligibility | null) {
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


  updateStatus(commissionSetting: any){
    const isActive = commissionSetting.active
    const action = isActive ? 'deactivated' : 'activated';
    const actionLabel = isActive ? 'Deactivate' : 'Activate';

    this.alertService.show({
      title: `${actionLabel} Commission`,
      content: `Are you sure you want to ${actionLabel.toLowerCase()} this commission?`,
      approveLabel: 'Continue',
      rejectLabel: 'Cancel',
      onApprove: () => {
        this.commissionApiService.updateCommissionSettingStatus(commissionSetting.id).subscribe({
          next: (response) => {
            this.commissionSetting = response.data;
            this.cdr.markForCheck();
           this.toastService.show({
              title: "Success",
              message: `Commission has been ${action}.`,
              icon: 'success'
            });
            setTimeout(()=>{
              this.alertService.close()
            }, 1000)
          },
          error: (error) => {
            this.toastService.show({
              title: error.error.code,
              message: error.error.message,
              icon: 'danger'
            });
          },
        });
       },
      onReject: () => {
          this.alertService.close()
       }
    });
  }
}

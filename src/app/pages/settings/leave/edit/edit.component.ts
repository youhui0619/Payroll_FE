
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MaterialImports, MaterialProviders } from '../../../../shared/material-imports';
import type { LeavePolicy, LeaveServiceEntitlementTier } from '../../../../models/leave/leave-policy.model';
import { ToastService } from '../../../../shared/components/toast/toast.service';
import { AlertService } from '../../../../shared/components/alert/alert.service';
import { LeavePolicyApiService } from '../../../../services/api/leave-policy.service';

type ServiceEntitlementTierForm = FormGroup<{
  serviceFrom: FormControl<number | null>;
  serviceTo: FormControl<number | null>;
  daysPerYear: FormControl<number | null>;
}>;

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [...MaterialImports, ReactiveFormsModule],
  providers: [...MaterialProviders, LeavePolicyApiService],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent implements OnInit {

  constructor(
    private toastService: ToastService,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    private apiService: LeavePolicyApiService,
    private cdr: ChangeDetectorRef
  ){
    this.form.controls.serviceEntitlementTiers.disable({ emitEvent: false });
    this.form.controls.carryForwardPolicy.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(policy => this.updateMaximumCarryForwardValidation(policy));
    this.form.controls.entitlementCalculationMethod.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(method => this.updateEntitlementValidation(method));
  }

  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;

  leavePolicy: LeavePolicy | null = null;
  id: any = '';
  form = new FormGroup({
    code: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl(''),
    status: new FormControl<'ACTIVE' | 'INACTIVE'>('ACTIVE', { nonNullable: true }),
    entitlementUnit: new FormControl<'DAILY' | 'HOURLY'>('DAILY', { nonNullable: true, validators: [Validators.required] }),
    paid: new FormControl<boolean>(true, { nonNullable: true, validators: [Validators.required] }),
    entitlementCalculationMethod: new FormControl<'FIXED' | 'SERVICE'>('FIXED', { nonNullable: true }),
    defaultEntitlement: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    serviceEntitlementTiers: new FormArray<ServiceEntitlementTierForm>([this.createServiceEntitlementTier(0)]),
    entitlementGrantMethod: new FormControl<'ANNUAL' | 'MONTHLY_ACCRUAL' | 'SERVICE_ANNIVERSARY' | 'MANUAL'>('ANNUAL', { nonNullable: true }),
    eligibility: new FormControl<'ALL_EMPLOYEES' | 'PERMANENT' | 'PROBATION' | 'PART_TIME' | 'CONTRACT_WORKER' | 'INTERN'>('ALL_EMPLOYEES', { nonNullable: true }),
    leaveYear: new FormControl<'CALENDAR' | 'EMPLOYMENT_ANNIVERSARY' | 'FINANCIAL'>('CALENDAR', { nonNullable: true }),
    carryForwardPolicy: new FormControl<'NONE' | 'LIMITED' | 'UNLIMITED' | 'HR_REVIEW'>('NONE', { nonNullable: true }),
    maximumCarryForward: new FormControl<number | null>({ value: null, disabled: true }),
    approval: new FormControl<'MANAGER' | 'MANAGER_HR' | 'HR_ONLY' | 'NO_APPROVAL'>('MANAGER', { nonNullable: true }),
    noticeDays: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    allowHalfDay: new FormControl(true, { nonNullable: true }),
    requireSupportingDocuments: new FormControl(true, { nonNullable: true }),
    allowEmployeeSpecificSettings: new FormControl(true, { nonNullable: true }),
    effectiveFrom: new FormControl<Date | null>(null, Validators.required),
    effectiveTo: new FormControl<Date | null>(null)
  });
  submitting = false;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      if (this.id) {
        this.getLeavePolicy(this.id);
      } else {
        console.error("🚨 No ID found in route!");
      }
    });
  }

  getLeavePolicy(id: any){
    console.log(id)
    this.apiService.getLeavePolicy(id).subscribe({
      next: (response) => {
        this.leavePolicy = response.data;
        console.log("this.leavePolicy", this.leavePolicy)
        if (this.leavePolicy) {
          this.patchLeaveForm(this.leavePolicy);
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

  goBack() { 
    return this.router.navigate(['/settings/leave-settings/overview'])
  }

  get showMaximumCarryForward(): boolean {
    return this.form.controls.carryForwardPolicy.value === 'LIMITED';
  }

  get isServiceBasedEntitlement(): boolean {
    return this.form.controls.entitlementCalculationMethod.value === 'SERVICE';
  }

  get serviceEntitlementTiers(): FormArray<ServiceEntitlementTierForm> {
    return this.form.controls.serviceEntitlementTiers;
  }

  onAllowEmployeeSpecificSettingsChange(enabled: boolean): void {
    this.form.controls.allowEmployeeSpecificSettings.setValue(enabled);
  }

  addServiceEntitlementTier(): void {
    const previousTier = this.serviceEntitlementTiers.at(this.serviceEntitlementTiers.length - 1);
    this.serviceEntitlementTiers.push(this.createServiceEntitlementTier(previousTier.controls.serviceTo.value));
    this.updateServiceToValidators();
  }

  removeServiceEntitlementTier(index: number): void {
    if (this.serviceEntitlementTiers.length > 1) {
      this.serviceEntitlementTiers.removeAt(index);
      this.updateServiceToValidators();
    }
  }


  private patchLeaveForm(policy: LeavePolicy): void {
    const tiers = policy.serviceEntitlementTiers ?? [];
    this.form.patchValue({
      code: policy.code,
      name: policy.name,
      description: policy.description,
      status: policy.active ? 'ACTIVE' : 'INACTIVE',
      entitlementUnit: policy.entitlementUnit,
      paid: policy.paid,
      entitlementCalculationMethod: policy.entitlementCalculationMethod,
      defaultEntitlement: this.toNumber(policy.defaultEntitlement),
      entitlementGrantMethod: policy.entitlementGrantMethod,
      eligibility: policy.eligibility,
      leaveYear: policy.leaveYear,
      carryForwardPolicy: policy.carryForwardPolicy,
      maximumCarryForward: this.toNumber(policy.maximumCarryForward),
      approval: this.getApprovalValue(policy),
      noticeDays: policy.noticeDays ?? policy.minimumAdvanceNotice,
      allowHalfDay: policy.allowHalfDay,
      requireSupportingDocuments: policy.requireSupportingDocuments,
      allowEmployeeSpecificSettings: policy.allowEmployeeSpecificSettings,
      effectiveFrom: this.parseDate(policy.effectiveFrom),
      effectiveTo: this.parseDate(policy.effectiveTo)
    }, { emitEvent: false });

    this.serviceEntitlementTiers.clear({ emitEvent: false });
    const initialTiers: LeaveServiceEntitlementTier[] = tiers.length
      ? tiers
      : [{ serviceFrom: 0, serviceTo: null, daysPerYear: null }];
    initialTiers.forEach(tier => this.serviceEntitlementTiers.push(
      this.createServiceEntitlementTier(tier.serviceFrom, tier)
    ));

    this.updateEntitlementValidation(policy.entitlementCalculationMethod);
    this.updateMaximumCarryForwardValidation(policy.carryForwardPolicy);
    this.updateServiceToValidators();
  }

  private getApprovalValue(policy: LeavePolicy): 'MANAGER' | 'MANAGER_HR' | 'HR_ONLY' | 'NO_APPROVAL' {
    const rawApproval = (policy as LeavePolicy & { approval?: unknown }).approval;
    const approvalRecord = rawApproval && typeof rawApproval === 'object'
      ? rawApproval as unknown as Record<string, unknown>
      : null;
    const candidates = [
      rawApproval,
      approvalRecord?.['value'],
      approvalRecord?.['code'],
      approvalRecord?.['approval'],
      approvalRecord?.['overflow'],
      approvalRecord?.['approver'],
      policy.approvalOverflow
    ];
    const allowedValues = ['MANAGER', 'MANAGER_HR', 'HR_ONLY', 'NO_APPROVAL'] as const;

    for (const candidate of candidates) {
      if (typeof candidate !== 'string') continue;
      const normalized = candidate.trim().toUpperCase();
      if (allowedValues.includes(normalized as typeof allowedValues[number])) {
        return normalized as typeof allowedValues[number];
      }
    }

    return 'MANAGER';
  }

  private parseDate(value: string | null): Date | null {
    if (!value) return null;
    const date = new Date(`${value.slice(0, 10)}T00:00:00`);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  private toNumber(value: unknown): number | null {
    if (value === null || value === undefined || value === '') return null;
    const parsed = typeof value === 'number' ? value : Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  private createServiceEntitlementTier(
    serviceFrom: number | null = 0,
    tier?: LeaveServiceEntitlementTier
  ): ServiceEntitlementTierForm {
    return new FormGroup({
      serviceFrom: new FormControl<number | null>(serviceFrom, [Validators.required, Validators.min(0)]),
      serviceTo: new FormControl<number | null>(tier?.serviceTo ?? null, [Validators.min(0)]),
      daysPerYear: new FormControl<number | null>(tier?.daysPerYear ?? null, [Validators.required, Validators.min(0)])
    });
  }

  private updateServiceToValidators(): void {
    this.serviceEntitlementTiers.controls.forEach((tier, index) => {
      tier.controls.serviceTo.setValidators(
        index < this.serviceEntitlementTiers.length - 1
          ? [Validators.required, Validators.min(0)]
          : [Validators.min(0)]
      );
      tier.controls.serviceTo.updateValueAndValidity({ emitEvent: false });
    });
  }

  private updateEntitlementValidation(method: 'FIXED' | 'SERVICE'): void {
    const defaultEntitlement = this.form.controls.defaultEntitlement;
    const serviceEntitlementTiers = this.form.controls.serviceEntitlementTiers;

    if (method === 'SERVICE') {
      defaultEntitlement.reset(null, { emitEvent: false });
      defaultEntitlement.clearValidators();
      defaultEntitlement.disable({ emitEvent: false });
      serviceEntitlementTiers.enable({ emitEvent: false });
    } else {
      serviceEntitlementTiers.disable({ emitEvent: false });
      defaultEntitlement.enable({ emitEvent: false });
      defaultEntitlement.setValidators([Validators.required, Validators.min(0)]);
    }

    defaultEntitlement.updateValueAndValidity({ emitEvent: false });
    serviceEntitlementTiers.updateValueAndValidity({ emitEvent: false });
  }

  private updateMaximumCarryForwardValidation(policy: 'NONE' | 'LIMITED' | 'UNLIMITED' | 'HR_REVIEW'): void {
    const maximumCarryForward = this.form.controls.maximumCarryForward;
    if (policy === 'LIMITED') {
      maximumCarryForward.enable({ emitEvent: false });
      maximumCarryForward.setValidators([Validators.required, Validators.min(0)]);
    } else {
      maximumCarryForward.reset(null, { emitEvent: false });
      maximumCarryForward.clearValidators();
      maximumCarryForward.disable({ emitEvent: false });
    }
    maximumCarryForward.updateValueAndValidity({ emitEvent: false });
  }

  formatDate(date: Date | string | null): string | null {
    if (!date) return null;

    const parsedDate = date instanceof Date ? date : new Date(date);
    if (isNaN(parsedDate.getTime())) return null;
    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
    const day = String(parsedDate.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  onSubmit(form: FormGroup) {
    this.submitting = true;
    if (form.invalid || !this.leavePolicy) {
      form.markAllAsTouched();
      this.submitting = false;
      return;
    }

    const value = form.getRawValue();
    const data = {
      ...value,
      defaultEntitlement: value.entitlementCalculationMethod === 'FIXED' ? value.defaultEntitlement : null,
      serviceEntitlementTiers: value.entitlementCalculationMethod === 'SERVICE' ? value.serviceEntitlementTiers : [],
      maximumCarryForward: value.carryForwardPolicy === 'LIMITED' ? value.maximumCarryForward : null,
      effectiveFrom: this.formatDate(value.effectiveFrom),
      effectiveTo: this.formatDate(value.effectiveTo)
    };

    console.log("data", data)
    delete data.status;
    this.apiService.updateLeavePolicy(this.id, data).subscribe({
      next: (response) => {
        console.log("response", response);

        this.toastService.show({
          title: "Success",
          message: "Leave policy has been updated.",
          icon: 'success'
        });

        this.formDirective.resetForm();
        this.submitting = false;
        setTimeout(() => {
          this.router.navigate(['/settings/leave-settings/overview']);
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

  updateStatus(leavePolicy: any){
    const isActive = leavePolicy.active
    const action = isActive ? 'deactivated' : 'activated';
    const actionLabel = isActive ? 'Deactivate' : 'Activate';


     this.alertService.show({
      title: `${actionLabel} Leave Policies`,
      content: `Are you sure you want to ${actionLabel.toLowerCase()} this leave policies?`,
      approveLabel: 'Continue',
      rejectLabel: 'Cancel',
      onApprove: () => {
        this.apiService.updateLeavePolicyStatus(leavePolicy.id).subscribe({
          next: (response) => {
            this.leavePolicy = response.data;
            this.cdr.markForCheck();
           this.toastService.show({
              title: "Success",
              message: `Leave policy has been ${action}.`,
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

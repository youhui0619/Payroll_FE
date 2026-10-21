import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MaterialImports, MaterialProviders } from '../../../../shared/material-imports';
import { leavePolicies } from '../../../../data/leave-policies';
import type { LeavePolicy, LeaveServiceEntitlementTier } from '../../../../models/leave-policy.model';

type ServiceEntitlementTierForm = FormGroup<{
  serviceFrom: FormControl<number | null>;
  serviceTo: FormControl<number | null>;
  daysPerYear: FormControl<number | null>;
}>;

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [...MaterialImports, CommonModule, ReactiveFormsModule, RouterLink],
  providers: [...MaterialProviders],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent implements OnInit {
  readonly leavePolicies = leavePolicies;
  leavePolicy: LeavePolicy | undefined;

  readonly leaveForm = new FormGroup({
    leaveCode: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    leaveName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl('', { nonNullable: true }),
    status: new FormControl<'ACTIVE' | 'INACTIVE'>('ACTIVE', { nonNullable: true }),
    entitlementUnit: new FormControl<'DAILY' | 'HOURLY'>('DAILY', { nonNullable: true, validators: [Validators.required] }),
    leaveType: new FormControl<'PAID' | 'UNPAID'>('PAID', { nonNullable: true, validators: [Validators.required] }),
    entitlementCalculationMethod: new FormControl<'FIXED' | 'SERVICE'>('FIXED', { nonNullable: true }),
    defaultEntitlement: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    serviceEntitlementTiers: new FormArray<ServiceEntitlementTierForm>([this.createServiceEntitlementTier(0)]),
    entitlementGrantMethod: new FormControl<'ANNUAL' | 'MONTHLY_ACCRUAL' | 'SERVICE_ANNIVERSARY' | 'MANUAL'>('ANNUAL', { nonNullable: true }),
    eligibility: new FormControl<'ALL_EMPLOYEES' | 'PERMANENT' | 'PROBATION' | 'PART_TIME' | 'CONTRACT_WORKER' | 'INTERN'>('ALL_EMPLOYEES', { nonNullable: true }),
    leaveYear: new FormControl<'CALENDAR' | 'EMPLOYMENT_ANNIVERSARY' | 'FINANCIAL'>('CALENDAR', { nonNullable: true }),
    carryForwardPolicy: new FormControl<'NONE' | 'LIMITED' | 'UNLIMITED' | 'HR_REVIEW'>('NONE', { nonNullable: true }),
    maximumCarryForward: new FormControl<number | null>({ value: null, disabled: true }),
    approvalOverflow: new FormControl<'MANAGER' | 'MANAGER_HR' | 'HR_ONLY' | 'NO_APPROVAL'>('MANAGER', { nonNullable: true }),
    minimumAdvanceNotice: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    allowHalfDay: new FormControl(true, { nonNullable: true }),
    requireSupportingDocuments: new FormControl(true, { nonNullable: true })
  });

  submitted = false;

  constructor(private readonly route: ActivatedRoute, private readonly router: Router, private readonly destroyRef: DestroyRef) {
    this.leaveForm.controls.serviceEntitlementTiers.disable({ emitEvent: false });
    this.leaveForm.controls.carryForwardPolicy.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(policy => this.updateMaximumCarryForwardValidation(policy));
    this.leaveForm.controls.entitlementCalculationMethod.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(method => this.updateEntitlementValidation(method));
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      const leaveCode = params.get('leaveCode');
      this.leavePolicy = this.leavePolicies.find(policy => policy.leaveCode === leaveCode);

      if (!this.leavePolicy) {
        void this.router.navigateByUrl('/settings/leave-settings/overview');
        return;
      }

      this.patchLeaveForm(this.leavePolicy);
    });
  }

  get showMaximumCarryForward(): boolean {
    return this.leaveForm.controls.carryForwardPolicy.value === 'LIMITED';
  }

  get isServiceBasedEntitlement(): boolean {
    return this.leaveForm.controls.entitlementCalculationMethod.value === 'SERVICE';
  }

  get serviceEntitlementTiers(): FormArray<ServiceEntitlementTierForm> {
    return this.leaveForm.controls.serviceEntitlementTiers;
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

  onSubmit(): void {
    this.submitted = true;
    if (this.leaveForm.invalid || !this.leavePolicy) {
      this.leaveForm.markAllAsTouched();
      return;
    }

    const value = this.leaveForm.getRawValue();
    const updatedPolicy: LeavePolicy = {
      ...value,
      defaultEntitlement: value.entitlementCalculationMethod === 'FIXED' ? value.defaultEntitlement : null,
      serviceEntitlementTiers: value.entitlementCalculationMethod === 'SERVICE' ? value.serviceEntitlementTiers : [],
      maximumCarryForward: value.carryForwardPolicy === 'LIMITED' ? value.maximumCarryForward : null
    };
    const policyIndex = this.leavePolicies.findIndex(policy => policy.leaveCode === this.leavePolicy?.leaveCode);
    if (policyIndex < 0) return;

    this.leavePolicies[policyIndex] = updatedPolicy;
    this.leavePolicy = updatedPolicy;
    void this.router.navigateByUrl('/settings/leave-settings/overview');
  }

  private patchLeaveForm(policy: LeavePolicy): void {
    const { serviceEntitlementTiers, ...policyFields } = policy;
    this.leaveForm.patchValue(policyFields, { emitEvent: false });

    this.serviceEntitlementTiers.clear({ emitEvent: false });
    const tiers: LeaveServiceEntitlementTier[] = serviceEntitlementTiers.length
      ? serviceEntitlementTiers
      : [{ serviceFrom: 0, serviceTo: null, daysPerYear: null }];
    tiers.forEach(tier => this.serviceEntitlementTiers.push(this.createServiceEntitlementTier(tier.serviceFrom, tier)));

    this.updateEntitlementValidation(policy.entitlementCalculationMethod);
    this.updateMaximumCarryForwardValidation(policy.carryForwardPolicy);
    this.updateServiceToValidators();
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
    const defaultEntitlement = this.leaveForm.controls.defaultEntitlement;
    const serviceEntitlementTiers = this.leaveForm.controls.serviceEntitlementTiers;

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
    const maximumCarryForward = this.leaveForm.controls.maximumCarryForward;
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
}

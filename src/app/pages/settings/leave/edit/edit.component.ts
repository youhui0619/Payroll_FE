
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MaterialImports, MaterialProviders } from '../../../../shared/material-imports';
import { leavePolicies } from '../../../../data/leave/leave-policies.data';
import type { LeavePolicy, LeaveServiceEntitlementTier } from '../../../../models/leave/leave-policy.model';

type ServiceEntitlementTierForm = FormGroup<{
  serviceFrom: FormControl<number | null>;
  serviceTo: FormControl<number | null>;
  daysPerYear: FormControl<number | null>;
}>;

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [...MaterialImports, ReactiveFormsModule, RouterLink],
  providers: [...MaterialProviders],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent implements OnInit {
  readonly leavePolicies = leavePolicies;
  leavePolicy: LeavePolicy | undefined;

  form = new FormGroup({
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
    requireSupportingDocuments: new FormControl(true, { nonNullable: true }),
    allowEmployeeSpecificSettings: new FormControl(true, { nonNullable: true })
  });

  submitting = false;

  constructor(
    private route: ActivatedRoute, 
    private router: Router, 
  ) {
    this.form.controls.serviceEntitlementTiers.disable({ emitEvent: false });
    this.form.controls.carryForwardPolicy.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(policy => this.updateMaximumCarryForwardValidation(policy));
    this.form.controls.entitlementCalculationMethod.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(method => this.updateEntitlementValidation(method));
  }

  ngOnInit() {
    this.getLeavePolicy()
  }
  
  getLeavePolicy(){
    this.leavePolicy = leavePolicies.find(item => item.leaveCode === this.route.snapshot.paramMap.get('leaveCode'));
    console.log("this.claimType", this.leavePolicy)
    if(this.leavePolicy){
      this.form.patchValue(this.leavePolicy)
    }
  }

  goBack() { 
    return this.router.navigate(['/settings/claim-settings/overview'])
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
    const { serviceEntitlementTiers, ...policyFields } = policy;
    this.form.patchValue(policyFields, { emitEvent: false });

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

  onSubmit(form: FormGroup) {
    this.submitting = true;
    if (form.invalid || !this.leavePolicy) {
      form.markAllAsTouched();
      return;
    }

    const value = form.getRawValue();
    const data = {
      ...value,
      defaultEntitlement: value.entitlementCalculationMethod === 'FIXED' ? value.defaultEntitlement : null,
      serviceEntitlementTiers: value.entitlementCalculationMethod === 'SERVICE' ? value.serviceEntitlementTiers : [],
      maximumCarryForward: value.carryForwardPolicy === 'LIMITED' ? value.maximumCarryForward : null
    };
    console.log("data", data)
    return this.goBack()
  }
}

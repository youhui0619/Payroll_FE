import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
  readonly leaveForm = new FormGroup({
    status: new FormControl('ACTIVE', { nonNullable: true }),
    carryForwardPolicy: new FormControl<'NONE' | 'LIMITED' | 'UNLIMITED' | 'HR_REVIEW'>('NONE', { nonNullable: true }),
    maximumCarryForward: new FormControl<number | null>({ value: null, disabled: true })
  });

  constructor() {
    this.leaveForm.controls.carryForwardPolicy.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(policy => this.updateMaximumCarryForwardValidation(policy));
  }

  get showMaximumCarryForward(): boolean {
    return this.leaveForm.controls.carryForwardPolicy.value === 'LIMITED';
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

  onSubmit(): void {
    this.leaveForm.markAllAsTouched();
}
}

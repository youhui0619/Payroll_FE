
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MaterialImports, MaterialProviders } from '../../../../shared/material-imports';
import { claimTypes } from '../../../../data/claim-types';
import type { ClaimTypeSetting, ClaimTypeSettingStatus } from '../../../../models/claim-setting.model';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [...MaterialImports, ReactiveFormsModule, RouterLink],
  providers: [...MaterialProviders],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent {
  readonly claimForm = new FormGroup({
    code: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(20), Validators.pattern(/^[A-Za-z][A-Za-z0-9_-]*$/)]
    }),
    name: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(60)] }),
    description: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(250)] }),
    status: new FormControl<ClaimTypeSettingStatus>('ACTIVE', { nonNullable: true })
  });
  submitted = false;

  constructor(private readonly router: Router) {}

  onSubmit(): void {
    this.submitted = true;
    const codeControl = this.claimForm.controls.code;
    const normalizedCode = codeControl.value.trim().toUpperCase();
    codeControl.setValue(normalizedCode, { emitEvent: false });

    const duplicateCode = claimTypes.some(item => item.code.toUpperCase() === normalizedCode);
    if (duplicateCode) {
      codeControl.setErrors({ ...codeControl.errors, duplicate: true });
    }

    if (this.claimForm.invalid) {
      this.claimForm.markAllAsTouched();
      return;
    }

    const value = this.claimForm.getRawValue();
    const newClaimType: ClaimTypeSetting = {
      code: normalizedCode,
      name: value.name.trim(),
      description: value.description.trim(),
      status: value.status
    };
    claimTypes.push(newClaimType);
    void this.router.navigateByUrl('/settings/claim-settings/overview');
  }
}

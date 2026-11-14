
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MaterialImports, MaterialProviders } from '../../../../shared/material-imports';
import { claimTypes } from '../../../../data/claims/claim-types.data';
import type { ClaimTypeSetting, ClaimTypeSettingStatus } from '../../../../models/claims/claim-setting.model';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [...MaterialImports, ReactiveFormsModule, RouterLink],
  providers: [...MaterialProviders],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent {
  constructor(
    private router: Router,
  ) {}

  form = new FormGroup({
    code: new FormControl('', { nonNullable: true,validators: [Validators.required]}),
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl(''),
    status: new FormControl<ClaimTypeSettingStatus>('ACTIVE', { nonNullable: true })
  });
  submitting = false;

  goBack() { 
    return this.router.navigate(['/settings/claim-settings/overview'])
  }

  onSubmit(form: FormGroup) {
    if (form.invalid) {
      form.markAllAsTouched();
      return;
    }

    const value = form.getRawValue();
    const data: ClaimTypeSetting = {
      code: value.code.trim(),
      name: value.name.trim(),
      description: value.description.trim(),
      status: value.status
    };

    console.log("data", data)
    this.submitting = false;
    return this.goBack()
  }
}


import { Component, DestroyRef, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MaterialImports, MaterialProviders } from '../../../../shared/material-imports';
import { claimTypes } from '../../../../data/claim-types';
import type { ClaimTypeSetting, ClaimTypeSettingStatus } from '../../../../models/claim-setting.model';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [...MaterialImports, ReactiveFormsModule, RouterLink],
  providers: [...MaterialProviders],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent implements OnInit {
  claimType: ClaimTypeSetting | undefined;
  submitted = false;

  readonly claimForm = new FormGroup({
    code: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    name: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(60)] }),
    description: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(250)] }),
    status: new FormControl<ClaimTypeSettingStatus>('ACTIVE', { nonNullable: true })
  });

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly destroyRef: DestroyRef
  ) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      const claimCode = params.get('claimCode');
      this.claimType = claimTypes.find(item => item.code === claimCode);

      if (!this.claimType) {
        void this.router.navigateByUrl('/settings/claim-settings/overview');
        return;
      }

      this.submitted = false;
      this.claimForm.reset({
        code: this.claimType.code,
        name: this.claimType.name,
        description: this.claimType.description,
        status: this.claimType.status
      });
    });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.claimForm.invalid || !this.claimType) {
      this.claimForm.markAllAsTouched();
      return;
    }

    const value = this.claimForm.getRawValue();
    const updatedClaimType: ClaimTypeSetting = {
      code: this.claimType.code,
      name: value.name.trim(),
      description: value.description.trim(),
      status: value.status
    };
    const index = claimTypes.findIndex(item => item.code === this.claimType?.code);
    if (index < 0) return;

    claimTypes[index] = updatedClaimType;
    this.claimType = updatedClaimType;
    void this.router.navigateByUrl('/settings/claim-settings/overview');
  }
}

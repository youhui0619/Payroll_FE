
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MaterialImports, MaterialProviders } from '../../../../shared/material-imports';
import { claimTypes } from '../../../../data/claims/claim-types.data';
import type { ClaimTypeSetting, ClaimTypeSettingStatus } from '../../../../models/claims/claim-setting.model';
import { ToastService } from '../../../../shared/components/toast/toast.service';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [...MaterialImports, ReactiveFormsModule, RouterLink],
  providers: [...MaterialProviders],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent implements OnInit {

  constructor(
    private toastService: ToastService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  claimType: ClaimTypeSetting | undefined;
  form = new FormGroup({
    code: new FormControl('', { nonNullable: true,validators: [Validators.required]}),
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl(''),
    status: new FormControl<ClaimTypeSettingStatus>('ACTIVE', { nonNullable: true })
  });
  submitting = false;

  ngOnInit() {
    this.getClaimType()
  }
  
  getClaimType(){
    this.claimType = claimTypes.find(item => item.code === this.route.snapshot.paramMap.get('claimCode'));
    console.log("this.claimType", this.claimType)
    if(this.claimType){
      this.form.patchValue(this.claimType)
    }
  }

  goBack() { 
    return this.router.navigate(['/settings/claim-settings/overview'])
   }

  onSubmit(form: FormGroup) {
    if (!this.claimType) return;
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

    return this.goBack();
  }
}

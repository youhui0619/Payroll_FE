
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialImports, MaterialProviders } from '../../../../shared/material-imports';
import type { ClaimType } from '../../../../models/claims/claim-type.model';
import { ToastService } from '../../../../shared/components/toast/toast.service';
import { ClaimTypeApiService } from '../../../../services/api/claim-type.service';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [...MaterialImports, ReactiveFormsModule],
  providers: [...MaterialProviders, ClaimTypeApiService],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent implements OnInit {

  constructor(
    private toastService: ToastService,
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ClaimTypeApiService,
  ) {}

  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;

  claimType: ClaimType | null = null;
  id: any = '';
  form = new FormGroup({
    code: new FormControl('', { nonNullable: true,validators: [Validators.required]}),
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl(''),
    active: new FormControl<boolean>(true, { nonNullable: true }),
    receiptRequired: new FormControl<boolean>(true, { nonNullable: true }),
    maxAmount: new FormControl(''),
    effectiveFrom: new FormControl<Date | null>(null, Validators.required),
    effectiveTo: new FormControl<Date | null>(null)
  });
  submitting = false;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      if (this.id) {
        this.getPublicHoliday(this.id);
      } else {
        console.error("🚨 No ID found in route!");
      }
    });  
  }

  getPublicHoliday(id: any){
    console.log(id)
    this.apiService.getClaimType(id).subscribe({
      next: (response) => {
        this.claimType = response.data;
        console.log("claimType:", this.claimType);
        if(this.claimType){
          this.form.patchValue(this.claimType)
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
    return this.router.navigate(['/settings/claim-settings/overview'])
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
    if (form.invalid) {
      form.markAllAsTouched();
      return;
    }

    const value = form.value;
    const data: ClaimType = {
      ...value,
      maxAmount: value.maxAmount.toString(),
      effectiveFrom: this.formatDate(value.effectiveFrom),
      effectiveTo: this.formatDate(value.effectiveTo) || null
    };
    console.log("data", data)
    this.submitting = false;
    this.apiService.updateClaimType(this.id, data).subscribe({
      next: (response) => {
        console.log("response", response);

        this.toastService.show({
          title: "Success",
          message: "Claim type has been updated.",
          icon: 'success'
        });

        this.formDirective.resetForm();
        this.submitting = false;
        setTimeout(() => {
          this.router.navigate(['/settings/claim-settings/overview']);
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
}

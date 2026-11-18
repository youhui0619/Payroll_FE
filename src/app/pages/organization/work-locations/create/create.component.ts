import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialImports, MaterialProviders } from '../../../../shared/material-imports';
import { NavigationService } from '../../../../services/navigation.service';
import { ToastService } from '../../../../shared/components/toast/toast.service';
import { WorkLocationApiService } from '../../../../services/api/work-location.service';

@Component({
  selector: 'app-work-location-create',
  standalone: true,
  imports: [...MaterialImports, ReactiveFormsModule],
  providers: [...MaterialProviders, WorkLocationApiService],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent {
  constructor(
    private router: Router,
    private apiService: WorkLocationApiService,
    private toastService: ToastService
  ) {}
  
  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;
  form = new FormGroup({
    code: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    type: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    remark: new FormControl(''),
    addressLine1: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    addressLine2: new FormControl(''),
    city: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    postcode: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    state: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    country: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });
  submitting: boolean = false;

  goBack() {
    return this.router.navigate(['/organization/work-locations/overview'])
  }

  onSubmit(form: FormGroup) {
    if (form.invalid) {
      form.markAllAsTouched();
      return;
    }

    this.submitting = true;

    const data = form.value;
    console.log("Data", data);

    this.apiService.createWorkLocation(data).subscribe({
      next: (response) => {
        console.log("response", response);

        this.toastService.show({
          title: "Success",
          message: "Work location has been created.",
          icon: 'success'
        });

        this.formDirective.resetForm();
        this.submitting = false;
        setTimeout(() => {
          this.router.navigate(['/organization/work-locations/overview']);
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

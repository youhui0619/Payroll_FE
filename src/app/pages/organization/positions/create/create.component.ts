import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialImports, MaterialProviders } from '../../../../shared/material-imports';
import { departments as departmentData } from '../../../../data/workforce/departments.data';
import { ToastService } from '../../../../shared/components/toast/toast.service';
import { Router } from '@angular/router';
import { PositionsApiService } from '../../../../services/api/positions.service';
import { Position } from '../../../../models/workforce/position.model';

@Component({
  selector: 'app-create',
  imports: [...MaterialImports, ReactiveFormsModule],
  providers: [...MaterialProviders, PositionsApiService],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent {

  constructor(
    private router: Router,
    private apiService: PositionsApiService,
    private toastService: ToastService
  ) {}
  
  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;
  readonly departments = departmentData;
  form = new FormGroup({
    code: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    title: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    jobLevel: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl(''),
    departmentId: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    reportsTo: new FormControl(''),
    effectiveFrom: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    effectiveTo: new FormControl(''),
  });
  submitting: boolean = false;

  goBack() {
    return this.router.navigate(['/organization/positions/overview'])
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
    if (form.invalid) {
      form.markAllAsTouched();
      return;
    }

    this.submitting = true;

    const value = form.value;
    const data = {
      ...value,
      status: "ACTIVE",
      effectiveFrom: this.formatDate(value.effectiveFrom),
      effectiveTo: this.formatDate(value.effectiveTo) || null
    }
    console.log("Data", data);

    this.apiService.createPosition(data).subscribe({
      next: (response) => {
        console.log("response", response);

        this.toastService.show({
          title: "Success",
          message: "Position has been created.",
          icon: 'success'
        });

        this.formDirective.resetForm();
        this.submitting = false;
        setTimeout(() => {
          this.router.navigate(['/organization/positions/overview']);
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

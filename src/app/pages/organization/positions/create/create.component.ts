import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialImports, MaterialProviders } from '../../../../shared/material-imports';
import { ToastService } from '../../../../shared/components/toast/toast.service';
import { Router } from '@angular/router';
import { PositionsApiService } from '../../../../services/api/positions.service';
import type { Department } from '../../../../models/workforce/department.model';
import { DepartmentsApiService } from '../../../../services/api/departments.service';

@Component({
  selector: 'app-create',
  imports: [...MaterialImports, ReactiveFormsModule],
  providers: [...MaterialProviders, PositionsApiService, DepartmentsApiService],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent {

  constructor(
    private router: Router,
    private positionApiService: PositionsApiService,
    private departmentApiService: DepartmentsApiService,
    private toastService: ToastService
  ) {}
  
  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;
  departmentList: Department[] = [];
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


  ngOnInit() {
    this.getDepartmentList()
  }

  getDepartmentList(){
    this.departmentApiService.getAllDepartments(null).subscribe({
      next: (response) => {
        const departments: Department[] = response?.data ?? [];
        this.departmentList = departments.filter(department => department.active);
        console.log("departmentList:", this.departmentList);
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
      effectiveFrom: this.formatDate(value.effectiveFrom),
      effectiveTo: this.formatDate(value.effectiveTo) || null
    }
    console.log("Data", data);

    this.positionApiService.createPosition(data).subscribe({
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

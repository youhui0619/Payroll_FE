import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';import { MaterialImports, MaterialProviders } from '../../../../shared/material-imports';
import { ToastService } from '../../../../shared/components/toast/toast.service';
import { DepartmentsApiService } from '../../../../services/api/departments.service';
import { Department } from '../../../../models/workforce/department.model';
import { AlertService } from '../../../../shared/components/alert/alert.service';

@Component({
  selector: 'app-edit',
  imports: [...MaterialImports, ReactiveFormsModule],
  providers: [...MaterialProviders, DepartmentsApiService],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private apiService: DepartmentsApiService,
    private toastService: ToastService,
      private alertService: AlertService,
  ) {}
  
  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;
  
  department: Department | null = null;
  id: any = '';
  form = new FormGroup({
    code: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl(''),
    parentDepartmentId: new FormControl(''),
    headOfDepartmentId: new FormControl(''),
    effectiveFrom: new FormControl(''),
    effectiveTo: new FormControl(''),
  });
  submitting: boolean = false;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      if (this.id) {
        this.getWorkLocation(this.id);
      } else {
        console.error("🚨 No ID found in route!");
      }
    });  
  }

  getWorkLocation(id: any){
    console.log(id)
    this.apiService.getDepartment(id).subscribe({
      next: (response) => {
        this.department = response.data;
        console.log("department:", this.department);
        if(this.department){
          this.form.patchValue(this.department)
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
    return this.router.navigate(['/organization/work-locations/overview'])
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

    this.apiService.updateDepartment(this.id, data).subscribe({
      next: (response) => {
        console.log("response", response);

        this.toastService.show({
          title: "Success",
          message: "Department has been created.",
          icon: 'success'
        });

        this.formDirective.resetForm();
        this.submitting = false;
        setTimeout(() => {
          this.router.navigate(['/organization/departments/overview']);
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


  deactivate(id: any){
     this.alertService.show({
      title: 'Payroll Report',
      content: 'The payroll report is ready to review.',
      approveLabel: 'Continue',
      rejectLabel: 'Cancel',
      onApprove: () => {
        this.apiService.updateDepartmentStatus(id).subscribe({
          next: (response) => {
           this.toastService.show({
              title: "Success",
              message: "Department has been deactivated.",
              icon: 'success'
            });
            setTimeout(()=>{
              this.alertService.close()
            }, 1000)
          },
          error: (error) => {
            this.toastService.show({
              title: error.error.code,
              message: error.error.message,
              icon: 'danger'
            });
          },
        });
       },
      onReject: () => {
          this.alertService.close()
       }
    });
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialImports, MaterialProviders } from '../../../../shared/material-imports';
import type { WorkLocation } from '../../../../models/workforce/work-location.model';
import { ToastService } from '../../../../shared/components/toast/toast.service';
import { WorkLocationApiService } from '../../../../services/api/work-location.service';
import { AlertService } from '../../../../shared/components/alert/alert.service';

@Component({
  selector: 'app-work-location-edit',
  standalone: true,
  imports: [...MaterialImports, ReactiveFormsModule],
  providers: [...MaterialProviders, WorkLocationApiService],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent implements OnInit {
  constructor(
    private toastService: ToastService,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    private apiService: WorkLocationApiService,
  ) {}

  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;
  
  workLocation: WorkLocation | null = null;
  id: any = '';
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
    country: new FormControl('', { nonNullable: true, validators: [Validators.required] })
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
    this.apiService.getWorkLocation(id).subscribe({
      next: (response) => {
        this.workLocation = response.data;
        console.log("workLocation:", this.workLocation);
        if(this.workLocation){
          this.form.patchValue(this.workLocation)
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

  onSubmit(form: FormGroup) {
    if (form.invalid) {
      form.markAllAsTouched();
      return;
    }

    this.submitting = true;

    const data = form.value;
    console.log("Data", data);

    this.apiService.updateWorkLocation(this.id, data).subscribe({
      next: (response) => {
        console.log("response", response);

        this.toastService.show({
          title: "Success",
          message: "Work location has been updated.",
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

  deactivate(id: any){
     this.alertService.show({
      title: 'Payroll Report',
      content: 'The payroll report is ready to review.',
      approveLabel: 'Continue',
      rejectLabel: 'Cancel',
      onApprove: () => {
        this.apiService.updateWorkLocationStatus(id).subscribe({
          next: (response) => {
           this.toastService.show({
              title: "Success",
              message: "Work location has been deactivated.",
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

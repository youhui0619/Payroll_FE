import { Component, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators, FormGroupDirective } from '@angular/forms';
import { MaterialImports, MaterialProviders } from '../../../../shared/material-imports';
import { ActivatedRoute, Router } from '@angular/router';
import { stateList } from '../../../../data/other/other.data';
import { ToastService } from '../../../../shared/components/toast/toast.service';
import { PublicHolidayApiService } from '../../../../services/api/public-holiday.service';
import { PublicHoliday } from '../../../../models/settings/public-holiday.model';
@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [...MaterialImports, ReactiveFormsModule],
  providers: [...MaterialProviders, PublicHolidayApiService],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent {
  constructor(
    private toastService: ToastService,
    private route: ActivatedRoute,
    private router: Router,
    private apiService: PublicHolidayApiService,
  ) {}

  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;

  stateList: any =stateList
  publicHoliday: PublicHoliday | null = null;
  id: any = '';
  form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    status: new FormControl('ACTIVE', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl('', { nonNullable: true }),
    scope: new FormControl<'NATIONAL' | 'STATE'>('NATIONAL', { nonNullable: true }),
    regions: new FormControl<string[]>([], { nonNullable: true }),
    stateSelections: new FormArray(this.stateList.map(() => new FormControl(false, { nonNullable: true }))),
    startDate: new FormControl<Date | null>(null, Validators.required),
    endDate: new FormControl<Date | null>(null, Validators.required)
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
    this.apiService.getPublicHoliday(id).subscribe({
      next: (response) => {
        this.publicHoliday = response.data;
        console.log("publicHoliday:", this.publicHoliday);
        if(this.publicHoliday){
          // this.form.patchValue(this.publicHoliday)
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
    return this.router.navigate(['/settings/public-holidays/overview'])
  }

  get selectedScope(): 'NATIONAL' | 'STATE' {
    return this.form.controls.scope.value;
  }

  get selectedRegions(): string[] {
    return this.form.controls.regions.value;
  }

  get allStatesSelected(): boolean {
    return this.form.controls.stateSelections.controls.every(control => control.value);
  }

  formatDate(date: Date | null): string | null {
    if (!date) return null;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  syncSelectedRegions() {
    const regions = this.stateList
    .filter((_: { name: string; value: string }, index: number) => this.form.controls.stateSelections.at(index).value)
    .map((state: any) => state.name);
    this.form.controls.regions.setValue(regions);
    this.form.controls.regions.markAsDirty();
  }

  toggleAllStates(checked: boolean): void {
    this.form.controls.stateSelections.controls.forEach(control => control.setValue(checked));
    this.syncSelectedRegions();
  }

  onSubmit(form: FormGroup) {
    this.submitting = true;
    if (this.selectedScope === 'STATE' && this.selectedRegions.length === 0) {
      this.form.controls.regions.markAsTouched();
      return;
    }
    if (form.invalid) {
      form.markAllAsTouched();
      return;
    }
    const { stateSelections, ...value } = form.value;
    const data = {
      ...value,
      scope: 'State',
      startDate: this.formatDate(value.startDate),
      endDate: this.formatDate(value.endDate)
    };
    console.log('data', data);

    this.apiService.updatePublicHoliday(this.id, data).subscribe({
      next: (response) => {
        console.log("response", response);

        this.toastService.show({
          title: "Success",
          message: "Public holiday has been updated.",
          icon: 'success'
        });

        this.formDirective.resetForm();
        this.submitting = false;
        setTimeout(() => {
          this.router.navigate(['/settings/public-holidays/list']);
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

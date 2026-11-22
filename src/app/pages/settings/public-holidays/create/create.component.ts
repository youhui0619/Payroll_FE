import { Component, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators, FormGroupDirective } from '@angular/forms';
import { MaterialImports, MaterialProviders } from '../../../../shared/material-imports';
import { Router } from '@angular/router';
import { stateList } from '../../../../data/other/other.data';
import { ToastService } from '../../../../shared/components/toast/toast.service';
import { PublicHolidayApiService } from '../../../../services/api/public-holiday.service';
@Component({
  selector: 'app-create',
  standalone: true,
  imports: [...MaterialImports, ReactiveFormsModule],
  providers: [...MaterialProviders, PublicHolidayApiService],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent {
  constructor(
    private router: Router,
    private toastService: ToastService,
    private apiService: PublicHolidayApiService,
  ) {}

  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;

  stateList: any =stateList

  form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl('', { nonNullable: true }),
    scope: new FormControl<'NATIONAL' | 'STATE'>('NATIONAL', { nonNullable: true }),
    regions: new FormControl<string[]>([], { nonNullable: true }),
    stateSelections: new FormArray(this.stateList.map(() => new FormControl(false, { nonNullable: true }))),
    startDate: new FormControl<Date | null>(null, Validators.required),
    endDate: new FormControl<Date | null>(null, Validators.required)
  });
  submitting = false;

  goBack() { 
    return this.router.navigate(['/settings/public-holidays/list'])
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

  formatDate(date: Date | string | null): string | null {
    if (!date) return null;

    const parsedDate = date instanceof Date ? date : new Date(date);
    if (isNaN(parsedDate.getTime())) return null;
    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
    const day = String(parsedDate.getDate()).padStart(2, '0');

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
      active: true,
      startDate: this.formatDate(value.startDate),
      endDate: this.formatDate(value.endDate)
    };
    console.log('data', data);

    this.apiService.createPublicHoliday(data).subscribe({
      next: (response) => {
        console.log("response", response);

        this.toastService.show({
          title: "Success",
          message: "Public holiday has been created.",
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

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialImports, MaterialProviders } from '../../../../shared/material-imports';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [...MaterialImports, CommonModule, ReactiveFormsModule],
  providers: [...MaterialProviders],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent {
  states = [
    'Johor', 'Kedah', 'Kelantan', 'Kuala Lumpur', 'Labuan', 'Melaka',
    'Negeri Sembilan', 'Pahang', 'Penang', 'Perak', 'Perlis', 'Putrajaya',
    'Sabah', 'Sarawak', 'Selangor', 'Terengganu'
  ];

  holidayForm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    status: new FormControl('ACTIVE', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl('', { nonNullable: true }),
    scope: new FormControl<'National' | 'State'>('National', { nonNullable: true }),
    regions: new FormControl<string[]>([], { nonNullable: true }),
    stateSelections: new FormArray(this.states.map(() => new FormControl(false, { nonNullable: true }))),
    startDate: new FormControl<Date | null>(null, Validators.required),
    endDate: new FormControl<Date | null>(null, Validators.required)
  });
  submitted = false;

  get selectedScope(): 'National' | 'State' {
    return this.holidayForm.controls.scope.value;
  }

  get selectedRegions(): string[] {
    return this.holidayForm.controls.regions.value;
  }

  get allStatesSelected(): boolean {
    return this.holidayForm.controls.stateSelections.controls.every(control => control.value);
  }

  syncSelectedRegions(): void {
    const regions = this.states.filter((_, index) => this.holidayForm.controls.stateSelections.at(index).value);
    this.holidayForm.controls.regions.setValue(regions);
    this.holidayForm.controls.regions.markAsDirty();
  }

  toggleAllStates(checked: boolean): void {
    this.holidayForm.controls.stateSelections.controls.forEach(control => control.setValue(checked));
    this.syncSelectedRegions();
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.selectedScope === 'State' && this.selectedRegions.length === 0) {
      this.holidayForm.controls.regions.markAsTouched();
      return;
    }
    if (this.holidayForm.invalid) {
      this.holidayForm.markAllAsTouched();
      return;
    }
    const { stateSelections, ...holidayData } = this.holidayForm.getRawValue();
    console.log('form.value', holidayData);
  }
}


import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialImports, MaterialProviders } from '../../../../shared/material-imports';
import { Router } from '@angular/router';
@Component({
  selector: 'app-create',
  standalone: true,
  imports: [...MaterialImports, ReactiveFormsModule],
  providers: [...MaterialProviders],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent {
  constructor(
    private router: Router,
  ) {}

  states = [
    'Johor', 'Kedah', 'Kelantan', 'Kuala Lumpur', 'Labuan', 'Melaka',
    'Negeri Sembilan', 'Pahang', 'Penang', 'Perak', 'Perlis', 'Putrajaya',
    'Sabah', 'Sarawak', 'Selangor', 'Terengganu'
  ];

  form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    status: new FormControl('ACTIVE', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl('', { nonNullable: true }),
    scope: new FormControl<'National' | 'State'>('National', { nonNullable: true }),
    regions: new FormControl<string[]>([], { nonNullable: true }),
    stateSelections: new FormArray(this.states.map(() => new FormControl(false, { nonNullable: true }))),
    startDate: new FormControl<Date | null>(null, Validators.required),
    endDate: new FormControl<Date | null>(null, Validators.required)
  });
  submitting = false;

  goBack() { 
    return this.router.navigate(['/settings/public-holidays/overview'])
  }

  get selectedScope(): 'National' | 'State' {
    return this.form.controls.scope.value;
  }

  get selectedRegions(): string[] {
    return this.form.controls.regions.value;
  }

  get allStatesSelected(): boolean {
    return this.form.controls.stateSelections.controls.every(control => control.value);
  }

  syncSelectedRegions(): void {
    const regions = this.states.filter((_, index) => this.form.controls.stateSelections.at(index).value);
    this.form.controls.regions.setValue(regions);
    this.form.controls.regions.markAsDirty();
  }

  toggleAllStates(checked: boolean): void {
    this.form.controls.stateSelections.controls.forEach(control => control.setValue(checked));
    this.syncSelectedRegions();
  }

  onSubmit(form: FormGroup) {
    this.submitting = true;
    if (this.selectedScope === 'State' && this.selectedRegions.length === 0) {
      this.form.controls.regions.markAsTouched();
      return;
    }
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { stateSelections, ...value } = form.getRawValue();
    const data = value
    console.log('data', data);
  }
}

import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialImports, MaterialProviders } from '../../../../shared/material-imports';
import { departments as departmentData } from '../../../../data/workforce/departments.data';

@Component({
  selector: 'app-create',
  imports: [...MaterialImports, ReactiveFormsModule],
  providers: [...MaterialProviders],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent {
  readonly departments = departmentData;

  form = new FormGroup({
    code: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    title: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    jobLevel: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl(''),
    departmentId: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    reportsTo: new FormControl(''),
    effectiveFrom: new FormControl(''),
    effectiveTo: new FormControl(''),
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    console.log('form.value', this.form.value);
  }
}

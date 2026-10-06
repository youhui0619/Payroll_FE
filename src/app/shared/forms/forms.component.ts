import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { MaterialImports, MaterialProviders } from '../material-imports';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { DropzoneComponent } from '../dropzone/dropzone.component';


export interface FormFieldConfig {
  name: string;
  type: string;
  required?: boolean;
  validation?: boolean;
  formControlName: string;
  disabled?: boolean;
  options?: Array<{ value: string; label: string }>;
  errorMessage?: string;
  placeholder: string;
  size: string;
  surfix?: string;
  prefix?: string;
  isMultipleFiles?: boolean;
  accept?: string;
  headline?: string;
  description?: string;
}

export interface FormConfig {
  section: string;
  ordering: Number;
  fields: FormFieldConfig[];
}

export function createFormGroupFromFields(sections: FormConfig[]): FormGroup {
  const controls: Record<string, FormControl<any>> = {};

  for (const field of sections.flatMap(section => section.fields)) {
    const validators: ValidatorFn[] = [];
    if (field.required && field.validation !== false) validators.push(Validators.required);
    if (field.type === 'email') validators.push(Validators.email);

    const initialValue = field.type === 'checkbox'
      ? false
      : field.type === 'file' || field.type === 'image' ? [] : '';
    const control = new FormControl<any>(initialValue, { nonNullable: true, validators });
    if (field.disabled) control.disable({ emitEvent: false });
    controls[field.formControlName] = control;
  }

  return new FormGroup(controls);
}

@Component({
  selector: 'app-forms',
  imports: [...MaterialImports, CommonModule, FormsModule, ReactiveFormsModule, ToastrModule, DropzoneComponent],
  providers: [...MaterialProviders, ToastrService],
  templateUrl: './forms.component.html',
  styleUrl: './forms.component.scss'
})
export class FormsComponent {
  @Input() fields: FormConfig[] = [];
  @Input() form!: FormGroup;

}


import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { MaterialImports, MaterialProviders } from '../../../../shared/material-imports';
import { createFormGroupFromFields, type FormConfig, FormsComponent } from '../../../../shared/forms/forms.component';
import { departments as departmentData } from '../../../../data/departments';

@Component({
  selector: 'app-create',
  imports: [...MaterialImports, FormsModule, ReactiveFormsModule, ToastrModule, FormsComponent],
  providers: [...MaterialProviders, ToastrService],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent {
  readonly positions: FormConfig[] = [
    {
      section: 'Position Information',
      ordering: 0,
      fields: [
        {
          name: 'Position Code',
          type: 'text',
          required: true,
          validation: true,
          formControlName: 'code',
          options: [],
          errorMessage: 'Position code is required',
          placeholder: 'Enter position code',
          size: 'col-sm-4',
          surfix: '',
          prefix: ''
        },
        {
          name: 'Position Title',
          type: 'text',
          required: true,
          validation: true,
          formControlName: 'title',
          options: [],
          errorMessage: 'Position title is required',
          placeholder: 'Enter position title',
          size: 'col-sm-4',
          surfix: '',
          prefix: ''
        },
        {
          name: 'Job Level',
          type: 'select',
          required: true,
          validation: true,
          formControlName: 'jobLevel',
          options: [
            { value: 'ENTRY', label: 'Entry level' },
            { value: 'INTERMEDIATE', label: 'Intermediate' },
            { value: 'SENIOR', label: 'Senior' },
            { value: 'LEAD', label: 'Lead' },
            { value: 'MANAGER', label: 'Manager' },
            { value: 'DIRECTOR', label: 'Director' }
          ],
          errorMessage: 'Job level is required',
          placeholder: 'Select job level',
          size: 'col-sm-4',
          surfix: '',
          prefix: ''
        },
        {
          name: 'Description',
          type: 'textarea',
          required: false,
          validation: false,
          formControlName: 'description',
          options: [],
          errorMessage: '',
          placeholder: 'Enter position description',
          size: 'col-sm-12',
          surfix: '',
          prefix: ''
        }
      ]
    },
    {
      section: 'Organizational Structure',
      ordering: 1,
      fields: [
        {
          name: 'Department',
          type: 'select',
          required: true,
          validation: true,
          formControlName: 'departmentId',
          options: departmentData.map(department => ({ value: department.id, label: department.name })),
          errorMessage: 'Department is required',
          placeholder: 'Select department',
          size: 'col-sm-6',
          surfix: '',
          prefix: ''
        },
        {
          name: 'Reports To',
          type: 'text',
          required: false,
          validation: false,
          formControlName: 'reportsTo',
          options: [],
          errorMessage: '',
          placeholder: 'Enter reporting position',
          size: 'col-sm-6',
          surfix: '',
          prefix: ''
        }
      ]
    },
    {
      section: 'Effective Period',
      ordering: 2,
      fields: [
        {
          name: 'Effective From',
          type: 'date',
          required: false,
          validation: false,
          formControlName: 'effectiveFrom',
          options: [],
          errorMessage: '',
          placeholder: 'Select start date',
          size: 'col-sm-6',
          surfix: '',
          prefix: ''
        },
        {
          name: 'Effective To',
          type: 'date',
          required: false,
          validation: false,
          formControlName: 'effectiveTo',
          options: [],
          errorMessage: '',
          placeholder: 'Select end date',
          size: 'col-sm-6',
          surfix: '',
          prefix: ''
        }
      ]
    }
  ];

  positionForm = createFormGroupFromFields(this.positions);

  onSubmit(): void {
    console.log('form.value', this.positionForm.value);
  }

}

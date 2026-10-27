
import { Component, OnDestroy } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialImports, MaterialProviders } from '../../../../shared/material-imports';
import { RouterLink } from '@angular/router';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { createFormGroupFromFields, FormConfig, FormFieldConfig, FormsComponent } from '../../../../shared/forms/forms.component';

@Component({
  selector: 'app-create',
  imports: [...MaterialImports, FormsModule, ReactiveFormsModule, ToastrModule, FormsComponent],
  providers: [...MaterialProviders, ToastrService],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent {
  departments: FormConfig[] = [
    {
      section: 'Department Information',
      ordering: 0,
      fields: [
        {
          name: 'Department Code',
          type: 'text',
          required: true, 
          validation: true,
          formControlName: 'code',
          options: [],
          errorMessage: "Department Code is required",
          placeholder: "Enter Department Code",
          size: 'col-sm-4',
          surfix: '',
          prefix: '',
        },
        {
          name: 'Department Name',
          type: 'text',
          required: true, 
          validation: true,
          formControlName: 'name',
          options: [],
          errorMessage: "Department name is required",
          placeholder: "Enter Department name",
          size: 'col-sm-4',
          surfix: '',
          prefix: '',
        },
        {
          name: 'Description',
          type: 'textarea',
          required: false, 
          validation: false,
          formControlName: 'description',
          options: [],
          errorMessage: "",
          placeholder: "Enter description",
          size: 'col-sm-12',
          surfix: '',
          prefix: '',
        }
      ]
    },
    {
      section: 'Organizational Structure',
      ordering: 1,
      fields: [
      {
        name: 'Parent Department',
        type: 'select',
        required: true, 
        validation: true,
        formControlName: 'parentDepartment',
        options: [
          { value: 'MALAYSIA', label: 'Malaysia' }
        ],
        errorMessage: "Parent Department is required",
        placeholder: "Enter Parent Department",
        size: 'col-sm-6',
        surfix: '',
        prefix: '',
      },
      {
        name: 'Head of Department',
        type: 'select',
        required: true, 
        validation: true,
        formControlName: 'headOfDepartment',
        options: [
          { value: 'MALAYSIA', label: 'Malaysia' }
        ],
        errorMessage: "Parent Department is required",
        placeholder: "Enter Parent Department",
        size: 'col-sm-6',
        surfix: '',
        prefix: '',
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
            errorMessage: "",
            placeholder: "Enter Effective From",
            size: 'col-sm-6',
            surfix: '',
            prefix: '',
            },
            {
            name: 'Effective To',
            type: 'date',
            required: false, 
            validation: false,
            formControlName: 'effectiveTo',
            options: [],
            errorMessage: "",
            placeholder: "Enter Effective To",
            size: 'col-sm-6',
            surfix: '',
            prefix: '',
            }
        ]
    }
  ];

  departmentForm = createFormGroupFromFields(this.departments);

  onSubmit(form: any){
    console.log("form.value", form.value)
  }
}

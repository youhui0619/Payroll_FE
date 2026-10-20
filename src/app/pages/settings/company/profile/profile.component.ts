import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialImports, MaterialProviders } from '../../../../shared/material-imports';
import { RouterLink } from '@angular/router';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { createFormGroupFromFields, FormConfig, FormFieldConfig, FormsComponent } from '../../../../shared/forms/forms.component';
import { COMPANY_PROFILE } from '../../../../data/company.data';
import { Company } from '../../../../models/company.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [...MaterialImports, CommonModule, FormsModule, ReactiveFormsModule,  ToastrModule, FormsComponent],
  providers: [...MaterialProviders, ToastrService],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
readonly companyProfile: Company = COMPANY_PROFILE;

  companyFields: FormConfig[] = [
    {
      section: 'Company Information',
      ordering: 0,
      fields: [
        {
          name: 'Company Logo',
          type: 'image',
          required: false, 
          validation: false,
          formControlName: 'logo',
          options: [],
          errorMessage: "",
          placeholder: "Drop PNG or JPEG images here or click to",
          size: 'col-sm-12',
          surfix: '',
          prefix: '',
          isMultipleFiles: true,
          accept: 'image/png,image/jpeg',
          headline: 'Drop or select images'
        },
        {
          name: 'Company Name',
          type: 'text',
          required: true, 
          validation: true,
          formControlName: 'name',
          options: [],
          errorMessage: "Customer company name is required",
          placeholder: "Enter company name",
          size: 'col-sm-8',
          surfix: '',
          prefix: '',
        },
        {
          name: 'Registration No.',
          type: 'number',
          required: true, 
          validation: true,
          formControlName: 'registrationNo',
          options: [],
          errorMessage: "Registration No. is required",
          placeholder: "Enter registration number",
          size: 'col-sm-4',
          surfix: '',
          prefix: '',
        },
        {
          name: 'Contact No.',
          type: 'text',
          required: true, 
          validation: true,
          formControlName: 'contactNo',
          options: [],
          errorMessage: "Contact No. is required",
          placeholder: "Enter contact no.",
          size: 'col-sm-4',
          surfix: '',
          prefix: '',
        },
        {
          name: 'Email',
          type: 'email',
          required: true, 
          validation: true,
          formControlName: 'email',
          options: [],
          errorMessage: "Email is required",
          placeholder: "Enter email",
          size: 'col-sm-4',
          surfix: '',
          prefix: '',
        },
        {
          name: 'SST No.',
          type: 'text',
          required: false, 
          validation: false,
          formControlName: 'sstNo',
          options: [],
          errorMessage: "",
          placeholder: "Enter SST No.",
          size: 'col-sm-4',
          surfix: '',
          prefix: '',
        },
        {
          name: 'Tax No.',
          type: 'text',
          required: false, 
          validation: false,
          formControlName: 'taxNo',
          options: [],
          errorMessage: "",
          placeholder: "Enter Tax No.",
          size: 'col-sm-4',
          surfix: '',
          prefix: '',
        },
        {
          name: 'Website',
          type: 'text',
          required: false, 
          validation: false,
          formControlName: 'website',
          options: [],
          errorMessage: "",
          placeholder: "Enter Website",
          size: 'col-sm-4',
          surfix: '',
          prefix: '',
        },
        {
          name: 'Company Financial Starting Month',
          type: 'select',
          required: true, 
          validation: true,
          formControlName: 'financialStartingMonth',
          options: [
            { value: 'JANUARY', label: 'January' },
            { value: 'FEBRUARY', label: 'February' },
            { value: 'MARCH', label: 'March' },
            { value: 'APRIL', label: 'April' },
            { value: 'MAY', label: 'May' },
            { value: 'JUNE', label: 'June' },
            { value: 'JULY', label: 'July' },
            { value: 'AUGUST', label: 'August' },
            { value: 'SEPTEMBER', label: 'September' },
            { value: 'OCTOBER', label: 'October' },
            { value: 'NOVEMBER', label: 'November' },
            { value: 'DECEMBER', label: 'December' }
          ],
          errorMessage: "Financial Year is required",
          placeholder: "Enter Financial Year",
          size: 'col-sm-4',
          surfix: '',
          prefix: '',
        },
      ]
    },
    {
      section: 'Business Address',
      ordering: 3,
      fields: [
        {
          name: 'Address Line 1',
          type: 'text',
          required: true, 
          validation: true,
          formControlName: 'businessAddressLine1',
          options: [],
          errorMessage: "Address Line 1 is required",
          placeholder: "Address Line 1",
          size: 'col-sm-6',
          surfix: '',
          prefix: '',
        },
        {
        name: 'Address Line 2',
        type: 'text',
        required: true, 
        validation: true,
        formControlName: 'businessAddressLine2',
        options: [],
        errorMessage: "Address Line 2 is required",
        placeholder: "Address Line 2",
        size: 'col-sm-6',
        surfix: '',
        prefix: '',
      },
      {
        name: 'City',
        type: 'text',
        required: true, 
        validation: true,
        formControlName: 'businessCity',
        options: [],
        errorMessage: "City is required",
        placeholder: "Enter City",
        size: 'col-sm-3',
        surfix: '',
        prefix: '',
      },
      {
        name: 'Postcode',
        type: 'number',
        required: true, 
        validation: true,
        formControlName: 'businessPostcode',
        options: [],
        errorMessage: "Postcode is required",
        placeholder: "Enter Postcode",
        size: 'col-sm-3',
        surfix: '',
        prefix: '',
      },
      {
        name: 'State',
        type: 'text',
        required: true, 
        validation: true,
        formControlName: 'businessState',
        options: [],
        errorMessage: "State is required",
        placeholder: "Enter State",
        size: 'col-sm-3',
        surfix: '',
        prefix: '',
      },
      {
        name: 'Country',
        type: 'select',
        required: true, 
        validation: true,
        formControlName: 'businessCountry',
        options: [
          { value: 'MALAYSIA', label: 'Malaysia' }
        ],
        errorMessage: "Country is required",
        placeholder: "Enter country",
        size: 'col-sm-3',
        surfix: '',
        prefix: '',
      },
      ]
    },
  ];
  companyForm = createFormGroupFromFields(this.companyFields);

  ngOnInit(): void {
    this.patchCompanyForm();
  }

  private patchCompanyForm(): void {
    const fields = this.companyFields.flatMap(section => section.fields);
    const formValues = Object.fromEntries(
      Object.entries(this.companyProfile)
        .filter(([key]) => key !== 'id' && this.companyForm.contains(key))
        .map(([key, value]) => {
          const field = fields.find(item => item.formControlName === key);
          const formValue = field?.isMultipleFiles
            ? Array.isArray(value) ? value : value ? [value] : []
            : Array.isArray(value) ? value[0] ?? '' : value ?? '';
          return [key, formValue];
        })
    );

    this.companyForm.patchValue(formValues);
  }


  onSubmit(form: any){
    console.log("form.value", form.value)
  }
}
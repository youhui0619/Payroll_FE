import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialImports, MaterialProviders } from '../../../../shared/material-imports';
import { departments } from '../../../../data/departments';
import { employees } from '../../../../data/employees';
import { claims } from '../../../../data/claims';
import type { ClaimPaymentMethod, ClaimType, ExpenseClaimRecord } from '../../../../models/claim.model';
import type { EmployeeRecord } from '../../../../models/employee.model';
import { DropzoneComponent } from '../../../../shared/dropzone/dropzone.component';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [...MaterialImports, CommonModule, ReactiveFormsModule, DropzoneComponent],
  providers: [...MaterialProviders],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent {
  readonly departments = departments.filter(department => department.status === 'Active');
  readonly employees = employees;
  readonly claimTypes: { value: ClaimType; label: string }[] = [
    { value: 'TRAVEL', label: 'Travel' },
    { value: 'MEALS', label: 'Meals' },
    { value: 'ACCOMMODATION', label: 'Accommodation' },
    { value: 'TRANSPORTATION', label: 'Transportation' },
    { value: 'MEDICAL', label: 'Medical' },
    { value: 'COMMUNICATION', label: 'Communication' },
    { value: 'OTHER', label: 'Other' }
  ];
  readonly paymentMethods: { value: ClaimPaymentMethod; label: string }[] = [
    { value: 'PAYROLL', label: 'Payroll' },
    { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
    { value: 'CASH', label: 'Cash' }
  ];

  readonly employeeSearch = new FormControl<EmployeeRecord | string>('');
  submitted = false;
  createdClaim: ExpenseClaimRecord | null = null;

  readonly claimForm = new FormGroup({
    claimDate: new FormControl<Date | null>(null, Validators.required),
    departmentId: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    employeeId: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    claimType: new FormControl<ClaimType | null>(null, Validators.required),
    description: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    amount: new FormControl<number | null>(null, [Validators.required, Validators.min(0.01)]),
    paymentMethod: new FormControl<ClaimPaymentMethod | null>(null, Validators.required),
    supportingDocuments: new FormControl<Array<File | string>>([], {
      nonNullable: true,
      validators: [Validators.minLength(1)]
    })
  });

  get filteredEmployees(): EmployeeRecord[] {
    const departmentId = this.claimForm.controls.departmentId.value;
    const searchValue = this.employeeSearch.value;
    const query = typeof searchValue === 'string' ? searchValue.trim().toLowerCase() : '';
    if (!departmentId) return [];

    return this.employees.filter(employee => {
      const employeeDepartment = this.departments.find(department => department.name === employee.department);
      const matchesDepartment = employeeDepartment?.id === departmentId;
      const matchesQuery = !query || [employee.employeeName, employee.employeeId]
        .some(value => value.toLowerCase().includes(query));
      return matchesDepartment && matchesQuery;
    });
  }

  get selectedEmployee(): EmployeeRecord | undefined {
    const employeeId = this.claimForm.controls.employeeId.value;
    return this.employees.find(employee => employee.employeeId === employeeId);
  }

  readonly employeeDisplayName = (value: EmployeeRecord | string | null): string => {
    if (value && typeof value === 'object') return `${value.employeeId} - ${value.employeeName}`;
    if (!value) return '';
    const employee = this.employees.find(item => item.employeeId === value);
    return employee ? `${employee.employeeId} - ${employee.employeeName}` : value;
  };

  onDepartmentChange(): void {
    this.claimForm.controls.employeeId.setValue('');
    this.employeeSearch.setValue('');
  }

  onEmployeeSelected(employee: EmployeeRecord): void {
    this.claimForm.controls.employeeId.setValue(employee.employeeId);
    this.employeeSearch.setValue(employee);
  }

  onEmployeeSearchInput(): void {
    if (typeof this.employeeSearch.value === 'string') {
      this.claimForm.controls.employeeId.setValue('');
    }
  }

  onSubmit(form: any): void {
    this.submitted = true;
    if (form.invalid) {
      form.markAllAsTouched();
      this.employeeSearch.markAsTouched();
      return;
    }

    const formValue = form.value;
    const employee = this.employees.find(item => item.employeeId === formValue.employeeId);
    const department = this.departments.find(item => item.id === formValue.departmentId);
    if (!employee || !department || employee.department !== department.name || !formValue.claimDate) {
      this.claimForm.controls.employeeId.setErrors({ selectionRequired: true });
      return;
    }

    const nextNumber = Math.max(0, ...claims.map(claim => Number(claim.id.replace('CLM-', '')))) + 1;
    const data: ExpenseClaimRecord = {
      id: `CLM-${String(nextNumber).padStart(4, '0')}`,
      claimDate: this.dateKey(formValue.claimDate),
      employeeId: employee.employeeId,
      employeeName: employee.employeeName,
      departmentId: department.id,
      departmentName: department.name,
      claimType: formValue.claimType!,
      description: formValue.description.trim(),
      amount: formValue.amount!,
      currency: 'MYR',
      paymentMethod: formValue.paymentMethod!,
      supportingDocuments: formValue.supportingDocuments.map((document: any) =>
        typeof document === 'string' ? document : document.name
      ),
      status: 'Pending',
      submittedAt: new Date().toISOString()
    };
    console.log('data', data);
  }

  private dateKey(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}

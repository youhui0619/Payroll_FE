
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialImports, MaterialProviders } from '../../../../shared/material-imports';
import { departments } from '../../../../data/workforce/departments.data';
import { employees } from '../../../../data/workforce/employees.data';
import { claims } from '../../../../data/claims/claims.data';
import { claimTypes as claimTypeSettings } from '../../../../data/claims/claim-types.data';
import type { ClaimPaymentMethod, ClaimType, ExpenseClaimRecord } from '../../../../models/claims/claim.model';
import type { EmployeeRecord } from '../../../../models/workforce/employee.model';
import { DropzoneComponent } from '../../../../shared/dropzone/dropzone.component';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [...MaterialImports, ReactiveFormsModule, DropzoneComponent],
  providers: [...MaterialProviders],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent {
  constructor(
    private router: Router,
  ) {}
  
  departments = departments.filter(department => department.status === 'Active');
  employees = employees;
  claimTypes: { value: ClaimType; label: string }[] = claimTypeSettings
    .filter(claimType => claimType.status === 'ACTIVE')
    .map(claimType => ({ value: claimType.code, label: claimType.name }));
  paymentMethods: { value: ClaimPaymentMethod; label: string }[] = [
    { value: 'PAYROLL', label: 'Payroll' },
    { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
    { value: 'CASH', label: 'Cash' }
  ];

  employeeSearch = new FormControl<EmployeeRecord | string>('');
  submitting = false;

  form = new FormGroup({
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


  goBack() { 
    return this.router.navigate(['/settings/claim-settings/overview'])
  }

  get filteredEmployees(): EmployeeRecord[] {
    const departmentId = this.form.controls.departmentId.value;
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
    const employeeId = this.form.controls.employeeId.value;
    return this.employees.find(employee => employee.employeeId === employeeId);
  }

  employeeDisplayName = (value: EmployeeRecord | string | null): string => {
    if (value && typeof value === 'object') return `${value.employeeId} - ${value.employeeName}`;
    if (!value) return '';
    const employee = this.employees.find(item => item.employeeId === value);
    return employee ? `${employee.employeeId} - ${employee.employeeName}` : value;
  };

  onDepartmentChange(): void {
    this.form.controls.employeeId.setValue('');
    this.employeeSearch.setValue('');
  }

  onEmployeeSelected(employee: EmployeeRecord): void {
    this.form.controls.employeeId.setValue(employee.employeeId);
    this.employeeSearch.setValue(employee);
  }

  onEmployeeSearchInput(): void {
    if (typeof this.employeeSearch.value === 'string') {
      this.form.controls.employeeId.setValue('');
    }
  }

  onSubmit(form: any): void {
    this.submitting = true;
    if (form.invalid) {
      form.markAllAsTouched();
      this.employeeSearch.markAsTouched();
      return;
    }

    const value = form.value;
    const employee = this.employees.find(item => item.employeeId === value.employeeId);
    const department = this.departments.find(item => item.id === value.departmentId);
    if (!employee || !department || employee.department !== department.name || !value.claimDate) {
      this.form.controls.employeeId.setErrors({ selectionRequired: true });
      return;
    }

    const nextNumber = claims.reduce((maximum, claim) => {
      const numberSuffix = Number(claim.id.match(/-(\d+)$/)?.[1]);
      return Number.isFinite(numberSuffix) ? Math.max(maximum, numberSuffix) : maximum;
    }, 0) + 1;
    const claimType = value.claimType as ClaimType;
    const data: ExpenseClaimRecord = {
      id: `CLM-${claimType}-${String(nextNumber).padStart(4, '0')}`,
      claimDate: this.dateKey(value.claimDate),
      employeeId: employee.employeeId,
      employeeName: employee.employeeName,
      departmentId: department.id,
      departmentName: department.name,
      claimType,
      description: value.description.trim(),
      amount: value.amount!,
      currency: 'MYR',
      paymentMethod: value.paymentMethod!,
      supportingDocuments: value.supportingDocuments.map((document: any) =>
        typeof document === 'string' ? document : document.name
      ),
      status: 'Pending',
      submittedAt: new Date().toISOString(),
      approval: { approver: '-', approvedDate: null, comments: '' }
    };

    console.log("data", data)
  }

  private dateKey(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}

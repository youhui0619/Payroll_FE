import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialImports, MaterialProviders } from '../../../../shared/material-imports';
import { departments } from '../../../../data/workforce/departments.data';
import { employees } from '../../../../data/workforce/employees.data';
import { leaveApplications } from '../../../../data/leave/leave-applications.data';
import { leavePolicies } from '../../../../data/leave/leave-policies.data';
import type { EmployeeRecord } from '../../../../models/workforce/employee.model';
import type { LeaveApplication } from '../../../../models/leave/leave.model';
import { DropzoneComponent } from '../../../../shared/dropzone/dropzone.component';

@Component({
  selector: 'app-leave-create',
  standalone: true,
  imports: [...MaterialImports, CommonModule, ReactiveFormsModule, DropzoneComponent],
  providers: [...MaterialProviders],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent {
  readonly departments = departments.filter(department => department.status === 'Active');
  readonly employees = employees;
  readonly leaveTypeOptions = leavePolicies.filter(policy => policy.status === 'ACTIVE');
  readonly employeeSearch = new FormControl<EmployeeRecord | string>('');
  submitted = false;
  createdLeave: LeaveApplication | null = null;

  readonly leaveForm = new FormGroup({
    requestDate: new FormControl<Date | null>(new Date(), Validators.required),
    departmentId: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    employeeId: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    leaveCode: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    startDate: new FormControl<Date | null>(null, Validators.required),
    endDate: new FormControl<Date | null>(null, Validators.required),
    reason: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    supportingDocuments: new FormControl<Array<File | string>>([], { nonNullable: true })
  });

  constructor(private readonly route: ActivatedRoute, private readonly router: Router) {
    this.route.queryParamMap.subscribe(params => {
      const employee = this.employees.find(item => item.employeeId === params.get('employeeId'));
      const selectedDate = this.dateFromKey(params.get('date'));
      if (employee) {
        const department = this.departments.find(item => item.name === employee.department);
        if (department) this.leaveForm.controls.departmentId.setValue(department.id);
        this.onEmployeeSelected(employee);
      }
      if (selectedDate) {
        this.leaveForm.controls.startDate.setValue(selectedDate);
        this.leaveForm.controls.endDate.setValue(selectedDate);
      }
    });
  }

  goBack(): void {
    void this.router.navigateByUrl('/time-leave/leave/applications');
  }

  get selectedEmployee(): EmployeeRecord | undefined {
    return this.employees.find(employee => employee.employeeId === this.leaveForm.controls.employeeId.value);
  }

  get selectedLeavePolicy() {
    return this.leaveTypeOptions.find(policy => policy.leaveCode === this.leaveForm.controls.leaveCode.value);
  }

  get filteredEmployees(): EmployeeRecord[] {
    const departmentId = this.leaveForm.controls.departmentId.value;
    const searchValue = this.employeeSearch.value;
    const query = typeof searchValue === 'string' ? searchValue.trim().toLowerCase() : '';
    if (!departmentId) return [];

    return this.employees.filter(employee => {
      const department = this.departments.find(item => item.name === employee.department);
      return department?.id === departmentId
        && (!query || [employee.employeeId, employee.employeeName].some(value => value.toLowerCase().includes(query)));
    });
  }

  readonly employeeDisplayName = (value: EmployeeRecord | string | null): string => {
    if (value && typeof value === 'object') return `${value.employeeId} - ${value.employeeName}`;
    if (!value) return '';
    const employee = this.employees.find(item => item.employeeId === value);
    return employee ? `${employee.employeeId} - ${employee.employeeName}` : value;
  };

  get requestedDays(): number {
    const { startDate, endDate } = this.leaveForm.getRawValue();
    if (!startDate || !endDate || endDate < startDate) return 0;
    return Math.round((this.startOfDay(endDate).getTime() - this.startOfDay(startDate).getTime()) / 86_400_000) + 1;
  }

  get requestedDaysLabel(): string {
    return `${this.requestedDays} day${this.requestedDays === 1 ? '' : 's'}`;
  }

  onDepartmentChange(): void {
    this.leaveForm.controls.employeeId.setValue('');
    this.employeeSearch.setValue('');
  }

  onEmployeeSelected(employee: EmployeeRecord): void {
    this.leaveForm.controls.employeeId.setValue(employee.employeeId);
    this.employeeSearch.setValue(employee);
  }

  onEmployeeSearchInput(): void {
    if (typeof this.employeeSearch.value === 'string') this.leaveForm.controls.employeeId.setValue('');
  }

  onLeaveTypeChange(): void {
    const documents = this.leaveForm.controls.supportingDocuments;
    if (this.selectedLeavePolicy?.requireSupportingDocuments) {
      documents.setValidators([Validators.minLength(1)]);
    } else {
      documents.clearValidators();
    }
    documents.updateValueAndValidity({ emitEvent: false });
  }

  onSubmit(): void {
    this.submitted = true;
    this.createdLeave = null;
    if (this.leaveForm.invalid) {
      this.leaveForm.markAllAsTouched();
      this.employeeSearch.markAsTouched();
      return;
    }

    const { requestDate, departmentId, employeeId, leaveCode, startDate, endDate, reason, supportingDocuments } = this.leaveForm.getRawValue();
    const employee = this.employees.find(item => item.employeeId === employeeId);
    const department = this.departments.find(item => item.id === departmentId);
    const policy = this.leaveTypeOptions.find(item => item.leaveCode === leaveCode);
    if (!requestDate || !startDate || !endDate || endDate < startDate || !employee || !department || !policy || employee.department !== department.name) {
      if (endDate && startDate && endDate < startDate) this.leaveForm.controls.endDate.setErrors({ invalidRange: true });
      if (!employee || !department || employee.department !== department.name) this.leaveForm.controls.employeeId.setErrors({ selectionRequired: true });
      return;
    }

    const nextReferenceNumber = leaveApplications.reduce((maximum, application) => {
      if (!application.reference.startsWith(`${policy.leaveCode}-`)) return maximum;
      const number = Number(application.reference.split('-').at(-1));
      return Number.isFinite(number) ? Math.max(maximum, number) : maximum;
    }, 100) + 1;
    const record: LeaveApplication = {
      employeeId: employee.employeeId,
      requestDate: this.formatDate(requestDate),
      leaveType: policy.leaveName,
      reference: `${policy.leaveCode}-${requestDate.getFullYear()}-${nextReferenceNumber}`,
      dateRange: startDate.getTime() === endDate.getTime()
        ? this.formatDate(startDate)
        : `${this.formatDate(startDate)} ~ ${this.formatDate(endDate)}`,
      daysTaken: this.requestedDaysLabel.replace(/^./, value => value.toUpperCase()),
      status: 'Pending',
      statusClass: 'bg-light-info text-info',
      iconClass: policy.leaveType === 'UNPAID' ? 'text-secondary bg-light-secondary' : 'text-primary bg-light-primary',
      reason: reason.trim(),
      approval: { approver: employee.reportingManager || 'Manager', status: 'Pending', comments: '', approvedDate: null },
      supportingDocuments: supportingDocuments.map(document => typeof document === 'string' ? document : document.name)
    };

    leaveApplications.unshift(record);
    this.createdLeave = record;
  }

  private dateFromKey(dateKey: string | null): Date | null {
    if (!dateKey) return null;
    const [year, month, day] = dateKey.split('-').map(Number);
    if (!year || !month || !day) return null;
    return new Date(year, month - 1, day);
  }

  private startOfDay(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  private formatDate(date: Date): string {
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
  }
}

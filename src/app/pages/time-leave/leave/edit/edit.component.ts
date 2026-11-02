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
import type { LeavePolicy } from '../../../../models/leave/leave-policy.model';
import { DropzoneComponent } from '../../../../shared/dropzone/dropzone.component';

type LeaveTypeOption = Pick<LeavePolicy, 'leaveCode' | 'leaveName' | 'leaveType' | 'requireSupportingDocuments'>;

@Component({
  selector: 'app-leave-edit',
  standalone: true,
  imports: [...MaterialImports, CommonModule, ReactiveFormsModule, DropzoneComponent],
  providers: [...MaterialProviders],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent {
  readonly departments = departments.filter(department => department.status === 'Active');
  readonly employees = employees;
  readonly leaveTypeOptions: LeaveTypeOption[] = leavePolicies
    .filter(policy => policy.status === 'ACTIVE')
    .map(({ leaveCode, leaveName, leaveType, requireSupportingDocuments }) => ({ leaveCode, leaveName, leaveType, requireSupportingDocuments }));
  readonly employeeSearch = new FormControl<EmployeeRecord | string>('');
  submitted = false;
  leaveToEdit: LeaveApplication | null = null;
  updatedLeave: LeaveApplication | null = null;

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
    this.route.paramMap.subscribe(params => this.loadLeaveApplication(params.get('reference')));
  }

  private loadLeaveApplication(reference: string | null): void {
    const application = leaveApplications.find(item => item.reference === reference);
    if (!application || application.status !== 'Pending') {
      void this.router.navigateByUrl('/time-leave/leave/applications');
      return;
    }
    this.leaveToEdit = application;

    const employee = this.employees.find(item => item.employeeId === application.employeeId);
    const department = this.departments.find(item => item.name === employee?.department);
    const [startText, endText = startText] = application.dateRange.split('~').map(value => value.trim());
    const startDate = this.parseDisplayDate(startText);
    const endDate = this.parseDisplayDate(endText);
    let policy = this.leaveTypeOptions.find(item => item.leaveName === application.leaveType);
    if (!policy) {
      policy = {
        leaveCode: `LEGACY-${application.reference}`,
        leaveName: application.leaveType,
        leaveType: 'PAID',
        requireSupportingDocuments: false
      };
      this.leaveTypeOptions.push(policy);
    }

    this.leaveForm.patchValue({
      requestDate: application.requestDate ? this.parseDisplayDate(application.requestDate) : new Date(),
      departmentId: department?.id ?? '',
      employeeId: application.employeeId,
      leaveCode: policy?.leaveCode ?? '',
      startDate,
      endDate,
      reason: application.reason,
      supportingDocuments: application.supportingDocuments ?? []
    });
    if (employee) this.onEmployeeSelected(employee);
    this.onLeaveTypeChange();
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
    this.updatedLeave = null;
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

    const index = leaveApplications.findIndex(application => application.reference === this.route.snapshot.paramMap.get('reference'));
    const existingApplication = leaveApplications[index];
    if (index < 0 || !existingApplication) return;
    const record: LeaveApplication = {
      ...existingApplication,
      employeeId: employee.employeeId,
      requestDate: this.formatDate(requestDate),
      leaveType: policy.leaveName,
      dateRange: startDate.getTime() === endDate.getTime()
        ? this.formatDate(startDate)
        : `${this.formatDate(startDate)} ~ ${this.formatDate(endDate)}`,
      daysTaken: this.requestedDaysLabel.replace(/^./, value => value.toUpperCase()),
      iconClass: policy.leaveType === 'UNPAID' ? 'text-secondary bg-light-secondary' : 'text-primary bg-light-primary',
      reason: reason.trim(),
      supportingDocuments: supportingDocuments.map(document => typeof document === 'string' ? document : document.name)
    };

    leaveApplications[index] = record;
    this.leaveToEdit = record;
    this.updatedLeave = record;
  }

  goBack(): void {
    void this.router.navigateByUrl('/time-leave/leave/applications');
  }

  private parseDisplayDate(dateText: string): Date | null {
    const [day, month, year] = dateText.split('/').map(Number);
    if (!day || !month || !year) return null;
    return new Date(year, month - 1, day);
  }

  private startOfDay(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  private formatDate(date: Date): string {
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
  }
}

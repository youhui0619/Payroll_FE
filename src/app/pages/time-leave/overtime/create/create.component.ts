
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialImports, MaterialProviders } from '../../../../shared/material-imports';
import { departments } from '../../../../data/departments';
import { employees } from '../../../../data/employees';
import { overtimeRequests } from '../../../../data/overtime-requests';
import { payrollSettings } from '../../../../data/payroll-settings';
import type { EmployeeRecord } from '../../../../models/employee.model';
import type { OvertimeRequestRecord, OvertimeType } from '../../../../models/overtime.model';
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
  readonly departments = departments.filter(department => department.status === 'Active');
  readonly employees = employees;
  get overtimeTypes(): { value: OvertimeType; label: string; multiplier: number | null }[] {
    const types: { value: OvertimeType; label: string; multiplier: number | null }[] = [
      { value: 'NORMAL_WORKING_DAY', label: 'Normal Working Day', multiplier: payrollSettings.normalWorkingDayMultiplier }
    ];
    if (payrollSettings.configureRestDayRates) {
      types.push({ value: 'REST_DAY', label: 'Rest Day', multiplier: payrollSettings.restDayOvertimeMultiplier });
    }
    if (payrollSettings.configurePublicHolidayRates) {
      types.push({ value: 'PUBLIC_HOLIDAY', label: 'Public Holiday', multiplier: payrollSettings.publicHolidayOvertimeMultiplier });
    }
    return types;
  }
  readonly breakDurations = [0, 15, 30, 45, 60];

  readonly employeeSearch = new FormControl<EmployeeRecord | string>('');
  submitted = false;
  createdOvertime: OvertimeRequestRecord | null = null;

  readonly otForm = new FormGroup({
    requestDate: new FormControl<Date | null>(null, Validators.required),
    departmentId: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    employeeId: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    overtimeDate: new FormControl<Date | null>(null, Validators.required),
    overtimeType: new FormControl<OvertimeType | null>(null, Validators.required),
    startTime: new FormControl<Date | null>(null, Validators.required),
    endTime: new FormControl<Date | null>(null, Validators.required),
    breakDuration: new FormControl<number | null>(null, Validators.required),
    description: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    supportingDocuments: new FormControl<Array<File | string>>([], {
      nonNullable: true,
      validators: [Validators.minLength(1)]
    })
  });

  get netOvertimeMinutes(): number {
    const { startTime, endTime, breakDuration } = this.otForm.getRawValue();
    if (!startTime || !endTime || breakDuration === null) return 0;

    let duration = this.minutesSinceMidnight(endTime) - this.minutesSinceMidnight(startTime);
    if (duration < 0) duration += 24 * 60;
    return Math.max(0, duration - breakDuration);
  }

  get totalOvertimeLabel(): string {
    const { startTime, endTime } = this.otForm.getRawValue();
    if (!startTime || !endTime) return '0 hours';
    let duration = this.minutesSinceMidnight(endTime) - this.minutesSinceMidnight(startTime);
    if (duration < 0) duration += 24 * 60;
    return this.formatDuration(duration);
  }

  get breakDurationLabel(): string {
    const minutes = this.otForm.controls.breakDuration.value ?? 0;
    return minutes ? `${minutes} minutes` : '0 minutes';
  }

  get overtimeTypeLabel(): string {
    const value = this.otForm.controls.overtimeType.value;
    const type = this.overtimeTypes.find(option => option.value === value);
    if (!type) return '—';
    const rate = type.multiplier === null ? 'Rate not set' : `${type.multiplier}× hourly rate`;
    return `${type.label} · ${rate}`;
  }

  get netOvertimeLabel(): string {
    return this.formatDuration(this.netOvertimeMinutes);
  }

  get filteredEmployees(): EmployeeRecord[] {
    const departmentId = this.otForm.controls.departmentId.value;
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
    const employeeId = this.otForm.controls.employeeId.value;
    return this.employees.find(employee => employee.employeeId === employeeId);
  }

  readonly employeeDisplayName = (value: EmployeeRecord | string | null): string => {
    if (value && typeof value === 'object') return `${value.employeeId} - ${value.employeeName}`;
    if (!value) return '';
    const employee = this.employees.find(item => item.employeeId === value);
    return employee ? `${employee.employeeId} - ${employee.employeeName}` : value;
  };

  onDepartmentChange(): void {
    this.otForm.controls.employeeId.setValue('');
    this.employeeSearch.setValue('');
  }

  onEmployeeSelected(employee: EmployeeRecord): void {
    this.otForm.controls.employeeId.setValue(employee.employeeId);
    this.employeeSearch.setValue(employee);
  }

  onEmployeeSearchInput(): void {
    if (typeof this.employeeSearch.value === 'string') {
      this.otForm.controls.employeeId.setValue('');
    }
  }

  onSubmit(): void {
    this.submitted = true;
    this.createdOvertime = null;
    if (this.otForm.invalid) {
      this.otForm.markAllAsTouched();
      this.employeeSearch.markAsTouched();
      return;
    }

    const { requestDate, departmentId, employeeId, overtimeDate, overtimeType, startTime, endTime, breakDuration, description, supportingDocuments } = this.otForm.getRawValue();
    const employee = this.employees.find(item => item.employeeId === employeeId);
    const department = this.departments.find(item => item.id === departmentId);
    const selectedType = this.overtimeTypes.find(type => type.value === overtimeType);
    if (!employee || !department || employee.department !== department.name) {
      this.otForm.controls.employeeId.setErrors({ selectionRequired: true });
      return;
    }
    if (!requestDate || !overtimeDate || !overtimeType || !startTime || !endTime) return;
    if (!selectedType || selectedType.multiplier === null || selectedType.multiplier <= 0) {
      this.otForm.controls.overtimeType.setErrors({ rateNotConfigured: true });
      return;
    }

    if (breakDuration !== null && this.netOvertimeMinutes === 0) {
      this.otForm.controls.endTime.setErrors({ durationMustExceedBreak: true });
      return;
    }

    const year = requestDate.getFullYear();
    const nextNumber = overtimeRequests.reduce((maximum, request) => {
      if (!request.id.startsWith(`OT-${year}-`)) return maximum;
      const numberSuffix = Number(request.id.match(/-(\d+)$/)?.[1]);
      return Number.isFinite(numberSuffix) ? Math.max(maximum, numberSuffix) : maximum;
    }, 0) + 1;
    const totalMinutes = this.netOvertimeMinutes + (breakDuration ?? 0);
    const earningCode = overtimeType === 'NORMAL_WORKING_DAY'
      ? payrollSettings.normalWorkingDayEarningCode
      : overtimeType === 'REST_DAY'
        ? payrollSettings.restDayEarningCode
        : payrollSettings.publicHolidayEarningCode;
    const record: OvertimeRequestRecord = {
      id: `OT-${year}-${String(nextNumber).padStart(4, '0')}`,
      requestDate: this.dateKey(requestDate),
      overtimeDate: this.dateKey(overtimeDate),
      employeeId: employee.employeeId,
      employeeName: employee.employeeName,
      departmentId: department.id,
      departmentName: department.name,
      overtimeType,
      startTime: this.timeKey(startTime),
      endTime: this.timeKey(endTime),
      totalMinutes,
      breakDurationMinutes: breakDuration ?? 0,
      netMinutes: this.netOvertimeMinutes,
      hourlyRateMultiplier: selectedType.multiplier,
      earningCode,
      description: description.trim(),
      supportingDocuments: supportingDocuments.map(document => typeof document === 'string' ? document : document.name),
      status: 'Pending',
      submittedAt: new Date().toISOString(),
      approval: { approver: '-', approvedDate: null, comments: '' }
    };
    overtimeRequests.push(record);
    this.createdOvertime = record;
  }

  private minutesSinceMidnight(time: Date): number {
    return time.getHours() * 60 + time.getMinutes();
  }

  private formatDuration(totalMinutes: number): string {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours && minutes) return `${hours} hours ${minutes} minutes`;
    if (hours) return `${hours} hours`;
    return `${minutes} minutes`;
  }

  private dateKey(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private timeKey(time: Date): string {
    const hours = String(time.getHours()).padStart(2, '0');
    const minutes = String(time.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

}

import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { MaterialImports, MaterialProviders } from '../../material-imports';
import type { EmployeeRecord } from '../../../models/workforce/employee.model';

export interface DailyAttendanceRow {
  dateKey: string;
  date: string;
  day: string;
  clockIn: string;
  clockOut: string;
  duration: string;
  hoursOfWork: string;
  overtime: string;
  remark: string;
}

@Component({
  selector: 'app-attendance-month-detail-dialog',
  standalone: true,
  imports: [...MaterialImports],
  providers: [...MaterialProviders],
  templateUrl: './attendance-month-detail-dialog.component.html',
})
export class AttendanceMonthDetailDialogComponent {
  @Input({ required: true }) employee!: EmployeeRecord;
  @Input({ required: true }) monthLabel = '';
  @Input({ required: true }) records: DailyAttendanceRow[] = [];
  @Output() closed = new EventEmitter<void>();

  close(): void {
    this.closed.emit();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close();
  }
}

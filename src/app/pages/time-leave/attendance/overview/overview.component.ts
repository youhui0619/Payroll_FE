import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialImports, MaterialProviders } from '../../../../shared/material-imports';
import { RouterLink } from '@angular/router';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { CalendarDay, LeaveRecord } from '../../../../models/leave/leave.model';
import type { EmployeeRecord } from '../../../../models/workforce/employee.model';
import { employees as employeeDirectory } from '../../../../data/workforce/employees.data';
import { workLocations } from '../../../../data/workforce/work-locations.data';
import { overtimeRequests } from '../../../../data/overtime/overtime-requests.data';
import { attendanceRecords } from '../../../../data/attendance/attendance.data';
import { dailyAttendanceRecords } from '../../../../data/attendance/daily-attendance.data';
import { getPublicHolidaysForDate } from '../../../../data/settings/public-holidays.data';
import { LeaveDetailDialogComponent, type LeaveDialogData } from '../../../../shared/dialog/leave-detail-dialog/leave-detail-dialog.component';
import { OvertimeDetailDialogComponent } from '../../../../shared/dialog/overtime-detail-dialog/overtime-detail-dialog.component';
import type { OvertimeRequestRecord } from '../../../../models/overtime/overtime.model';
import { AttendanceMonthDetailDialogComponent, type DailyAttendanceRow } from '../../../../shared/dialog/attendance-month-detail-dialog/attendance-month-detail-dialog.component';

@Component({
  selector: 'app-overview',
  imports: [...MaterialImports, CommonModule, FormsModule, ReactiveFormsModule, ToastrModule, RouterLink, LeaveDetailDialogComponent, OvertimeDetailDialogComponent, AttendanceMonthDetailDialogComponent],
  providers: [...MaterialProviders, ToastrService],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent implements AfterViewInit {
  selectedLeave: LeaveDialogData | null = null;
  selectedOvertime: OvertimeRequestRecord | null = null;
  selectedDailyRecordsEmployee: EmployeeRecord | null = null;
  @ViewChild('calendarScroller') private calendarScroller?: ElementRef<HTMLDivElement>;
  
  constructor(private readonly changeDetector: ChangeDetectorRef) {
    this.generateCalendar();
  }

  ngAfterViewInit(): void {
    requestAnimationFrame(() => this.scrollToTodayColumn());
  }
  currentDate = new Date();

  days: CalendarDay[] = [];
  monthLabel = '';

  employees: EmployeeRecord[] = employeeDirectory;
  selectedDepartments: string[] = [];

  readonly leaveRecords: LeaveRecord[] = attendanceRecords;
  readonly overtimeRecords = overtimeRequests;

  get todayDateKey(): string {
    const today = new Date();
    return [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, '0'),
      String(today.getDate()).padStart(2, '0')
    ].join('-');
  }

  isFutureDate(dateKey: string): boolean {
    return dateKey > this.todayDateKey;
  }

  get departments(): string[] {
    return [...new Set(this.employees.map(employee => employee.department).filter(Boolean))]
      .sort((first, second) => first.localeCompare(second));
  }

  get filteredEmployees(): EmployeeRecord[] {
    if (this.selectedDepartments.length === 0) return this.employees;
    return this.employees.filter(employee => this.selectedDepartments.includes(employee.department));
  }

  get selectedEmployeeDailyRows(): DailyAttendanceRow[] {
    const employee = this.selectedDailyRecordsEmployee;
    if (!employee) return [];

    return this.days
      .filter(day => day.dateKey <= this.todayDateKey)
      .map(day => {
      const leave = this.getLeave(employee.employeeId, day.dateKey);
      const holiday = this.getPublicHoliday(employee, day.dateKey);
      const overtime = this.getOvertimeRequest(employee.employeeId, day.dateKey);
      const attendance = dailyAttendanceRecords.find(record =>
        record.employeeId === employee.employeeId && record.date === day.dateKey
      );
      const [year, month, date] = day.dateKey.split('-');

      return {
        dateKey: day.dateKey,
        date: `${date}/${month}/${year}`,
        day: day.dayName,
        clockIn: attendance?.clockIn ?? '—',
        clockOut: attendance?.clockOut ?? '—',
        duration: attendance ? this.durationLabel(attendance.durationMinutes) : '—',
        hoursOfWork: attendance ? this.durationLabel(attendance.hoursWorkedMinutes) : '—',
        overtime: attendance?.overtimeMinutes
          ? this.durationLabel(attendance.overtimeMinutes)
          : overtime ? this.durationLabel(overtime.netMinutes) : '—',
        remark: attendance?.remark ?? leave?.leaveType ?? holiday?.name ?? '—'
      };
    });
  }

  openMonthlyRecords(employee: EmployeeRecord): void {
    this.selectedDailyRecordsEmployee = employee;
  }

  closeMonthlyRecords(): void {
    this.selectedDailyRecordsEmployee = null;
  }

  private durationLabel(totalMinutes: number): string {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours && minutes) return `${hours}h ${minutes}m`;
    if (hours) return `${hours}h`;
    return `${minutes}m`;
  }

  get medicalLeaveCount(): number {
    return this.countEmployeesOnLeave('Medical Leave');
  }

  get annualLeaveCount(): number {
    return this.countEmployeesOnLeave('Annual Leave');
  }

  get unpaidLeaveCount(): number {
    return this.countEmployeesOnLeave('Unpaid Leave');
  }

  get presentTodayCount(): number {
    return this.filteredEmployees.filter(employee => {
      const hasApprovedLeave = this.hasApprovedLeave(employee.employeeId, this.todayDateKey);
      const isPublicHoliday = !!this.getPublicHoliday(employee, this.todayDateKey);
      return !hasApprovedLeave && !isPublicHoliday;
    }).length;
  }

  private countEmployeesOnLeave(leaveType: string): number {
    return new Set(
      this.leaveRecords
        .filter(leave =>
          leave.leaveType === leaveType &&
          leave.status === 'Approved' &&
          this.filteredEmployees.some(employee => employee.employeeId === leave.employeeId) &&
          leave.startDate <= this.todayDateKey &&
          leave.endDate >= this.todayDateKey
        )
        .map(leave => leave.employeeId)
    ).size;
  }

  private hasApprovedLeave(employeeId: string, dateKey: string): boolean {
    return this.leaveRecords.some(leave =>
      leave.employeeId === employeeId &&
      leave.status === 'Approved' &&
      leave.startDate <= dateKey &&
      leave.endDate >= dateKey
    );
  }

  readonly months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ];
  readonly years = Array.from({ length: 5 }, (_, index) => new Date().getFullYear() - index);



  generateCalendar(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    this.monthLabel = new Date(year, month, 1)
      .toLocaleDateString('en-MY', {
        month: 'long',
        year: 'numeric'
      });

    const totalDays = new Date(year, month + 1, 0).getDate();
    const today = new Date();

    this.days = Array.from({ length: totalDays }, (_, index) => {
      const date = new Date(year, month, index + 1);
      const dateKey = [
        year,
        String(month + 1).padStart(2, '0'),
        String(index + 1).padStart(2, '0')
      ].join('-');

      return {
        date: index + 1,
        dateKey,
        dayName: date.toLocaleDateString('en-MY', {
          weekday: 'short'
        }),
        isWeekend: date.getDay() === 0 || date.getDay() === 6,
        isToday:
          date.getFullYear() === today.getFullYear() &&
          date.getMonth() === today.getMonth() &&
          date.getDate() === today.getDate()
      };
    });
  }

  getLeave(
    employeeId: string,
    dateKey: string
  ): LeaveRecord | undefined {
    return this.leaveRecords.find(leave =>
      leave.employeeId === employeeId &&
      leave.startDate <= dateKey &&
      leave.endDate >= dateKey &&
      leave.status === 'Approved'
    );
  }

  getPublicHoliday(employee: EmployeeRecord, dateKey: string) {
    const workLocation = workLocations.find(location => location.id === employee.workLocationId);
    return getPublicHolidaysForDate(dateKey, `${employee.address} ${workLocation?.city ?? ''} ${workLocation?.state ?? ''}`)[0];
  }

  getOvertimeRequest(employeeId: string, dateKey: string) {
    return this.overtimeRecords.find(request =>
      request.employeeId === employeeId &&
      request.overtimeDate === dateKey &&
      request.status === 'Approved'
    );
  }

  attendanceBadgeClass(employee: EmployeeRecord, day: CalendarDay): string {
    const leave = this.getLeave(employee.employeeId, day.dateKey);
    if (leave) return leave.typeClass;
    if (this.getOvertimeRequest(employee.employeeId, day.dateKey)) return 'overtime';
    if (this.getPublicHoliday(employee, day.dateKey)) return 'public-holiday';
    return this.isFutureDate(day.dateKey) ? 'future' : '';
  }

  attendanceBadgeLabel(employee: EmployeeRecord, day: CalendarDay): string {
    const leave = this.getLeave(employee.employeeId, day.dateKey);
    if (leave) return leave.code;
    if (this.getOvertimeRequest(employee.employeeId, day.dateKey)) return 'OT';
    if (this.getPublicHoliday(employee, day.dateKey)) return 'PH';
    return '';
  }

  attendanceBadgeTitle(employee: EmployeeRecord, day: CalendarDay): string {
    const leave = this.getLeave(employee.employeeId, day.dateKey);
    if (leave) return leave.leaveType;
    const overtime = this.getOvertimeRequest(employee.employeeId, day.dateKey);
    if (overtime) return `Overtime · ${overtime.status}`;
    return this.getPublicHoliday(employee, day.dateKey)?.name ?? 'Attendance actions';
  }

  hasAttendanceRecord(employee: EmployeeRecord, day: CalendarDay): boolean {
    return !!this.getLeave(employee.employeeId, day.dateKey)
      || !!this.getOvertimeRequest(employee.employeeId, day.dateKey)
      || !!this.getPublicHoliday(employee, day.dateKey);
  }

  onAttendanceBadgeClick(employee: EmployeeRecord, day: CalendarDay): void {
    const leave = this.getLeave(employee.employeeId, day.dateKey);
    if (leave) {
      this.openLeaveDetails(employee, day, leave);
      return;
    }

    const overtime = this.getOvertimeRequest(employee.employeeId, day.dateKey);
    if (overtime) this.openOvertimeDetails(overtime);
  }

  openOvertimeDetails(request: OvertimeRequestRecord): void {
    this.selectedOvertime = request;
  }

  getInitials(name: string): string {
    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map(part => part.charAt(0).toUpperCase())
      .join('');
  }

  openLeaveDetails(employee: EmployeeRecord, day: CalendarDay, leave: LeaveRecord): void {
    const durationDays = Math.round(
      (new Date(`${leave.endDate}T00:00:00`).getTime() - new Date(`${leave.startDate}T00:00:00`).getTime()) / 86_400_000
    ) + 1;

    this.selectedLeave = {
      title: leave.leaveType,
      subtitle: `Leave details for ${day.dateKey}`,
      status: leave.status,
      statusClass: 'bg-light-primary text-primary',
      employeeInformation: {
        name: employee.employeeName,
        employeeId: employee.employeeId,
        department: employee.department,
        position: employee.position,
        contactNo: employee.contactNo,
        nricNo: employee.nricPassportNo
      },
      details: {
        leaveType: leave.leaveType,
        reference: leave.code,
        date: leave.startDate === leave.endDate
          ? leave.startDate
          : `${leave.startDate} ~ ${leave.endDate}`,
        duration: `${durationDays} calendar day${durationDays === 1 ? '' : 's'}`,
        reason: leave.reason
      },
      approval: leave.approval
    };
  }

  changeMonth(offset: number): void {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + offset,
      1
    );

    this.generateCalendar();
    this.changeDetector.detectChanges();
    requestAnimationFrame(() => this.scrollToFirstDayColumn());
  }

  setMonth(month: number): void {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      month - 1,
      1
    );
    this.generateCalendar();
    this.changeDetector.detectChanges();
    requestAnimationFrame(() => this.scrollToFirstDayColumn());
  }

  setYear(year: number): void {
    this.currentDate = new Date(
      year,
      this.currentDate.getMonth(),
      1
    );
    this.generateCalendar();
    this.changeDetector.detectChanges();
    requestAnimationFrame(() => this.scrollToFirstDayColumn());
  }

  goToToday(): void {
    this.currentDate = new Date();
    this.generateCalendar();
    this.changeDetector.detectChanges();
    requestAnimationFrame(() => this.scrollToTodayColumn());
  }

  private scrollToTodayColumn(): void {
    this.scrollToColumn('[data-today-column]');
  }

  private scrollToFirstDayColumn(): void {
    this.scrollToColumn('[data-first-day-column]');
  }

  private scrollToColumn(selector: string): void {
    const wrapper = this.calendarScroller?.nativeElement;
    const column = wrapper?.querySelector<HTMLElement>(selector);
    if (!wrapper || !column) return;

    const wrapperRect = wrapper.getBoundingClientRect();
    const columnRect = column.getBoundingClientRect();
    const stickyColumn = wrapper.querySelector<HTMLElement>('.sticky-col-employee');
    const stickyWidth = stickyColumn
      ? stickyColumn.getBoundingClientRect().right - wrapperRect.left
      : 240;
    const columnContentLeft = columnRect.left - wrapperRect.left + wrapper.scrollLeft;
    const targetScrollLeft = columnContentLeft - stickyWidth;
    const maxScrollLeft = wrapper.scrollWidth - wrapper.clientWidth;

    wrapper.scrollTo({
      left: Math.max(0, Math.min(targetScrollLeft, maxScrollLeft)),
      behavior: 'smooth'
    });
  }
}

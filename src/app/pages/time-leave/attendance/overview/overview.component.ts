import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialImports, MaterialProviders } from '../../../../shared/material-imports';
import { RouterLink } from '@angular/router';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { CalendarDay, LeaveRecord } from '../../../../models/leave.model';
import type { EmployeeRecord } from '../../../../models/employee.model';
import { employees as employeeDirectory } from '../../../../data/employees';
import { attendanceRecords } from '../../../../data/attendance';
import { getPublicHolidaysForDate } from '../../../../data/public-holidays';
import { LeaveDetailDialogComponent, type LeaveDialogData } from '../../../../shared/dialog/leave-detail-dialog/leave-detail-dialog.component';

@Component({
  selector: 'app-overview',
  imports: [...MaterialImports, CommonModule, FormsModule, ReactiveFormsModule, ToastrModule, RouterLink, LeaveDetailDialogComponent],
  providers: [...MaterialProviders, ToastrService],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent implements AfterViewInit {
  selectedLeave: LeaveDialogData | null = null;
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

  readonly leaveRecords: LeaveRecord[] = attendanceRecords;

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
    return getPublicHolidaysForDate(dateKey, `${employee.address} ${employee.workLocation}`)[0];
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

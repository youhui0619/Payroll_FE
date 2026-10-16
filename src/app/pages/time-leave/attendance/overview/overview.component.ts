import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialImports, MaterialProviders } from '../../../../shared/material-imports';
import { RouterLink } from '@angular/router';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { CalendarDay, LeaveRecord } from '../../../../models/leave.model';
import type { EmployeeRecord } from '../../../../models/employee.model';
import { employees as employeeDirectory } from '../../../../data/employees';
import { LeaveDetailDialogComponent, type LeaveDialogData } from '../../../../shared/dialog/leave-detail-dialog/leave-detail-dialog.component';

@Component({
  selector: 'app-overview',
  imports: [...MaterialImports, CommonModule, FormsModule, ReactiveFormsModule, ToastrModule, RouterLink, LeaveDetailDialogComponent],
  providers: [...MaterialProviders, ToastrService],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent {
  selectedLeave: LeaveDialogData | null = null;
  
  constructor() {
    this.generateCalendar();
  }
  currentDate = new Date();

  days: CalendarDay[] = [];
  monthLabel = '';

  employees: EmployeeRecord[] = employeeDirectory;

  leaveRecords: LeaveRecord[] = [
    {
      employeeId: 'EMP-0042',
      startDate: '2026-10-14',
      endDate: '2026-10-14',
      leaveType: 'Medical Leave',
      code: 'MC',
      typeClass: 'medical',
      status: 'Approved',
      reason: 'Recovering from a seasonal illness.',
      approval: { approver: 'Farah Rahman', status: 'Approved', comments: 'Medical certificate received and verified.', approvedDate: '2026-10-13' }
    },
    {
      employeeId: 'EMP-0043',
      startDate: '2026-10-15',
      endDate: '2026-10-16',
      leaveType: 'Annual Leave',
      code: 'AL',
      typeClass: 'annual',
      status: 'Approved',
      reason: 'Family vacation.',
      approval: { approver: 'Farah Rahman', status: 'Approved', comments: 'Approved as requested.', approvedDate: '2026-10-10' }
    },
    {
      employeeId: 'EMP-0042',
      startDate: '2026-10-16',
      endDate: '2026-10-16',
      leaveType: 'Emergency Leave',
      code: 'EL',
      typeClass: 'emergency',
      status: 'Pending',
      reason: 'Urgent family matter.',
      approval: { approver: 'Pending assignment', status: 'Pending', comments: 'Awaiting manager review.', approvedDate: null }
    }
  ];

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
  }

  setMonth(month: number): void {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      month - 1,
      1
    );
    this.generateCalendar();
  }

  setYear(year: number): void {
    this.currentDate = new Date(
      year,
      this.currentDate.getMonth(),
      1
    );
    this.generateCalendar();
  }

  goToToday(): void {
    this.currentDate = new Date();
    this.generateCalendar();
  }
}

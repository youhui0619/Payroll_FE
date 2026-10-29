import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialImports, MaterialProviders } from '../../../../shared/material-imports';
import { RouterLink } from '@angular/router';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { CalendarDay, LeaveRecord } from '../../../../models/leave.model';
import type { EmployeeRecord } from '../../../../models/employee.model';
import { employees as employeeDirectory } from '../../../../data/employees';
import { attendanceRecords } from '../../../../data/attendance';
import { getEmployeeLeaveBalances } from '../../../../data/leave-balances';

@Component({
  selector: 'app-overview',
  imports: [...MaterialImports, CommonModule, FormsModule, ReactiveFormsModule, ToastrModule, RouterLink],
  providers: [...MaterialProviders, ToastrService],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent {
  readonly leaveColumnOptions = [
    { id: 'annual', label: 'Annual Leave' },
    { id: 'medical', label: 'Medical Leave' }
  ];
  selectedLeaveColumns = this.leaveColumnOptions.map(column => column.id);
  
  constructor() {
    this.generateCalendar();
  }
  currentDate = new Date();

  days: CalendarDay[] = [];
  monthLabel = '';

  employees: EmployeeRecord[] = employeeDirectory;
  selectedDepartments: string[] = [];

  get departments(): string[] {
    return [...new Set(this.employees.map(employee => employee.department).filter(Boolean))]
      .sort((first, second) => first.localeCompare(second));
  }

  get filteredEmployees(): EmployeeRecord[] {
    if (this.selectedDepartments.length === 0) return this.employees;
    return this.employees.filter(employee => this.selectedDepartments.includes(employee.department));
  }

  leaveBalancesFor(employeeId: string) {
    return getEmployeeLeaveBalances(employeeId);
  }

  leaveBalanceClass(balance: number, entitled: number): string {
    if (entitled <= 0) return 'bg-light-primary text-primary';

    const remainingRatio = balance / entitled;
    if (remainingRatio < 0.3) return 'bg-light-danger text-danger';
    if (remainingRatio < 0.7) return 'bg-light-warning text-warning';
    return 'bg-light-primary text-primary';
  }

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

  getInitials(name: string): string {
    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map(part => part.charAt(0).toUpperCase())
      .join('');
  }

  isLeaveColumnVisible(id: string): boolean {
    return this.selectedLeaveColumns.includes(id);
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

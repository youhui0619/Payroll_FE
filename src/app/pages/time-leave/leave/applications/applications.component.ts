import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialImports, MaterialProviders } from '../../../../shared/material-imports';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { DropzoneComponent } from '../../../../shared/dropzone/dropzone.component';
import { FullCalendarModule, CalendarOptions } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/angular/daygrid';
import interactionPlugin from '@fullcalendar/angular/interaction';
import themePlugin from "@fullcalendar/angular/themes/monarch"; 
import type { LeaveApplication } from '../../../../models/leave.model';
import { employees, getEmployee } from '../../../../data/employees';
import { leaveApplications } from '../../../../data/leave-applications';
import { LeaveDetailDialogComponent, type LeaveDialogData } from '../../../../shared/dialog/leave-detail-dialog/leave-detail-dialog.component';

@Component({
  selector: 'app-applications',
  imports: [...MaterialImports, CommonModule, FormsModule, ReactiveFormsModule, ToastrModule, FullCalendarModule, LeaveDetailDialogComponent],
  providers: [...MaterialProviders, ToastrService],
  templateUrl: './applications.component.html',
  styleUrl: './applications.component.scss'
})
export class ApplicationsComponent {

  selectedLeave: LeaveDialogData | null = null;
  private activeLeave: LeaveApplication | null = null;
  readonly employee = getEmployee('EMP-0042');
  readonly leaveRequests: LeaveApplication[] = leaveApplications;
  selectedDepartments: string[] = [];
  selectedStartDate: Date | null = null;
  selectedEndDate: Date | null = null;

  get departments(): string[] {
    return [...new Set(employees.map(employee => employee.department).filter(Boolean))]
      .sort((first, second) => first.localeCompare(second));
  }

  get filteredLeaveRequests(): LeaveApplication[] {
    return this.leaveRequests.filter(leave => {
      if (this.selectedDepartments.length && !this.selectedDepartments.includes(getEmployee(leave.employeeId).department)) {
        return false;
      }

      const [startText, endText = startText] = leave.dateRange.split('~').map(value => value.trim());
      const leaveStart = this.parseLeaveDate(startText);
      const leaveEnd = this.parseLeaveDate(endText);
      if (!leaveStart || !leaveEnd) return false;

      return (!this.selectedStartDate || leaveEnd >= this.startOfDay(this.selectedStartDate))
        && (!this.selectedEndDate || leaveStart <= this.endOfDay(this.selectedEndDate));
    });
  }

  onStartDateChange(date: Date | null): void {
    this.selectedStartDate = date;
  }

  onEndDateChange(date: Date | null): void {
    this.selectedEndDate = date;
  }

  clearFilters(): void {
    this.selectedDepartments = [];
    this.selectedStartDate = null;
    this.selectedEndDate = null;
  }

  private parseLeaveDate(dateText: string): Date | null {
    const [day, month, year] = dateText.split('/').map(Number);
    if (!day || !month || !year) return null;
    return new Date(year, month - 1, day);
  }

  private startOfDay(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  private endOfDay(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
  }

  leaveCount(leaveType: string): number {
    return this.leaveRequests.filter(leave => leave.leaveType === leaveType).length;
  }

  employeeName(employeeId: string): string {
    return getEmployee(employeeId).employeeName;
  }

  openLeaveDetails(leave: LeaveApplication): void {
    this.activeLeave = leave;
    const employee = getEmployee(leave.employeeId);
    this.selectedLeave = {
      title: leave.leaveType,
      subtitle: `Leave request · ${leave.reference}`,
      status: leave.status,
      statusClass: leave.statusClass,
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
        reference: leave.reference,
        date: leave.dateRange,
        duration: leave.daysTaken,
        reason: leave.reason
      },
      approval: leave.approval
    };
  }

  closeLeaveDialog(): void {
    this.selectedLeave = null;
    this.activeLeave = null;
  }

  decideLeave(decision: { status: 'Approved' | 'Rejected'; comment: string }): void {
    const leave = this.activeLeave;
    if (!leave) return;

    const decisionDate = new Date();
    const date = [
      decisionDate.getFullYear(),
      String(decisionDate.getMonth() + 1).padStart(2, '0'),
      String(decisionDate.getDate()).padStart(2, '0')
    ].join('-');

    leave.status = decision.status;
    leave.statusClass = decision.status === 'Approved' ? 'bg-light-primary text-primary' : 'bg-light-danger text-danger';
    leave.approval.status = decision.status;
    leave.approval.comments = decision.comment || 'Rejected during leave review.';
    leave.approval.approvedDate = date;

    const pendingIndex = this.leaveRequests.indexOf(leave);
    if (pendingIndex >= 0) this.leaveRequests.splice(pendingIndex, 1);
    this.closeLeaveDialog();
  }

}

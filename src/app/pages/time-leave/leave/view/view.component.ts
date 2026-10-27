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
import { LeaveApplication } from '../../../../models/leave.model';
import { getEmployee } from '../../../../data/employees';
import { LeaveDetailDialogComponent, type LeaveDialogData } from '../../../../shared/dialog/leave-detail-dialog/leave-detail-dialog.component';

@Component({
  selector: 'app-view',
  imports: [...MaterialImports, CommonModule, FormsModule, ReactiveFormsModule, ToastrModule, FullCalendarModule, LeaveDetailDialogComponent],
  providers: [...MaterialProviders, ToastrService],
  templateUrl: './view.component.html',
  styleUrl: './view.component.scss'
})
export class ViewComponent {
  selectedLeave: LeaveDialogData | null = null;
  readonly employee = getEmployee('EMP-0042');

  readonly leaveRequests: LeaveApplication[] = [
    {
      employeeId: 'EMP-0042',
      leaveType: 'Annual Leave',
      reference: 'AL-2026-001',
      dateRange: '19/2/2026 ~ 20/2/2026',
      daysTaken: '2 Days',
      status: 'Approved',
      statusClass: 'bg-light-primary text-primary',
      iconClass: 'text-danger bg-light-danger',
      reason: 'Taking a short family vacation.',
      approval: { approver: 'Farah Rahman', status: 'Approved', comments: 'Approved as requested.', approvedDate: '2026-02-10' }
    },
    {
      employeeId: 'EMP-0042',
      leaveType: 'Medical Leave',
      reference: 'ML-2026-004',
      dateRange: '12/3/2026 ~ 12/3/2026',
      daysTaken: '2 Days',
      status: 'Pending',
      statusClass: 'bg-light-info text-info',
      iconClass: 'text-warning bg-light-warning',
      reason: 'Medical appointment and recovery.',
      approval: { approver: 'Farah Rahman', status: 'Pending', comments: 'Awaiting supporting document.', approvedDate: null }
    },
    {
      employeeId: 'EMP-0042',
      leaveType: 'Unpaid Leave',
      reference: 'UL-2026-006',
      dateRange: '7/4/2026 ~ 8/4/2026',
      daysTaken: '2 Days',
      status: 'Rejected',
      statusClass: 'bg-light-danger text-danger',
      iconClass: 'text-info bg-light-info',
      reason: 'Personal matters.',
      approval: { approver: 'Farah Rahman', status: 'Rejected', comments: 'Insufficient leave balance for the requested dates.', approvedDate: null }
    }
  ];

  openLeaveDetails(leave: LeaveApplication): void {
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
}

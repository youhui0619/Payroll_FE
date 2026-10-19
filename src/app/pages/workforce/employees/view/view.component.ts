import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialImports, MaterialProviders } from '../../../../shared/material-imports';
import { RouterLink } from '@angular/router';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { DropzoneComponent } from '../../../../shared/dropzone/dropzone.component';
import { FullCalendarModule, CalendarOptions } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/angular/daygrid';
import interactionPlugin from '@fullcalendar/angular/interaction';
import themePlugin from "@fullcalendar/angular/themes/monarch"; 
import { getEmployee } from '../../../../data/employees';
import { attendanceRecords } from '../../../../data/attendance';
import { getPublicHolidaysForLocation } from '../../../../data/public-holidays';
import { LeaveApplication } from '../../../../models/leave.model';
import { LeaveDetailDialogComponent, type LeaveDialogData } from '../../../../shared/dialog/leave-detail-dialog/leave-detail-dialog.component';

function dayAfter(dateString: string): string {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day + 1)).toISOString().slice(0, 10);
}

const leaveEventColors: Record<string, { background: string; text: string }> = {
  annual: { background: '#fef5e9', text: '#fbba03' },
  medical: { background: '#faeff3', text: '#fd4855' },
  emergency: { background: '#fef3c7', text: '#92400e' },
  unpaid: { background: '#efeaf9', text: '#6b32fe' }
};

@Component({
  selector: 'app-view',
  imports: [...MaterialImports, CommonModule, FormsModule, ReactiveFormsModule, ToastrModule, FullCalendarModule, LeaveDetailDialogComponent],
  providers: [...MaterialProviders, ToastrService],
  templateUrl: './view.component.html',
  styleUrl: './view.component.scss'
})
export class ViewComponent {
  readonly employee = getEmployee('EMP-0042');
  readonly claimRequests = [
    {
      type: 'Meals',
      reference: 'Client lunch',
      date: '12/10/2026',
      amount: 120,
      status: 'Pending',
      statusClass: 'bg-light-info text-info'
    },
    {
      type: 'Transportation',
      reference: 'Client site visit',
      date: '15/10/2026',
      amount: 45,
      status: 'Pending',
      statusClass: 'bg-light-info text-info'
    }
  ];
  readonly leaveRequests: LeaveApplication[] = attendanceRecords
    .filter(record => record.employeeId === this.employee.employeeId)
    .map(record => {
      const days = Math.round((new Date(`${record.endDate}T00:00:00`).getTime() - new Date(`${record.startDate}T00:00:00`).getTime()) / 86400000) + 1;
      const formatDate = (date: string) => {
        const [year, month, day] = date.split('-');
        return `${day}/${month}/${year}`;
      };
      const statusClass = record.status === 'Approved'
        ? 'bg-light-primary text-primary'
        : record.status === 'Rejected'
          ? 'bg-light-danger text-danger'
          : 'bg-light-info text-info';
      const iconClass = record.typeClass === 'medical'
        ? 'text-warning bg-light-warning'
        : record.typeClass === 'emergency'
          ? 'text-info bg-light-info'
          : record.typeClass === 'unpaid'
            ? 'text-secondary bg-light-secondary'
            : 'text-danger bg-light-danger';

      return {
        employeeId: record.employeeId,
        leaveType: record.leaveType,
        reference: `${record.code}-${record.startDate}`,
        dateRange: record.startDate === record.endDate
          ? formatDate(record.startDate)
          : `${formatDate(record.startDate)} ~ ${formatDate(record.endDate)}`,
        daysTaken: `${days} ${days === 1 ? 'Day' : 'Days'}`,
        status: record.status,
        statusClass,
        iconClass,
        reason: record.reason,
        approval: record.approval
      };
    });
  readonly attendanceEvents = attendanceRecords
    .filter(record => record.employeeId === this.employee.employeeId && record.status === 'Approved')
    .map(record => {
      const colors = leaveEventColors[record.typeClass] ?? leaveEventColors['annual'];
      return {
        id: `${record.code}-${record.startDate}`,
        title: `${record.code} · ${record.leaveType}`,
        start: record.startDate,
        end: dayAfter(record.endDate),
        allDay: true,
        classNames: [`leave-${record.typeClass}`],
        backgroundColor: colors.background,
        borderColor: colors.background,
        textColor: colors.text,
        extendedProps: {
          status: record.status,
          reason: record.reason,
          typeClass: record.typeClass
        }
      };
    });
  readonly publicHolidayEvents = getPublicHolidaysForLocation(`${this.employee.address} ${this.employee.workLocation}`).map(holiday => ({
    id: holiday.id,
    title: holiday.name,
    start: holiday.date,
    allDay: true,
    classNames: ['public-holiday-event'],
    backgroundColor: '#e8f5e9',
    borderColor: '#e8f5e9',
    textColor: '#2e7d32',
    extendedProps: { eventType: 'public-holiday', holidayName: holiday.name }
  }));
  selectedTabIndex = 0;
  selectedLeave: LeaveDialogData | null = null;

  get isWideTab(): boolean {
    return this.selectedTabIndex >= 3 && this.selectedTabIndex <= 5;
  }

  leaveCount(leaveType: string): number {
    return this.leaveRequests.filter(leave => leave.leaveType === leaveType).length;
  }

  claimCount(status: string): number {
    return this.claimRequests.filter(claim => claim.status === status).length;
  }

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin, themePlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth',
    },
    eventColor: '#087F78',
    fixedWeekCount: false,
    height: 'auto',
    contentHeight: 'auto',
    events: [...this.attendanceEvents, ...this.publicHolidayEvents],
    eventClick: (info) => this.openLeaveDetails(info.event.id),
    eventDidMount: (info) => {
      if (info.event.extendedProps['eventType'] === 'public-holiday') {
        info.el.title = info.event.extendedProps['holidayName'];
        return;
      }
      const colors = leaveEventColors[info.event.extendedProps['typeClass']] ?? leaveEventColors['annual'];
      info.el.style.setProperty('--fc-event-bg-color', colors.background, 'important');
      info.el.style.setProperty('--fc-event-border-color', colors.background, 'important');
      info.el.style.setProperty('--fc-event-text-color', colors.text, 'important');
      info.el.style.setProperty('background-color', colors.background, 'important');
      info.el.style.setProperty('border-color', colors.background, 'important');
      info.el.style.setProperty('color', colors.text, 'important');
      info.el.querySelectorAll<HTMLElement>('*').forEach(element => {
        element.style.setProperty('color', colors.text, 'important');
      });
    },
  };

  openLeaveDetails(recordCode: string): void {
    const record = attendanceRecords.find(item =>
      item.employeeId === this.employee.employeeId && `${item.code}-${item.startDate}` === recordCode && item.status === 'Approved'
    );
    if (!record) return;

    const start = new Date(`${record.startDate}T00:00:00`);
    const end = new Date(`${record.endDate}T00:00:00`);
    const durationDays = Math.round((end.getTime() - start.getTime()) / 86400000) + 1;
    const date = record.startDate === record.endDate
      ? record.startDate
      : `${record.startDate} - ${record.endDate}`;

    this.selectedLeave = {
      title: 'Leave details',
      subtitle: `Leave request · ${record.code}`,
      status: record.status,
      statusClass: 'bg-light-primary text-primary',
      employeeInformation: {
        name: this.employee.employeeName,
        employeeId: this.employee.employeeId,
        department: this.employee.department,
        position: this.employee.position,
        contactNo: this.employee.contactNo,
        nricNo: this.employee.nricPassportNo
      },
      details: {
        leaveType: record.leaveType,
        reference: record.code,
        date,
        duration: `${durationDays} ${durationDays === 1 ? 'day' : 'days'}`,
        reason: record.reason
      },
      approval: record.approval
    };
  }

  openLeaveRequestDetails(leave: LeaveApplication): void {
    this.selectedLeave = {
      title: leave.leaveType,
      subtitle: `Leave request · ${leave.reference}`,
      status: leave.status,
      statusClass: leave.statusClass,
      employeeInformation: {
        name: this.employee.employeeName,
        employeeId: this.employee.employeeId,
        department: this.employee.department,
        position: this.employee.position,
        contactNo: this.employee.contactNo,
        nricNo: this.employee.nricPassportNo
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

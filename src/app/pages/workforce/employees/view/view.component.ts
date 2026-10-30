import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MaterialImports, MaterialProviders } from '../../../../shared/material-imports';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FullCalendarModule, CalendarOptions } from '@fullcalendar/angular';
import type { EventInput } from 'fullcalendar';
import dayGridPlugin from '@fullcalendar/angular/daygrid';
import interactionPlugin from '@fullcalendar/angular/interaction';
import themePlugin from "@fullcalendar/angular/themes/monarch"; 
import { getEmployee } from '../../../../data/employees';
import { attendanceRecords } from '../../../../data/attendance';
import { getPublicHolidaysForLocation } from '../../../../data/public-holidays';
import { getEmployeeLeaveBalances } from '../../../../data/leave-balances';
import { leavePolicies } from '../../../../data/leave-policies';
import { claims } from '../../../../data/claims';
import { getClaimTypeLabel } from '../../../../data/claim-types';
import { commissionIncentiveSettings } from '../../../../data/commission-incentive-settings';
import { LeaveApplication } from '../../../../models/leave.model';
import type { ClaimStatus, ClaimType, ExpenseClaimRecord } from '../../../../models/claim.model';
import type { LeavePolicy } from '../../../../models/leave-policy.model';
import type { EmployeeRecord } from '../../../../models/employee.model';
import type {
  CommissionCalculationFrequency,
  CommissionCalculationMethod,
  CommissionIncentiveSetting
} from '../../../../models/commission-incentive-setting.model';
import { LeaveDetailDialogComponent, type LeaveDialogData } from '../../../../shared/dialog/leave-detail-dialog/leave-detail-dialog.component';
import { ClaimDetailDialogComponent } from '../../../../shared/dialog/claim-detail-dialog/claim-detail-dialog.component';
import { NavigationService } from '../../../../services/navigation.service';

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
  imports: [...MaterialImports, CommonModule, FullCalendarModule, RouterLink, LeaveDetailDialogComponent, ClaimDetailDialogComponent],
  providers: [...MaterialProviders],
  templateUrl: './view.component.html',
  styleUrl: './view.component.scss'
})
export class ViewComponent {

  private navigation = inject(NavigationService);
  
  employee!: EmployeeRecord;
  readonly leaveYear = new Date().getFullYear();
  readonly leavePolicies: LeavePolicy[] = leavePolicies.filter(policy => policy.status === 'ACTIVE');
  readonly commissionIncentiveSettings = commissionIncentiveSettings;
  employeeLeaveBalances!: ReturnType<typeof getEmployeeLeaveBalances>;
  claimRequests: ExpenseClaimRecord[] = [];
  leaveRequests: LeaveApplication[] = [];
  attendanceEvents: EventInput[] = [];
  publicHolidayEvents: EventInput[] = [];
  selectedTabIndex = 0;
  selectedLeave: LeaveDialogData | null = null;
  selectedClaim: ExpenseClaimRecord | null = null;

  get selectedCommissionSettings(): CommissionIncentiveSetting[] {
    const selectedCodes = new Set(this.employee?.commissionSettingCodes ?? []);
    return this.commissionIncentiveSettings.filter(setting => selectedCodes.has(setting.code));
  }

  hasStatutoryEntitlement(code: string): boolean {
    return (this.employee?.statutoryEntitlementCodes ?? []).includes(code);
  }

  commissionCalculationLabel(setting: CommissionIncentiveSetting): string {
    if (setting.calculationMethod === 'PERCENTAGE_OF_REVENUE') return `${setting.rate ?? 0}% of revenue`;
    if (setting.calculationMethod === 'PERCENTAGE_OF_PROFIT') return `${setting.rate ?? 0}% of profit`;
    if (['PERCENTAGE_OF_SALES', 'TIERED_RATE'].includes(setting.calculationMethod)) return `${setting.rate ?? 0}% of sales`;
    return `MYR ${setting.amount ?? 0}`;
  }

  commissionCalculationMethodLabel(method: CommissionCalculationMethod): string {
    const labels: Record<CommissionCalculationMethod, string> = {
      PERCENTAGE_OF_SALES: 'Percentage of Sales',
      PERCENTAGE_OF_REVENUE: 'Percentage of Revenue',
      PERCENTAGE_OF_PROFIT: 'Percentage of Profit',
      FIXED_PER_TRANSACTION: 'Fixed Amount per Transaction',
      TIERED_RATE: 'Tiered Rate',
      TARGET_BASED: 'Target-Based Calculation',
      FIXED_AMOUNT: 'Fixed Amount'
    };
    return labels[method];
  }

  commissionCalculationFrequencyLabel(frequency: CommissionCalculationFrequency): string {
    const labels: Record<CommissionCalculationFrequency, string> = {
      PER_TRANSACTION: 'Per transaction',
      WEEKLY: 'Weekly',
      BIWEEKLY: 'Every two weeks',
      MONTHLY: 'Monthly',
      QUARTERLY: 'Quarterly'
    };
    return labels[frequency];
  }

  constructor(route: ActivatedRoute) {
    route.paramMap.pipe(takeUntilDestroyed()).subscribe(params => {
      const employeeId = params.get('id');
      if (employeeId) this.loadEmployeeData(employeeId);
    });
  }

  private loadEmployeeData(employeeId: string): void {
    this.employee = getEmployee(employeeId);
    this.employeeLeaveBalances = getEmployeeLeaveBalances(employeeId);
    this.claimRequests = claims.filter(claim => claim.employeeId === employeeId);
    this.leaveRequests = attendanceRecords
      .filter(record => record.employeeId === employeeId)
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
    this.attendanceEvents = attendanceRecords
      .filter(record => record.employeeId === employeeId && record.status === 'Approved')
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
    this.publicHolidayEvents = getPublicHolidaysForLocation(`${this.employee.address} ${this.employee.workLocation}`).map(holiday => ({
      id: holiday.id,
      title: holiday.name,
      start: holiday.startDate,
      end: dayAfter(holiday.endDate),
      allDay: true,
      classNames: ['public-holiday-event', 'bg-light-info', 'text-info'],
      backgroundColor: 'var(--light-info)',
      borderColor: 'var(--light-info)',
      textColor: 'var(--info)',
      extendedProps: { eventType: 'public-holiday', holidayName: holiday.name }
    }));
    this.selectedLeave = null;
    this.selectedClaim = null;
    this.calendarOptions = {
      ...this.calendarOptions,
      events: [...this.attendanceEvents, ...this.publicHolidayEvents]
    };
  }

  get isWideTab(): boolean {
    return this.selectedTabIndex >= 3 && this.selectedTabIndex <= 5;
  }

  leaveCount(leaveType: string): number {
    return this.leaveRequests.filter(leave => leave.leaveType === leaveType).length;
  }

  leaveEntitlementLabel(policy: LeavePolicy): string {
    if (policy.entitlementCalculationMethod === 'SERVICE') {
      return policy.serviceEntitlementTiers
        .filter(tier => tier.serviceFrom !== null && tier.daysPerYear !== null)
        .map(tier => {
          const serviceRange = tier.serviceTo === null
            ? `${tier.serviceFrom}+ years`
            : `${tier.serviceFrom}–${tier.serviceTo} years`;
          return `${serviceRange}: ${tier.daysPerYear} ${this.leaveUnit(policy)} per year`;
        })
        .join(' · ') || 'Based on length of service';
    }

    const actualEntitlement = this.policyBalance(policy)?.entitled;
    if (actualEntitlement !== undefined) {
      return `${actualEntitlement} ${this.leaveUnit(policy)} per year`;
    }

    return policy.entitlementGrantMethod === 'MANUAL'
      ? 'Set manually'
      : `${policy.defaultEntitlement ?? 0} ${this.leaveUnit(policy)} per year`;
  }

  leaveBalanceLabel(policy: LeavePolicy): string {
    const balance = this.policyBalance(policy)?.balance;
    if (balance !== undefined) return `${balance} ${this.leaveUnit(policy)}`;
    if (policy.entitlementGrantMethod === 'MANUAL' && policy.defaultEntitlement === null) return '—';
    return `${policy.defaultEntitlement ?? 0} ${this.leaveUnit(policy)}`;
  }

  goBack() {
    return this.navigation.back('/workforce/employees/list');
  }

  private policyBalance(policy: LeavePolicy): { entitled: number; balance: number } | undefined {
    if (policy.leaveCode === 'AL') return this.employeeLeaveBalances.annual;
    if (policy.leaveCode === 'ML') return this.employeeLeaveBalances.medical;
    return undefined;
  }

  private leaveUnit(policy: LeavePolicy): string {
    return policy.entitlementUnit === 'DAILY' ? 'days' : 'hours';
  }

  claimCount(status: ClaimStatus): number {
    return this.claimRequests.filter(claim => claim.status === status).length;
  }

  claimTypeLabel(type: ClaimType): string {
    return getClaimTypeLabel(type);
  }

  claimStatusClass(status: ClaimStatus): string {
    switch (status) {
      case 'Pending': return 'bg-light-warning text-warning';
      case 'Approved': return 'bg-light-primary text-primary';
      case 'Rejected': return 'bg-light-danger text-danger';
      case 'Paid': return 'bg-light-success text-success';
    }
  }

  openClaimDetails(claim: ExpenseClaimRecord): void {
    this.selectedClaim = claim;
  }

  decideClaim(decision: { status: 'Approved' | 'Rejected'; comment: string }): void {
    const claim = this.selectedClaim;
    if (!claim) return;

    const today = new Date();
    claim.status = decision.status;
    claim.approval = {
      approver: 'Sarah Lim',
      approvedDate: [today.getFullYear(), String(today.getMonth() + 1).padStart(2, '0'), String(today.getDate()).padStart(2, '0')].join('-'),
      comments: decision.comment || 'Rejected during claim review.'
    };
    this.selectedClaim = null;
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
        info.el.style.setProperty('--fc-event-bg-color', 'var(--light-info)', 'important');
        info.el.style.setProperty('--fc-event-border-color', 'var(--light-info)', 'important');
        info.el.style.setProperty('--fc-event-text-color', 'var(--info)', 'important');
        info.el.style.setProperty('background-color', 'var(--light-info)', 'important');
        info.el.style.setProperty('border-color', 'var(--light-info)', 'important');
        info.el.style.setProperty('color', 'var(--info)', 'important');
        info.el.querySelectorAll<HTMLElement>('*').forEach(element => {
          element.style.setProperty('color', 'var(--info)', 'important');
        });
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

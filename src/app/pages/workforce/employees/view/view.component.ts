import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, NgZone } from '@angular/core';
import { MaterialImports, MaterialProviders } from '../../../../shared/material-imports';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FullCalendarModule, CalendarOptions } from '@fullcalendar/angular';
import type { EventInput } from 'fullcalendar';
import dayGridPlugin from '@fullcalendar/angular/daygrid';
import interactionPlugin from '@fullcalendar/angular/interaction';
import themePlugin from "@fullcalendar/angular/themes/monarch";
import { attendanceRecords } from '../../../../data/attendance/attendance.data';
// import { getEmployeeLeaveBalances } from '../../../../data/leave/leave-balances.data';
import { leavePolicies } from '../../../../data/leave/leave-policies.data';
import { commissionIncentiveSettings } from '../../../../data/commission/commission-incentive-settings.data';
import { LeaveApplication } from '../../../../models/leave/leave.model';
import type { ClaimStatus, ClaimType, ExpenseClaimRecord } from '../../../../models/claims/claim.model';
import type { LeavePolicy } from '../../../../models/leave/leave-policy.model';
import type { Employee, EmployeeOverview, OvertimeCalculationBasis } from '../../../../models/workforce/employee.model';
import type { WorkLocation } from '../../../../models/workforce/work-location.model';
import type { OvertimeRequestRecord, OvertimeStatus, OvertimeType } from '../../../../models/overtime/overtime.model';
import type {
  CommissionCalculationFrequency,
  CommissionCalculationMethod,
  CommissionIncentiveSetting
} from '../../../../models/commission/commission-incentive-setting.model';
import { LeaveDetailDialogComponent, type LeaveDialogData } from '../../../../shared/dialog/leave-detail-dialog/leave-detail-dialog.component';
import { ClaimDetailDialogComponent } from '../../../../shared/dialog/claim-detail-dialog/claim-detail-dialog.component';
import { OvertimeDetailDialogComponent } from '../../../../shared/dialog/overtime-detail-dialog/overtime-detail-dialog.component';
import { EmployeesApiService } from '../../../../services/api/employees.service';
import { ToastService } from '../../../../shared/components/toast/toast.service';
import { AlertService } from '../../../../shared/components/alert/alert.service';

type EmployeeLocation = Pick<WorkLocation, 'id' | 'code' | 'name'> & Partial<Omit<WorkLocation, 'id' | 'code' | 'name'>>;
type EmployeeView = Omit<Employee, 'department' | 'position'>
  & Pick<EmployeeOverview, 'department' | 'position'>
  & { location: EmployeeLocation | null };

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
  imports: [...MaterialImports, CommonModule, FullCalendarModule, RouterLink, LeaveDetailDialogComponent, ClaimDetailDialogComponent, OvertimeDetailDialogComponent],
  providers: [...MaterialProviders, EmployeesApiService],
  templateUrl: './view.component.html',
  styleUrl: './view.component.scss'
})
export class ViewComponent {
 constructor(
    private router: Router,
    private route: ActivatedRoute,
    private apiService: EmployeesApiService,
    private toastService: ToastService,
    private alertService: AlertService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}


  employee!: EmployeeView;
  employeeCalendar: any;
  attendance: any;
  attendanceSummary: any;
  params: any;
  id: any = '';
  year = new Date().getFullYear();
  month = new Date().getMonth();
  employeeLeaveBalances:any;
  leaveApllicationList: LeaveApplication[] = [];

  leavePolicies: LeavePolicy[] = leavePolicies.filter(policy => policy.active);
  commissionIncentiveSettings = commissionIncentiveSettings;
  claimRequests: ExpenseClaimRecord[] = [];
  overtimeHistory: OvertimeRequestRecord[] = [];
  leaveRequests: LeaveApplication[] = [];
  attendanceEvents: EventInput[] = [];
  publicHolidayEvents: EventInput[] = [];
  selectedTabIndex = 0;
  selectedLeave: LeaveDialogData | null = null;
  selectedClaim: ExpenseClaimRecord | null = null;

  ngOnInit() {
    this.params = {
      year: this.year,
      month: this.month + 1
      }
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      if (this.id) {
        this.getEmployee(this.id);
      } else {
        console.error("🚨 No ID found in route!");
      }
    });
  }

  getEmployee(id: any){
    console.log(id)
    this.apiService.getEmployee(id).subscribe({
      next: (response) => {
        this.employee = response.data;
        this.getEmployeeAttendanceCalendar(id, this.params)
        this.getEmployeeLeaveBalances(id, this.year);
        // this.getEmployeeLeaveApplications(id)
        console.log("employee:", this.employee);
      },
      error: (error) => {
        this.toastService.show({
          title: error.error.code,
          message: error.error.message,
          icon: 'danger'
        });
      },
    });
  }

  getEmployeeAttendanceCalendar(id: any, param: any){
    this.apiService.getEmployeeAttendanceCalendar(id, param).subscribe({
      next: (response) => {
        this.employeeCalendar = response.data;
        const calendarEmployee = response.data?.employees?.[0];
        this.attendance = calendarEmployee?.days ?? [];
        this.attendanceSummary = calendarEmployee?.summary ?? null;
        this.attendanceEvents = this.toAttendanceEvents(this.attendance);
        this.calendarOptions = {
          ...this.calendarOptions,
          events: [...this.attendanceEvents, ...this.publicHolidayEvents]
        };
        this.cdr.markForCheck();
        console.log("getEmployeeAttendanceCalendar:", response.data);
        console.log("attendance:", this.attendance);
        console.log("attendanceSummary:", this.attendanceSummary);
      },
      error: (error) => {
        this.toastService.show({
          title: error.error.code,
          message: error.error.message,
          icon: 'danger'
        });
      },
    });
  }

  private toAttendanceEvents(days: any[]): EventInput[] {
    const events: EventInput[] = [];

    for (const day of days ?? []) {
      const date = day?.date;
      if (!date) continue;

      if (day.attendance) {
        const attendance = day.attendance;
        const clockIn = attendance.clockIn ? this.formatCalendarTime(attendance.clockIn) : null;
        const clockOut = attendance.clockOut ? this.formatCalendarTime(attendance.clockOut) : null;
        const timeRange = [clockIn, clockOut].filter(Boolean).join(' – ');
        events.push({
          id: `attendance-${attendance.id ?? date}`,
          title: timeRange ? `Attendance · ${timeRange}` : 'Attendance recorded',
          start: date,
          allDay: true,
          backgroundColor: '#e8f3ff',
          borderColor: '#e8f3ff',
          textColor: '#1769aa',
          extendedProps: {
            eventType: 'attendance',
            remark: attendance.remark,
            hoursWorkedMinutes: attendance.hoursWorkedMinutes,
            durationMinutes: attendance.durationMinutes
          }
        });
      }

      if (day.leave) {
        const leave = day.leave;
        const leaveType = `${leave.policyCode ?? ''} ${leave.policyName ?? ''}`.toLowerCase();
        const typeClass = leaveType.includes('medical') || leave.policyCode === 'ML'
          ? 'medical'
          : leaveType.includes('emergency') || leave.policyCode === 'EL'
            ? 'emergency'
            : leaveType.includes('unpaid') || leave.policyCode === 'UL'
              ? 'unpaid'
              : 'annual';
        const colors = leaveEventColors[typeClass];
        events.push({
          id: `${leave.id ?? date}`,
          title: `${leave.policyName ?? 'Leave'}`,
          start: date,
          allDay: true,
          classNames: [`leave-${typeClass}`, 'bg-light-secondary', 'text-secondary'],
          backgroundColor: 'var(--light-secondary)',
          borderColor: 'var(--light-secondary)',
          textColor: 'var(--secondary)',
          extendedProps: { eventType: 'leave', typeClass, ...leave }
        });
      }

      if (day.overtime) {
        const overtime = day.overtime;
        events.push({
          id: `${overtime.id ?? date}`,
          title: `Overtime · ${this.overtimeDuration(overtime.netMinutes ?? 0)}`,
          start: date,
          allDay: true,
          classNames: ['bg-light-warning', 'text-warning'],
          backgroundColor: 'var(--light-warning)',
          borderColor: 'var(--light-warning)',
          textColor: 'var(--warning)',
          extendedProps: { eventType: 'overtime', ...overtime }
        });
      }

      if (day.holiday) {
        const holiday = day.holiday;
        events.push({
          id: `holiday-${holiday.id ?? date}`,
          title: holiday.name ?? holiday.holidayName ?? 'Public Holiday',
          start: date,
          allDay: true,
          backgroundColor: '#e6f6f5',
          borderColor: '#e6f6f5',
          textColor: '#087f78',
          extendedProps: { eventType: 'public-holiday', holidayName: holiday.name ?? holiday.holidayName }
        });
      }
    }

    return events;
  }

  private formatCalendarTime(value: string): string {
    return new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  onCalendarDatesSet(dateInfo: { view: { currentStart: Date } }) {
    const displayedDate = dateInfo.view.currentStart;
    const year = displayedDate.getFullYear();
    const month = displayedDate.getMonth() + 1;

    if (this.params?.year === year && this.params?.month === month) return;

    this.year = year;
    this.month = month - 1;
    this.params = { year, month };

    if (this.id) {
     return this.getEmployeeAttendanceCalendar(this.id, this.params);
    }
  }

  getEmployeeLeaveBalances(id: any, year: any){
    console.log(id)
    this.apiService.getEmployeeLeaveBalances(id, year).subscribe({
      next: (response) => {
        this.employeeLeaveBalances = response.data;
        console.log("employeeLeaveBalances:", response.data);
      },
      error: (error) => {
        this.toastService.show({
          title: error.error.code,
          message: error.error.message,
          icon: 'danger'
        });
      },
    });
  }


  // getEmployeeLeaveApplications(id: any){
  //   console.log(id)
  //   this.apiService.getEmployeeLeaveApplications(id).subscribe({
  //     next: (response) => {
  //       this.leaveApllicationList = response.data;
  //       console.log("leaveApllicationList:", this.leaveApllicationList);
  //     },
  //     error: (error) => {
  //       this.toastService.show({
  //         title: error.error.code,
  //         message: error.error.message,
  //         icon: 'danger'
  //       });
  //     },
  //   });
  // }


  initials(name: string | null | undefined) {
    return (name ?? '').split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]).join('').toUpperCase();
  }






  selectedOvertimeRequest: OvertimeRequestRecord | null = null;

  get selectedCommissionSettings(): CommissionIncentiveSetting[] {
    const selectedCodes = new Set(this.employee?.commissionSettingCodes ?? []);
    return this.commissionIncentiveSettings.filter(setting => selectedCodes.has(setting.code));
  }

  hasStatutoryEntitlement(code: string): boolean {
    return (this.employee?.statutoryEntitlementCodes ?? []).includes(code);
  }

  overtimeCalculationBasisLabel(basis: OvertimeCalculationBasis): string {
    const labels: Record<OvertimeCalculationBasis, string> = {
      HOURLY_RATE: 'Hourly rate',
      DAILY_RATE_CONVERTED: 'Daily rate converted to hourly',
      MONTHLY_SALARY_CONVERTED: 'Monthly salary converted to hourly'
    };
    return labels[basis];
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

  // private loadEmployeeData(employeeId: string): void {
  //   this.if = employeeId;
  //   this.apiService.getEmployee(employeeId).subscribe({
  //     next: response => {
  //       const data = response?.data ?? response;
  //       console.log("data", response.data)
  //       if (!data || typeof data !== 'object') {
  //         this.showEmployeeLoadError('Employee data was not returned by the server.');
  //         return;
  //       }

  //       const name = data.employeeName ?? data.name ?? '';
  //       const address = data.address ?? [
  //         data.addressLine1,
  //         data.addressLine2,
  //         data.city,
  //         data.postcode,
  //         data.state,
  //         data.country
  //       ].filter(Boolean).join(', ');
  //       const emergencyContactAddress = data.emergencyContactAddress ?? [
  //         data.emergencyContactAddressLine1,
  //         data.emergencyContactAddressLine2,
  //         data.emergencyContactCity,
  //         data.emergencyContactPostcode,
  //         data.emergencyContactState,
  //         data.emergencyContactCountry
  //       ].filter(Boolean).join(', ');
  //       const department = typeof data.department === 'object'
  //         ? data.department?.name ?? ''
  //         : data.department ?? data.departmentName ?? '';
  //       const position = typeof data.position === 'object'
  //         ? data.position?.title ?? data.position?.name ?? ''
  //         : data.position ?? data.positionTitle ?? '';
  //       const reportingManager = typeof data.reportingManager === 'object'
  //         ? data.reportingManager?.name ?? ''
  //         : data.reportingManager ?? data.manager?.name ?? '';

  //       this.if = data.id ?? data._id ?? employeeId;
  //       this.employee = {
  //         ...data,
  //         employeeId: data.employeeNo ?? data.employeeId ?? data.id ?? employeeId,
  //         employeeName: name,
  //         initials: data.initials ?? name.split(/\s+/).filter(Boolean).slice(0, 2).map((part: string) => part[0]).join('').toUpperCase(),
  //         nricPassportNo: data.nricPassportNo ?? '',
  //         dateOfBirth: data.dateOfBirth ?? '',
  //         tin: data.tin ?? '',
  //         email: data.email ?? '',
  //         contactNo: data.contactNo ?? '',
  //         address,
  //         department,
  //         position,
  //         reportingManager,
  //         workLocationId: data.workLocationId ?? data.locationId ?? data.workLocation?.id ?? '',
  //         joinedDate: data.joinedDate ?? '',
  //         basicSalary: data.basicSalary ?? 0,
  //         salaryType: data.salaryType ?? '',
  //         paymentMethod: data.paymentMethod ?? '',
  //         bank: data.bank ?? '',
  //         bankAccount: data.bankAccount ?? '',
  //         epfEmployeeNo: data.epfEmployeeNo ?? '',
  //         epfEmployerNo: data.epfEmployerNo ?? '',
  //         epfRate: data.epfRate ?? '',
  //         kwspNo: data.kwspNo ?? data.epfEmployeeNo ?? '',
  //         socsoNo: data.socsoNo ?? '',
  //         contributionCategory: data.contributionCategory ?? '',
  //         eisStatus: data.eisStatus ?? '',
  //         hrdRegisterNo: data.hrdRegisterNo ?? '',
  //         statutoryEntitlementCodes: data.statutoryEntitlementCodes ?? [],
  //         commissionSettingCodes: data.commissionSettingCodes ?? [],
  //         includeOvertime: data.includeOvertime ?? false,
  //         overtimeCalculationBasis: data.overtimeCalculationBasis ?? 'HOURLY_RATE',
  //         overtimeHourlyRate: data.overtimeHourlyRate ?? null,
  //         emergencyContactName: data.emergencyContactName ?? data.contactName ?? '',
  //         emergencyContactRelationship: data.emergencyContactRelationship ?? data.relationship ?? '',
  //         emergencyContactNo: data.emergencyContactNo ?? '',
  //         emergencyContactAddress
  //       } as Employee;
  //       this.loadEmployeeRelatedData(employeeId);
  //     },
  //     error: error => this.showEmployeeLoadError(
  //       error?.error?.message ?? 'Unable to load employee details.'
  //     )
  //   });
  // }

  // private showEmployeeLoadError(message: string) {
  //   this.toastService.show({
  //     title: 'Unable to load employee',
  //     message,
  //     icon: 'danger'
  //   });
  //   return this.navigation.back('/workforce/employees/list');
  // }

  // private loadEmployeeRelatedData(employeeId: string): void {
  //   this.employeeLeaveBalances = getEmployeeLeaveBalances(employeeId);
  //   this.claimRequests = claims.filter(claim => claim.employeeId === employeeId);
  //   this.overtimeHistory = overtimeRequests.filter(request => request.employeeId === employeeId);
  //   this.leaveRequests = attendanceRecords
  //     .filter(record => record.employeeId === employeeId)
  //     .map(record => {
  //     const days = Math.round((new Date(`${record.endDate}T00:00:00`).getTime() - new Date(`${record.startDate}T00:00:00`).getTime()) / 86400000) + 1;
  //     const formatDate = (date: string) => {
  //       const [year, month, day] = date.split('-');
  //       return `${day}/${month}/${year}`;
  //     };
  //     const statusClass = record.status === 'Approved'
  //       ? 'bg-light-primary text-primary'
  //       : record.status === 'Rejected'
  //         ? 'bg-light-danger text-danger'
  //         : 'bg-light-info text-info';
  //     const iconClass = record.typeClass === 'medical'
  //       ? 'text-warning bg-light-warning'
  //       : record.typeClass === 'emergency'
  //         ? 'text-info bg-light-info'
  //         : record.typeClass === 'unpaid'
  //           ? 'text-secondary bg-light-secondary'
  //           : 'text-danger bg-light-danger';

  //     return {
  //       employeeId: record.employeeId,
  //       leaveType: record.leaveType,
  //       reference: `${record.code}-${record.startDate}`,
  //       dateRange: record.startDate === record.endDate
  //         ? formatDate(record.startDate)
  //         : `${formatDate(record.startDate)} ~ ${formatDate(record.endDate)}`,
  //       daysTaken: `${days} ${days === 1 ? 'Day' : 'Days'}`,
  //       status: record.status,
  //       statusClass,
  //       iconClass,
  //       reason: record.reason,
  //       approval: record.approval
  //     };
  //   });
  //   this.attendanceEvents = attendanceRecords
  //     .filter(record => record.employeeId === employeeId && record.status === 'Approved')
  //     .map(record => {
  //     const colors = leaveEventColors[record.typeClass] ?? leaveEventColors['annual'];
  //     return {
  //       id: `${record.code}-${record.startDate}`,
  //       title: `${record.code} · ${record.leaveType}`,
  //       start: record.startDate,
  //       end: dayAfter(record.endDate),
  //       allDay: true,
  //       classNames: [`leave-${record.typeClass}`],
  //       backgroundColor: colors.background,
  //       borderColor: colors.background,
  //       textColor: colors.text,
  //       extendedProps: {
  //         status: record.status,
  //         reason: record.reason,
  //         typeClass: record.typeClass
  //       }
  //     };
  //   });
  //   const workLocation = this.selectedWorkLocation;
  //   this.publicHolidayEvents = []
  //   // getPublicHolidaysForLocation(`${this.employee.address} ${workLocation?.city ?? ''} ${workLocation?.state ?? ''}`).map(holiday => ({
  //   //   id: holiday.id,
  //   //   title: holiday.name,
  //   //   start: formatDate(holiday.startDate),
  //   //   end: formatDate(holiday.endDate),
  //   //   allDay: true,
  //   //   classNames: ['public-holiday-event', 'bg-light-info', 'text-info'],
  //   //   backgroundColor: 'var(--light-info)',
  //   //   borderColor: 'var(--light-info)',
  //   //   textColor: 'var(--info)',
  //   //   extendedProps: { eventType: 'public-holiday', holidayName: holiday.name }
  //   // }));
  //   this.selectedLeave = null;
  //   this.selectedClaim = null;
  //   this.calendarOptions = {
  //     ...this.calendarOptions,
  //     events: [...this.attendanceEvents, ...this.publicHolidayEvents]
  //   };
  // }

  get isWideTab(): boolean {
    return this.selectedTabIndex >= 3 && (this.selectedTabIndex <= 5 || (this.employee?.includeOvertime === true && this.selectedTabIndex === 6));
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
    return this.router.navigate(['/workforce/employees/list']);
  }

  private policyBalance(policy: LeavePolicy): { entitled: number; balance: number } | undefined {
    if (policy.code === 'AL') return this.employeeLeaveBalances?.annual;
    if (policy.code === 'ML') return this.employeeLeaveBalances?.medical;
    return undefined;
  }

  private leaveUnit(policy: LeavePolicy): string {
    return policy.entitlementUnit === 'DAILY' ? 'days' : 'hours';
  }

  claimCount(status: ClaimStatus): number {
    return this.claimRequests.filter(claim => claim.status === status).length;
  }

  overtimeCount(status: OvertimeStatus): number {
    return this.overtimeHistory.filter(request => request.status === status).length;
  }

  get overtimeNetMinutes(): number {
    return this.overtimeHistory.reduce((total, request) => total + request.netMinutes, 0);
  }

  overtimeTypeLabel(type: OvertimeType): string {
    const labels: Record<OvertimeType, string> = {
      NORMAL_WORKING_DAY: 'Normal Working Day',
      REST_DAY: 'Rest Day',
      PUBLIC_HOLIDAY: 'Public Holiday'
    };
    return labels[type];
  }

  overtimeDuration(totalMinutes: number): string {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours && minutes) return `${hours}h ${minutes}m`;
    if (hours) return `${hours}h`;
    return `${minutes}m`;
  }

  overtimeStatusClass(status: OvertimeStatus): string {
    switch (status) {
      case 'Pending': return 'bg-light-warning text-warning';
      case 'Approved': return 'bg-light-primary text-primary';
      case 'Rejected': return 'bg-light-danger text-danger';
      case 'Paid': return 'bg-light-success text-success';
    }
  }

  openOvertimeDetails(request: OvertimeRequestRecord): void {
    this.selectedOvertimeRequest = request;
  }

  closeOvertimeDetails(): void {
    this.selectedOvertimeRequest = null;
  }

  claimTypeLabel(type: ClaimType): string {
    return ""
    // return getClaimTypeLabel(type);
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
    datesSet: (dateInfo) => this.ngZone.run(() => this.onCalendarDatesSet(dateInfo)),
    events: [...this.attendanceEvents, ...this.publicHolidayEvents],
    eventClick: (info) => this.openCalendarEventDetails(info.event.extendedProps, info.event.startStr),
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
      if (info.event.extendedProps['eventType'] === 'overtime') {
        info.el.classList.add('bg-light-warning', 'text-warning');
        info.el.style.setProperty('--fc-event-bg-color', 'var(--light-warning)', 'important');
        info.el.style.setProperty('--fc-event-border-color', 'var(--light-warning)', 'important');
        info.el.style.setProperty('--fc-event-text-color', 'var(--warning)', 'important');
        info.el.style.setProperty('background-color', 'var(--light-warning)', 'important');
        info.el.style.setProperty('border-color', 'var(--light-warning)', 'important');
        info.el.style.setProperty('color', 'var(--warning)', 'important');
        info.el.querySelectorAll<HTMLElement>('*').forEach(element => {
          element.style.setProperty('color', 'var(--warning)', 'important');
        });
        return;
      }
      if (info.event.extendedProps['eventType'] === 'leave') {
        info.el.classList.add('bg-light-secondary', 'text-secondary');
        info.el.style.setProperty('--fc-event-bg-color', 'var(--light-secondary)', 'important');
        info.el.style.setProperty('--fc-event-border-color', 'var(--light-secondary)', 'important');
        info.el.style.setProperty('--fc-event-text-color', 'var(--secondary)', 'important');
        info.el.style.setProperty('background-color', 'var(--light-secondary)', 'important');
        info.el.style.setProperty('border-color', 'var(--light-secondary)', 'important');
        info.el.style.setProperty('color', 'var(--secondary)', 'important');
        info.el.querySelectorAll<HTMLElement>('*').forEach(element => {
          element.style.setProperty('color', 'var(--secondary)', 'important');
        });
        return;
      }
      if (info.event.extendedProps['eventType'] === 'attendance') {
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
      item.employeeId === this.employee.employeeNo && `${item.code}-${item.startDate}` === recordCode && item.status === 'Approved'
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
        name: this.employee.name,
        employeeId: this.employee.employeeNo,
        department: this.employee.department.name,
        position: this.employee.position.title,
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

  private openCalendarEventDetails(event: Record<string, any>, date: string): void {
    if (event['eventType'] === 'leave') {
      const status = this.displayStatus(event['status']);
      const approval = event['approval'] ?? {};
      this.selectedLeave = {
        title: event['policyName'] ?? 'Leave details',
        subtitle: `Leave request · ${event['reference'] ?? event['id'] ?? ''}`,
        status,
        statusClass: this.leaveStatusClass(status),
        employeeInformation: {
          name: this.employee.name,
          employeeId: this.employee.employeeNo,
          department: this.employee.department?.name ?? '',
          position: this.employee.position?.title ?? '',
          contactNo: this.employee.contactNo ?? '',
          nricNo: this.employee.nricPassportNo ?? ''
        },
        details: {
          leaveType: event['policyName'] ?? 'Leave',
          reference: event['reference'] ?? event['id'] ?? '',
          date,
          duration: event['days'] ? `${event['days']} days` : '1 day',
          reason: event['reason'] ?? ''
        },
        approval: {
          approver: approval['approver'] ?? '—',
          status,
          comments: approval['comments'] ?? '',
          approvedDate: approval['approvedDate'] ?? null
        }
      };
      return;
    }

    if (event['eventType'] === 'overtime') {
      const status = this.displayStatus(event['status']);
      const approval = event['approval'] ?? {};
      this.selectedOvertimeRequest = {
        id: event['id'] ?? `overtime-${date}`,
        requestDate: event['requestDate'] ?? date,
        overtimeDate: date,
        employeeId: this.employee.employeeNo,
        employeeName: this.employee.name,
        departmentId: this.employee.department?.id ?? '',
        departmentName: this.employee.department?.name ?? '',
        overtimeType: event['overtimeType'] ?? 'NORMAL_WORKING_DAY',
        startTime: event['startTime'] ?? (event['attendance']?.clockIn ? this.formatCalendarTime(event['attendance'].clockIn) : '—'),
        endTime: event['endTime'] ?? (event['attendance']?.clockOut ? this.formatCalendarTime(event['attendance'].clockOut) : '—'),
        totalMinutes: event['totalMinutes'] ?? event['netMinutes'] ?? 0,
        breakDurationMinutes: event['breakDurationMinutes'] ?? 0,
        netMinutes: event['netMinutes'] ?? 0,
        hourlyRateMultiplier: event['hourlyRateMultiplier'] ?? 1,
        earningCode: event['earningCode'] ?? '—',
        description: event['description'] ?? '',
        supportingDocuments: event['supportingDocuments'] ?? [],
        status: status as OvertimeStatus,
        submittedAt: event['submittedAt'] ?? `${date}T00:00:00`,
        approval: {
          approver: approval['approver'] ?? '—',
          approvedDate: approval['approvedDate'] ?? null,
          comments: approval['comments'] ?? ''
        }
      };
    }
  }

  private displayStatus(status: string | undefined): string {
    if (!status) return 'Pending';
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  }

  private leaveStatusClass(status: string): string {
    switch (status) {
      case 'Approved': return 'bg-light-primary text-primary';
      case 'Rejected': return 'bg-light-danger text-danger';
      case 'Pending': return 'bg-light-warning text-warning';
      default: return 'bg-light-secondary text-secondary';
    }
  }

  openLeaveRequestDetails(leave: LeaveApplication): void {
    this.selectedLeave = {
      title: leave.leaveType,
      subtitle: `Leave request · ${leave.reference}`,
      status: leave.status,
      statusClass: leave.statusClass,
      employeeInformation: {
        name: this.employee.name,
        employeeId: this.employee.employeeNo,
        department: this.employee.department.name,
        position: this.employee.position.title,
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

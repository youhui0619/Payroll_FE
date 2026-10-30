
import { Component, NgZone, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UntypedFormGroup, UntypedFormBuilder, Validators, ValidatorFn, FormControl, ValidationErrors, UntypedFormArray, NgForm, FormGroup, FormArray,FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox'
import {MatRadioModule} from '@angular/material/radio';
import {provideNativeDateAdapter} from '@angular/material/core';
import {DateRange, MatDatepickerModule} from '@angular/material/datepicker';
import { TablerIconComponent } from '@tabler/icons-angular';

import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatTabsModule} from '@angular/material/tabs';
import { MatDropzone } from '@ngx-dropzone/material';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatStepperModule } from '@angular/material/stepper';
import { FileInputDirective } from '@ngx-dropzone/cdk';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgApexchartsModule } from 'ng-apexcharts';
import type { ChartOptions } from '../../shared/chart-imports';
import { payrollList } from '../../data/payroll';
import { leaveApplications } from '../../data/leave-applications';
import { attendanceRecords } from '../../data/attendance';
import { employees } from '../../data/employees';
import type { LeaveApplication, LeaveRecord } from '../../models/leave.model';
import { LeaveDetailDialogComponent, type LeaveDialogData } from '../../shared/dialog/leave-detail-dialog/leave-detail-dialog.component';

interface DashboardCalendarCell {
  date: Date;
  dateKey: string;
  inCurrentMonth: boolean;
  isToday: boolean;
}

interface DashboardLeaveEntry {
  record: LeaveRecord;
  employeeName: string;
  application: LeaveApplication | null;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TablerIconComponent, LeaveDetailDialogComponent, MatFormFieldModule, MatSelectModule, MatInputModule, MatButtonModule, MatCheckboxModule, MatRadioModule, MatDatepickerModule, MatSort, MatPaginator, MatMenuModule, MatSlideToggleModule, MatTabsModule, MatAutocompleteModule, NgxDropzoneModule, MatStepperModule, NgApexchartsModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  selectedLeave: LeaveDialogData | null = null;
  private readonly ngZone = inject(NgZone);
  calendarMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  selectedCalendarDateKey = this.toDateKey(new Date());
  readonly weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  readonly years = Array.from({ length: 5 }, (_, index) => new Date().getFullYear() - index);
  readonly teamOverview = [...employees.reduce((departments, employee) => {
    departments.set(employee.department, (departments.get(employee.department) ?? 0) + 1);
    return departments;
  }, new Map<string, number>())]
    .map(([department, count]) => ({ department, count }))
    .sort((a, b) => b.count - a.count || a.department.localeCompare(b.department));
  readonly teamOverviewColors = [
    'var(--primary)',
    'var(--secondary)',
    'var(--info)',
    'var(--success)',
    'var(--warning)',
    'var(--danger)',
    'var(--dark)',
  ];
  readonly payrollTotals = payrollList.reduce((totals, row) => {
    totals.grossPay += row.grossPay;
    totals.epf += row.epf.total;
    totals.socso += row.socso.total;
    totals.eis += row.eis.total;
    totals.netPay += row.netPay;
    return totals;
  }, { grossPay: 0, epf: 0, socso: 0, eis: 0, netPay: 0 });
  // The current mock payroll data has no month field, so use a sample monthly trend until history is available.
  private readonly monthlyPayrollFactors = [0.92, 0.96, 0.98, 1.01, 1.04, 1.02, 1.06, 1.03, 1.08, 1, 1.05, 1.1];
  private readonly monthlyNetPay = this.monthlyAmounts(this.payrollTotals.netPay);
  private readonly monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  private readonly currentMonthIndex = new Date().getMonth();
  selectedMonthNetPay: number | null = this.monthlyNetPay[this.currentMonthIndex];
  selectedPayrollMonth: string | null = this.monthLabels[this.currentMonthIndex];

  private monthlyAmounts(amount: number): number[] {
    return this.monthlyPayrollFactors.map(factor => Math.round(amount * factor * 100) / 100);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-MY', {
      style: 'currency',
      currency: 'MYR',
      minimumFractionDigits: 2,
    }).format(amount);
  }

  get calendarMonthLabel(): string {
    return new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(this.calendarMonth);
  }

  get selectedCalendarDateLabel(): string {
    const [year, month, day] = this.selectedCalendarDateKey.split('-').map(Number);
    return new Intl.DateTimeFormat('en-MY', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    }).format(new Date(year, month - 1, day));
  }

  get calendarCells(): DashboardCalendarCell[] {
    const firstOfMonth = new Date(this.calendarMonth.getFullYear(), this.calendarMonth.getMonth(), 1);
    const gridStart = new Date(firstOfMonth);
    gridStart.setDate(firstOfMonth.getDate() - firstOfMonth.getDay());
    const todayKey = this.toDateKey(new Date());

    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(gridStart);
      date.setDate(gridStart.getDate() + index);
      return {
        date,
        dateKey: this.toDateKey(date),
        inCurrentMonth: date.getMonth() === this.calendarMonth.getMonth(),
        isToday: this.toDateKey(date) === todayKey,
      };
    });
  }

  get monthLeaveEntries() {
    const monthStart = this.toDateKey(this.calendarMonth);
    const monthEnd = this.toDateKey(new Date(this.calendarMonth.getFullYear(), this.calendarMonth.getMonth() + 1, 0));
    return attendanceRecords.filter(record => record.status === 'Approved')
      .map((record): DashboardLeaveEntry | null => {
      const employee = employees.find(item => item.employeeId === record.employeeId);
      if (!employee) return null;
      const application = leaveApplications.find(item => {
        if (item.status !== 'Approved' || item.employeeId !== record.employeeId || item.leaveType !== record.leaveType) return false;
        const [startText, endText] = item.dateRange.split('~').map(value => value.trim());
        return this.toDateKeyFromLeaveDate(startText) === record.startDate
          && this.toDateKeyFromLeaveDate(endText || startText) === record.endDate;
      });
      return { record, employeeName: employee.employeeName, application: application ?? null };
    })
      .filter((entry): entry is DashboardLeaveEntry => entry !== null)
      .filter(({ record }) => record.startDate <= monthEnd && record.endDate >= monthStart)
      .sort((a, b) => a.record.startDate.localeCompare(b.record.startDate));
  }

  get selectedDayLeaveEntries() {
    return this.monthLeaveEntries.filter(entry =>
      entry.record.startDate <= this.selectedCalendarDateKey
      && entry.record.endDate >= this.selectedCalendarDateKey
    );
  }

  leaveMarkersForDate(dateKey: string): string[] {
    return [...new Set(this.monthLeaveEntries
      .filter(entry => dateKey >= entry.record.startDate && dateKey <= entry.record.endDate)
      .map(entry => this.leaveTypeClass(entry.record.leaveType)))];
  }

  changeCalendarMonth(offset: number): void {
    this.calendarMonth = new Date(this.calendarMonth.getFullYear(), this.calendarMonth.getMonth() + offset, 1);
    this.selectedCalendarDateKey = this.toDateKey(this.calendarMonth);
  }

  goToToday(): void {
    const today = new Date();
    this.calendarMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    this.selectedCalendarDateKey = this.toDateKey(today);
  }

  leaveTypeClass(leaveType: string): string {
    const type = leaveType.toLowerCase();
    if (type.includes('annual')) return 'annual';
    if (type.includes('medical')) return 'medical';
    if (type.includes('unpaid')) return 'unpaid';
    return 'other';
  }

  formatDateRange(startDateKey: string, endDateKey: string): string {
    const formatDate = (dateKey: string) => {
      const [year, month, day] = dateKey.split('-').map(Number);
      return new Intl.DateTimeFormat('en-MY', { day: 'numeric', month: 'short' })
        .format(new Date(year, month - 1, day));
    };
    if (startDateKey === endDateKey) return formatDate(startDateKey);
    return `${formatDate(startDateKey)} – ${formatDate(endDateKey)}`;
  }

  private toDateKey(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private toDateKeyFromLeaveDate(dateText: string): string {
    const [day, month, year] = dateText.split('/').map(Number);
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  openLeaveDetails(entry: DashboardLeaveEntry): void {
    const employee = employees.find(item => item.employeeId === entry.record.employeeId);
    if (!employee) return;

    const application = entry.application;
    const dateRange = application?.dateRange ?? this.formatDateRange(entry.record.startDate, entry.record.endDate);
    const reference = application?.reference ?? `${entry.record.code}-${entry.record.startDate.replaceAll('-', '')}`;
    this.selectedLeave = {
      title: entry.record.leaveType,
      subtitle: `Leave request · ${reference}`,
      status: entry.record.status,
      statusClass: entry.record.status === 'Approved' ? 'bg-light-primary text-primary' : 'bg-light-info text-info',
      employeeInformation: {
        name: employee.employeeName,
        employeeId: employee.employeeId,
        department: employee.department,
        position: employee.position,
        contactNo: employee.contactNo,
        nricNo: employee.nricPassportNo,
      },
      details: {
        leaveType: entry.record.leaveType,
        reference,
        date: dateRange,
        duration: application?.daysTaken ?? (entry.record.startDate === entry.record.endDate ? '1 Day' : this.formatDateRange(entry.record.startDate, entry.record.endDate)),
        reason: application?.reason ?? entry.record.reason,
      },
      approval: entry.record.approval,
    };
  }

  public chartOptions: Partial<ChartOptions> = {
    series: [
      { name: 'Gross Pay', data: this.monthlyAmounts(this.payrollTotals.grossPay) },
      { name: 'Total EPF Contribution', data: this.monthlyAmounts(this.payrollTotals.epf) },
      { name: 'Total SOCSO Contribution', data: this.monthlyAmounts(this.payrollTotals.socso) },
      { name: 'Total EIS Contribution', data: this.monthlyAmounts(this.payrollTotals.eis) },
    ],
    chart: {
        fontFamily: 'Inter ,sans-serif',
        foreColor: '#a1aab2',
        height: 300,
        type: 'bar',
        stacked: true,
        events: {
          dataPointSelection: (_event, _chart, options) => {
            const monthIndex = options?.dataPointIndex;
            if (monthIndex !== undefined && monthIndex >= 0 && monthIndex < this.monthLabels.length) {
              this.ngZone.run(() => {
                this.selectedPayrollMonth = this.monthLabels[monthIndex];
                this.selectedMonthNetPay = this.monthlyNetPay[monthIndex];
              });
            }
          },
        },
        toolbar: {
        show: false,
      },
    },
    colors: ['var(--primary)', 'var(--light-primary)', 'var(--warning)', 'var(--info)'],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '48%',
        borderRadius: 3,
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: this.monthLabels,
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      min: 0,
      forceNiceScale: true,
      show: false,
    },
    grid: { borderColor: 'var(--light-disabled)', strokeDashArray: 4 },
    legend: { show: false },
    fill: { opacity: 1 },
    tooltip: { shared: true, intersect: false,
      y: {
        formatter: (value) => `RM ${new Intl.NumberFormat('en-MY', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(value ?? 0)}`,
      },
    },
    responsive: [
      {
        breakpoint: 576,
        options: {
          chart: { height: 280 },
          plotOptions: { bar: { columnWidth: '60%' } },
          yaxis: { title: { text: undefined } },
        },
      },
    ],
  };

  public doughnutChartOptions: Partial<ChartOptions> = {
  series: this.teamOverview.map(item => item.count),
  labels: this.teamOverview.map(item => item.department),
  chart: {
  id: 'donut-chart',
  type: 'donut',
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  foreColor: '#adb0bb',
  },
  dataLabels: {
  enabled: false,
  },
  plotOptions: {
  pie: {
  donut: {
  size: '70px',
  },
  },
  },
  legend: {
    show: false,
  },
  colors: this.teamOverviewColors,
  tooltip: {
    fillSeriesColor: false,
  },
  };
}

import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialImports, MaterialProviders } from '../../../shared/material-imports';
import { RouterLink } from '@angular/router';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { payrollList } from '../../../data/payroll';
import { payslips } from '../../../data/payslips';
import { PayrollDetailDialogComponent } from '../../../shared/dialog/payroll-detail-dialog/payroll-detail-dialog.component';

@Component({
  selector: 'app-overview',
  imports: [...MaterialImports, CommonModule, FormsModule, ReactiveFormsModule, ToastrModule, RouterLink, PayrollDetailDialogComponent],
  providers: [...MaterialProviders, ToastrService],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent {
  payrollList = payrollList;
  selectedPayroll: typeof payrollList[number] | null = null;
  readonly columnOptions = [
    { id: 'employee', label: 'Employee' },
    { id: 'employeeId', label: 'Employee ID' },
    { id: 'basicPay', label: 'Basic Pay' },
    { id: 'overtime', label: 'Overtime' },
    { id: 'deduction', label: 'Deduction' },
    { id: 'allowance', label: 'Allowance' },
    { id: 'bonus', label: 'Bonus' },
    { id: 'commission', label: 'Commission' },
    { id: 'grossPay', label: 'Gross pay' },
    { id: 'epfEmployer', label: 'EPF · 13%/12%' },
    { id: 'epfEmployee', label: 'EPF · 11%' },
    { id: 'epfTotal', label: 'EPF · Total' },
    { id: 'socsoEmployer', label: 'SOCSO · Employer' },
    { id: 'socsoEmployee', label: 'SOCSO · Employee' },
    { id: 'socsoLindungan', label: 'SOCSO · Lindungan 24 jam' },
    { id: 'socsoTotal', label: 'SOCSO · Total' },
    { id: 'eisEmployer', label: 'EIS · Employer' },
    { id: 'eisEmployee', label: 'EIS · Employee' },
    { id: 'eisTotal', label: 'EIS · Total' },
    { id: 'pcb', label: 'PCB' },
    { id: 'advance', label: 'Advance' },
    { id: 'netPay', label: 'Net pay' },
    { id: 'status', label: 'Status' },
    { id: 'action', label: 'Action' }
  ];
  readonly requiredColumns = ['employee', 'employeeId', 'status', 'action'];
  selectedColumns = this.columnOptions.map(column => column.id);

  isRequiredColumn(id: string): boolean {
    return this.requiredColumns.includes(id);
  }

  ensureRequiredColumns(selected: string[]): void {
    this.selectedColumns = Array.from(new Set([...selected, ...this.requiredColumns]));
  }

  isColumnVisible(id: string): boolean {
    return this.selectedColumns.includes(id);
  }

  visibleGroupCount(group: 'epf' | 'socso' | 'eis'): number {
    const columns = {
      epf: ['epfEmployer', 'epfEmployee', 'epfTotal'],
      socso: ['socsoEmployer', 'socsoEmployee', 'socsoLindungan', 'socsoTotal'],
      eis: ['eisEmployer', 'eisEmployee', 'eisTotal']
    };
    return columns[group].filter(column => this.isColumnVisible(column)).length;
  }

  groupGridColumns(group: 'epf' | 'socso' | 'eis'): string {
    const groupColumns = {
      epf: ['epfEmployer', 'epfEmployee', 'epfTotal'],
      socso: ['socsoEmployer', 'socsoEmployee', 'socsoLindungan', 'socsoTotal'],
      eis: ['eisEmployer', 'eisEmployee', 'eisTotal']
    };
    return groupColumns[group]
      .filter(column => this.isColumnVisible(column))
      .map(column => `${this.columnWidth(column)}px`)
      .join(' ');
  }

  columnWidth(id: string): number {
    const widths: Record<string, number> = {
      employee: 240,
      employeeId: 130,
      basicPay: 110,
      overtime: 110,
      deduction: 110,
      allowance: 110,
      bonus: 110,
      commission: 120,
      grossPay: 120,
      epfEmployer: 110,
      epfEmployee: 110,
      epfTotal: 110,
      socsoEmployer: 110,
      socsoEmployee: 110,
      socsoLindungan: 170,
      socsoTotal: 110,
      eisEmployer: 110,
      eisEmployee: 110,
      eisTotal: 110,
      pcb: 100,
      advance: 100,
      netPay: 120,
      status: 100,
      action: 100
    };
    return widths[id] ?? 110;
  }

  openPayrollDetails(row: typeof payrollList[number]): void {
    this.selectedPayroll = row;
  }

  commissionAmount(employeeId: string): number {
    return payslips.find(payslip => payslip.employeeId === employeeId)?.earnings.commissions ?? 0;
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

  get totals() {
    return this.payrollList.reduce((totals, row) => {
      totals.basicPay += row.basicPay;
      totals.overtime += row.overtime;
      totals.deduction += row.deduction;
      totals.allowance += row.allowance;
      totals.bonus += row.bonus;
      totals.commission += this.commissionAmount(row.employeeId);
      totals.grossPay += row.grossPay;
      totals.epf.employer += row.epf.employer;
      totals.epf.employee += row.epf.employee;
      totals.epf.total += row.epf.total;
      totals.socso.employer += row.socso.employer;
      totals.socso.employee += row.socso.employee;
      totals.socso.lindungan24Jam += row.socso.lindungan24Jam;
      totals.socso.total += row.socso.total;
      totals.eis.employer += row.eis.employer;
      totals.eis.employee += row.eis.employee;
      totals.eis.total += row.eis.total;
      totals.pcb += row.pcb;
      totals.advance += row.advance;
      totals.netPay += row.netPay;
      return totals;
    }, {
      basicPay: 0,
      overtime: 0,
      deduction: 0,
      allowance: 0,
      bonus: 0,
      commission: 0,
      grossPay: 0,
      epf: { employer: 0, employee: 0, total: 0 },
      socso: { employer: 0, employee: 0, lindungan24Jam: 0, total: 0 },
      eis: { employer: 0, employee: 0, total: 0 },
      pcb: 0,
      advance: 0,
      netPay: 0
    });
  }
}

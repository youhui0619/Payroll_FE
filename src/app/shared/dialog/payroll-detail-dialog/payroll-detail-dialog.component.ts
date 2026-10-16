import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { payrollList } from '../../../data/payroll';
import { MaterialImports, MaterialProviders } from '../../material-imports';
import { payslips } from '../../../data/payslips';
import type { Payslip } from '../../../models/payslip.model';

@Component({
  selector: 'app-payroll-detail-dialog',
  standalone: true,
  imports: [...MaterialImports, CommonModule],
  providers: [...MaterialProviders],
  templateUrl: './payroll-detail-dialog.component.html',
  styleUrl: './payroll-detail-dialog.component.scss'
})
export class PayrollDetailDialogComponent {
  @Input({ required: true }) payroll!: typeof payrollList[number];
  @Output() closed = new EventEmitter<void>();

  get payslip(): Payslip {
    const record = payslips.find(item => item.employeeId === this.payroll.employeeId);
    if (!record) {
      throw new Error(`Payslip data not found for employee ${this.payroll.employeeId}`);
    }
    return record;
  }

  close(): void {
    this.closed.emit();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close();
  }
}

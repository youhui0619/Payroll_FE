import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { getEmployee } from '../../../data/employees';
import type { CommissionPayrollRecord } from '../../../models/commission-payroll-record.model';
import { MaterialImports, MaterialProviders } from '../../material-imports';

@Component({
  selector: 'app-commission-detail-dialog',
  standalone: true,
  imports: [...MaterialImports, CommonModule, FormsModule],
  providers: [...MaterialProviders],
  templateUrl: './commission-detail-dialog.component.html',
  styleUrl: './commission-detail-dialog.component.scss'
})
export class CommissionDetailDialogComponent {
  @Input({ required: true }) record!: CommissionPayrollRecord;
  @Input() showDecisionActions = false;
  @Output() closed = new EventEmitter<void>();
  @Output() decisionMade = new EventEmitter<{ status: 'Approved' | 'Rejected'; comment: string }>();
  decisionComment = '';

  get employee() {
    return getEmployee(this.record.employeeId);
  }

  get statusLabel(): string {
    const labels: Record<CommissionPayrollRecord['status'], string> = {
      PENDING_APPROVAL: 'Pending approval',
      READY_FOR_PAYROLL: 'Ready for payroll',
      PAID: 'Paid'
    };
    return labels[this.record.status];
  }

  get statusClass(): string {
    const classes: Record<CommissionPayrollRecord['status'], string> = {
      PENDING_APPROVAL: 'bg-light-warning text-warning',
      READY_FOR_PAYROLL: 'bg-light-primary text-primary',
      PAID: 'bg-light-success text-success'
    };
    return classes[this.record.status];
  }

  get calculationMethodLabel(): string {
    const labels: Record<CommissionPayrollRecord['calculationMethod'], string> = {
      PERCENTAGE_OF_SALES: 'Percentage of sales',
      PERCENTAGE_OF_REVENUE: 'Percentage of revenue',
      PERCENTAGE_OF_PROFIT: 'Percentage of profit',
      FIXED_PER_TRANSACTION: 'Fixed amount per transaction',
      TIERED_RATE: 'Tiered rate',
      TARGET_BASED: 'Target based',
      FIXED_AMOUNT: 'Fixed amount'
    };
    return labels[this.record.calculationMethod];
  }

  get frequencyLabel(): string {
    const labels: Record<CommissionPayrollRecord['calculationFrequency'], string> = {
      PER_TRANSACTION: 'Per transaction',
      WEEKLY: 'Weekly',
      BIWEEKLY: 'Biweekly',
      MONTHLY: 'Monthly',
      QUARTERLY: 'Quarterly'
    };
    return labels[this.record.calculationFrequency];
  }

  get payoutTimingLabel(): string {
    const labels: Record<CommissionPayrollRecord['payoutTiming'], string> = {
      CURRENT_PAYROLL: 'Current payroll cycle',
      NEXT_PAYROLL: 'Next payroll cycle',
      SEPARATE_PAYOUT: 'Separate payout'
    };
    return labels[this.record.payoutTiming];
  }

  get calculationBasisLabel(): string {
    if (this.record.calculationBasis === null) return '-';
    const basis = `MYR ${this.record.calculationBasis.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    return this.record.rate === null ? basis : `${basis} × ${this.record.rate}%`;
  }

  close(): void {
    this.closed.emit();
  }

  decide(status: 'Approved' | 'Rejected'): void {
    this.decisionMade.emit({ status, comment: this.decisionComment.trim() });
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close();
  }
}

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { commissionPayrollRecords } from '../../../../data/commission-payroll-records';
import type { CommissionPayrollRecord } from '../../../../models/commission-payroll-record.model';
import { MaterialImports, MaterialProviders } from '../../../../shared/material-imports';
import { CommissionDetailDialogComponent } from '../../../../shared/dialog/commission-detail-dialog/commission-detail-dialog.component';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [...MaterialImports, CommonModule, RouterLink, CommissionDetailDialogComponent],
  providers: [...MaterialProviders],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent {
  readonly commissionRecords = commissionPayrollRecords;
  selectedRecord: CommissionPayrollRecord | null = null;

  openDetails(record: CommissionPayrollRecord): void {
    this.selectedRecord = record;
  }

  closeDetails(): void {
    this.selectedRecord = null;
  }

  get pendingApprovalCount(): number {
    return this.commissionRecords.filter(record => record.status === 'PENDING_APPROVAL').length;
  }

  get totalCommissionAmount(): number {
    return this.commissionRecords.reduce((total, record) => total + record.amount, 0);
  }

  calculationSummary(record: CommissionPayrollRecord): string {
    if (record.calculationBasis !== null && record.rate !== null) {
      return `MYR ${record.calculationBasis.toLocaleString()} × ${record.rate}%`;
    }
    return record.calculationMethod === 'FIXED_PER_TRANSACTION'
      ? `MYR ${record.amount.toLocaleString()} per transaction`
      : `MYR ${record.amount.toLocaleString()}`;
  }

  payoutTimingLabel(timing: CommissionPayrollRecord['payoutTiming']): string {
    const labels: Record<CommissionPayrollRecord['payoutTiming'], string> = {
      CURRENT_PAYROLL: 'Current payroll cycle',
      NEXT_PAYROLL: 'Next payroll cycle',
      SEPARATE_PAYOUT: 'Separate payout'
    };
    return labels[timing];
  }

  statusLabel(status: CommissionPayrollRecord['status']): string {
    const labels: Record<CommissionPayrollRecord['status'], string> = {
      PENDING_APPROVAL: 'Pending approval',
      READY_FOR_PAYROLL: 'Ready for payroll',
      PAID: 'Paid'
    };
    return labels[status];
  }

  statusClass(status: CommissionPayrollRecord['status']): string {
    const classes: Record<CommissionPayrollRecord['status'], string> = {
      PENDING_APPROVAL: 'chip bg-light-warning text-warning',
      READY_FOR_PAYROLL: 'chip bg-light-primary text-primary',
      PAID: 'chip bg-light-success text-success'
    };
    return classes[status];
  }
}

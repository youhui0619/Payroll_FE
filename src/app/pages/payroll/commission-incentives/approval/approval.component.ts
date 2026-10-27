import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { commissionPayrollRecords } from '../../../../data/commission-payroll-records';
import type { CommissionPayrollRecord } from '../../../../models/commission-payroll-record.model';
import { MaterialImports, MaterialProviders } from '../../../../shared/material-imports';
import { CommissionDetailDialogComponent } from '../../../../shared/dialog/commission-detail-dialog/commission-detail-dialog.component';

@Component({
  selector: 'app-approval',
  standalone: true,
  imports: [...MaterialImports, CommonModule, CommissionDetailDialogComponent],
  providers: [...MaterialProviders],
  templateUrl: './approval.component.html',
  styleUrl: './approval.component.scss'
})
export class ApprovalComponent {
  readonly commissionRecords = commissionPayrollRecords;
  selectedRecord: CommissionPayrollRecord | null = null;

  get pendingRecords(): CommissionPayrollRecord[] {
    return this.commissionRecords.filter(record => record.status === 'PENDING_APPROVAL');
  }

  get pendingAmount(): number {
    return this.pendingRecords.reduce((total, record) => total + record.amount, 0);
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

  openDetails(record: CommissionPayrollRecord): void {
    this.selectedRecord = record;
  }

  closeDetails(): void {
    this.selectedRecord = null;
  }
}

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaterialImports, MaterialProviders } from '../../material-imports';
import { getEmployee } from '../../../data/employees';
import { getClaimTypeLabel } from '../../../data/claim-types';
import type { ClaimPaymentMethod, ClaimType, ExpenseClaimRecord } from '../../../models/claim.model';
import type { EmployeeRecord } from '../../../models/employee.model';

@Component({
  selector: 'app-claim-detail-dialog',
  standalone: true,
  imports: [...MaterialImports, CommonModule, FormsModule],
  providers: [...MaterialProviders],
  templateUrl: './claim-detail-dialog.component.html',
  styleUrl: './claim-detail-dialog.component.scss'
})
export class ClaimDetailDialogComponent {
  @Input({ required: true }) claim!: ExpenseClaimRecord;
  @Input() showDecisionActions = false;
  @Output() closed = new EventEmitter<void>();
  @Output() decisionMade = new EventEmitter<{ status: 'Approved' | 'Rejected'; comment: string }>();
  decisionComment = '';

  get employee(): EmployeeRecord | null {
    try {
      return getEmployee(this.claim.employeeId);
    } catch {
      return null;
    }
  }

  get statusClass(): string {
    switch (this.claim.status) {
      case 'Pending': return 'bg-light-warning text-warning';
      case 'Approved': return 'bg-light-primary text-primary';
      case 'Rejected': return 'bg-light-danger text-danger';
      case 'Paid': return 'bg-light-success text-success';
    }
  }

  claimTypeLabel(type: ClaimType): string {
    return getClaimTypeLabel(type);
  }

  paymentMethodLabel(method: ClaimPaymentMethod): string {
    const labels: Record<ClaimPaymentMethod, string> = {
      PAYROLL: 'Payroll',
      BANK_TRANSFER: 'Bank Transfer',
      CASH: 'Cash'
    };
    return labels[method];
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

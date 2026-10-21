import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MaterialImports, MaterialProviders } from '../../../../shared/material-imports';
import { claims } from '../../../../data/claims';
import { getEmployee } from '../../../../data/employees';
import type { ClaimStatus, ClaimType, ExpenseClaimRecord } from '../../../../models/claim.model';
import { ClaimDetailDialogComponent } from '../../../../shared/dialog/claim-detail-dialog/claim-detail-dialog.component';

@Component({
  selector: 'app-approval',
  standalone: true,
  imports: [...MaterialImports, CommonModule, ClaimDetailDialogComponent],
  providers: [...MaterialProviders],
  templateUrl: './approval.component.html',
  styleUrl: './approval.component.scss'
})
export class ApprovalComponent {
  readonly claims = claims;
  readonly claimTypeLabels: Record<ClaimType, string> = {
    TRAVEL: 'Travel',
    MEALS: 'Meals',
    ACCOMMODATION: 'Accommodation',
    TRANSPORTATION: 'Transportation',
    MEDICAL: 'Medical',
    COMMUNICATION: 'Communication',
    OTHER: 'Other'
  };
  selectedClaim: ExpenseClaimRecord | null = null;

  get pendingClaims(): ExpenseClaimRecord[] {
    return this.claims.filter(claim => claim.status === 'Pending');
  }

  get pendingAmount(): number {
    return this.pendingClaims.reduce((total, claim) => total + claim.amount, 0);
  }

  employeeName(employeeId: string): string {
    return getEmployee(employeeId).employeeName;
  }

  claimTypeLabel(type: ClaimType): string {
    return this.claimTypeLabels[type];
  }

  paymentMethodLabel(method: ExpenseClaimRecord['paymentMethod']): string {
    const labels = { PAYROLL: 'Payroll', BANK_TRANSFER: 'Bank Transfer', CASH: 'Cash' };
    return labels[method];
  }

  statusClass(status: ClaimStatus): string {
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

  closeClaimDetails(): void {
    this.selectedClaim = null;
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
    this.closeClaimDetails();
  }
}

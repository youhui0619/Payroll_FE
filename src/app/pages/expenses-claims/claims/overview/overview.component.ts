import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MaterialImports, MaterialProviders } from '../../../../shared/material-imports';
import { departments } from '../../../../data/departments';
import { claims } from '../../../../data/claims';
import { getClaimTypeLabel } from '../../../../data/claim-types';
import type { ClaimPaymentMethod, ClaimStatus, ClaimType, ExpenseClaimRecord } from '../../../../models/claim.model';
import { ClaimDetailDialogComponent } from '../../../../shared/dialog/claim-detail-dialog/claim-detail-dialog.component';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [...MaterialImports, CommonModule, FormsModule, RouterLink, ClaimDetailDialogComponent],
  providers: [...MaterialProviders],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent {
  readonly claims = claims;
  readonly departments = departments.filter(department => department.status === 'Active');
  readonly statuses: ClaimStatus[] = ['Pending', 'Approved', 'Rejected', 'Paid'];
  readonly months = [
    { value: 1, label: 'January' }, { value: 2, label: 'February' },
    { value: 3, label: 'March' }, { value: 4, label: 'April' },
    { value: 5, label: 'May' }, { value: 6, label: 'June' },
    { value: 7, label: 'July' }, { value: 8, label: 'August' },
    { value: 9, label: 'September' }, { value: 10, label: 'October' },
    { value: 11, label: 'November' }, { value: 12, label: 'December' }
  ];
  readonly years = Array.from(new Set([
    new Date().getFullYear(),
    ...claims.map(claim => Number(claim.claimDate.slice(0, 4)))
  ])).sort((a, b) => b - a);
  readonly paymentMethodLabels: Record<ClaimPaymentMethod, string> = {
    PAYROLL: 'Payroll',
    BANK_TRANSFER: 'Bank Transfer',
    CASH: 'Cash'
  };

  searchText = '';
  selectedDepartmentIds: string[] = [];
  selectedStatuses: ClaimStatus[] = [];
  selectedMonth: number | null = null;
  selectedYear: number | null = null;
  selectedClaim: ExpenseClaimRecord | null = null;

  get filteredClaims(): ExpenseClaimRecord[] {
    const query = this.searchText.trim().toLowerCase();
    return this.claims.filter(claim => {
      const date = new Date(`${claim.claimDate}T00:00:00`);
      const matchesQuery = !query || [
        claim.id, claim.employeeName, claim.employeeId, claim.departmentName,
        getClaimTypeLabel(claim.claimType), claim.description
      ].some(value => value.toLowerCase().includes(query));
      const matchesDepartment = this.selectedDepartmentIds.length === 0
        || this.selectedDepartmentIds.includes(claim.departmentId);
      const matchesStatus = this.selectedStatuses.length === 0
        || this.selectedStatuses.includes(claim.status);
      const matchesMonth = this.selectedMonth === null || date.getMonth() + 1 === this.selectedMonth;
      const matchesYear = this.selectedYear === null || date.getFullYear() === this.selectedYear;
      return matchesQuery && matchesDepartment && matchesStatus && matchesMonth && matchesYear;
    });
  }

  get pendingCount(): number {
    return this.claims.filter(claim => claim.status === 'Pending').length;
  }

  get approvedCount(): number {
    return this.claims.filter(claim => claim.status === 'Approved').length;
  }

  get paidCount(): number {
    return this.claims.filter(claim => claim.status === 'Paid').length;
  }

  get totalClaimAmount(): number {
    return this.claims.reduce((total, claim) => total + claim.amount, 0);
  }

  claimTypeLabel(type: ClaimType): string {
    return getClaimTypeLabel(type);
  }

  paymentMethodLabel(method: ClaimPaymentMethod): string {
    return this.paymentMethodLabels[method];
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

  statusClass(status: ClaimStatus): string {
    switch (status) {
      case 'Pending': return 'bg-light-warning text-warning';
      case 'Approved': return 'bg-light-primary text-primary';
      case 'Rejected': return 'bg-light-danger text-danger';
      case 'Paid': return 'bg-light-success text-success';
    }
  }

  clearFilters(): void {
    this.searchText = '';
    this.selectedDepartmentIds = [];
    this.selectedStatuses = [];
    this.selectedMonth = null;
    this.selectedYear = null;
  }
}

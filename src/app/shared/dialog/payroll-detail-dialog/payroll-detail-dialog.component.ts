import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { payrollList } from '../../../data/payroll';
import { MaterialImports, MaterialProviders } from '../../material-imports';
import { payslips } from '../../../data/payslips';
import type { Payslip } from '../../../models/payslip.model';
import { leaveApplications } from '../../../data/leave-applications';
import { claims } from '../../../data/claims';
import { getClaimTypeLabel } from '../../../data/claim-types';
import { getEmployee } from '../../../data/employees';
import type { LeaveApplication } from '../../../models/leave.model';
import type { ClaimStatus, ClaimType, ExpenseClaimRecord } from '../../../models/claim.model';
import type { CommissionPayrollRecord } from '../../../models/commission-payroll-record.model';
import { LeaveDetailDialogComponent, type LeaveDialogData } from '../leave-detail-dialog/leave-detail-dialog.component';
import { ClaimDetailDialogComponent } from '../claim-detail-dialog/claim-detail-dialog.component';
import { CommissionDetailDialogComponent } from '../commission-detail-dialog/commission-detail-dialog.component';

@Component({
  selector: 'app-payroll-detail-dialog',
  standalone: true,
  imports: [...MaterialImports, CommonModule, MatSidenavModule, LeaveDetailDialogComponent, ClaimDetailDialogComponent, CommissionDetailDialogComponent],
  providers: [...MaterialProviders],
  templateUrl: './payroll-detail-dialog.component.html',
  styleUrl: './payroll-detail-dialog.component.scss'
})
export class PayrollDetailDialogComponent {
  @Input({ required: true }) payroll!: typeof payrollList[number];
  @Output() closed = new EventEmitter<void>();
  selectedLeave: LeaveDialogData | null = null;
  selectedClaim: ExpenseClaimRecord | null = null;
  selectedCommission: CommissionPayrollRecord | null = null;
  showReferenceDrawer = false;

  get payslip(): Payslip {
    const record = payslips.find(item => item.employeeId === this.payroll.employeeId);
    if (!record) {
      throw new Error(`Payslip data not found for employee ${this.payroll.employeeId}`);
    }
    return record;
  }

  get leaveReferenceRecords(): LeaveApplication[] {
    return leaveApplications.filter(item =>
      this.payslip.leaveReferences.includes(item.reference) && item.status === 'Approved'
    );
  }

  get claimReferenceRecords(): ExpenseClaimRecord[] {
    return claims.filter(item => this.payslip.claimReferences.includes(item.id));
  }

  claimTypeLabel(type: ClaimType): string {
    return getClaimTypeLabel(type);
  }

  claimStatusClass(status: ClaimStatus): string {
    switch (status) {
      case 'Pending': return 'bg-light-warning text-warning';
      case 'Approved': return 'bg-light-primary text-primary';
      case 'Rejected': return 'bg-light-danger text-danger';
      case 'Paid': return 'bg-light-success text-success';
    }
  }

  commissionStatusLabel(status: CommissionPayrollRecord['status']): string {
    const labels: Record<CommissionPayrollRecord['status'], string> = {
      PENDING_APPROVAL: 'Pending approval',
      READY_FOR_PAYROLL: 'Ready for payroll',
      PAID: 'Paid'
    };
    return labels[status];
  }

  commissionStatusClass(status: CommissionPayrollRecord['status']): string {
    const classes: Record<CommissionPayrollRecord['status'], string> = {
      PENDING_APPROVAL: 'bg-light-warning text-warning',
      READY_FOR_PAYROLL: 'bg-light-primary text-primary',
      PAID: 'bg-light-success text-success'
    };
    return classes[status];
  }

  openReferenceDrawer(): void {
    this.showReferenceDrawer = true;
  }

  closeReferenceDrawer(): void {
    this.showReferenceDrawer = false;
  }

  openLeaveReference(leave: LeaveApplication): void {
    this.closeReferenceDrawer();
    const employee = getEmployee(leave.employeeId);
    this.selectedLeave = {
      title: leave.leaveType,
      subtitle: `Leave request · ${leave.reference}`,
      status: leave.status,
      statusClass: leave.statusClass,
      employeeInformation: {
        name: employee.employeeName,
        employeeId: employee.employeeId,
        department: employee.department,
        position: employee.position,
        contactNo: employee.contactNo,
        nricNo: employee.nricPassportNo
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

  openClaimReference(claim: ExpenseClaimRecord): void {
    this.closeReferenceDrawer();
    this.selectedClaim = claim;
  }

  openCommissionReference(commission: CommissionPayrollRecord): void {
    this.closeReferenceDrawer();
    this.selectedCommission = commission;
  }

  close(): void {
    this.closed.emit();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (!this.showReferenceDrawer && !this.selectedLeave && !this.selectedClaim && !this.selectedCommission) this.close();
  }
}

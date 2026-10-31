import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MaterialImports, MaterialProviders } from '../../../../shared/material-imports';
import { overtimeRequests } from '../../../../data/overtime-requests';
import type { OvertimeRequestRecord, OvertimeStatus, OvertimeType } from '../../../../models/overtime.model';
import { OvertimeDetailDialogComponent } from '../../../../shared/dialog/overtime-detail-dialog/overtime-detail-dialog.component';

@Component({
  selector: 'app-approval',
  standalone: true,
  imports: [...MaterialImports, CommonModule, OvertimeDetailDialogComponent],
  providers: [...MaterialProviders],
  templateUrl: './approval.component.html',
  styleUrl: './approval.component.scss',
})
export class ApprovalComponent {
  readonly overtimeRequests = overtimeRequests;
  selectedRequest: OvertimeRequestRecord | null = null;

  get pendingRequests(): OvertimeRequestRecord[] {
    return this.overtimeRequests.filter(request => request.status === 'Pending');
  }

  get pendingNetMinutes(): number {
    return this.pendingRequests.reduce((total, request) => total + request.netMinutes, 0);
  }

  get pendingTypesCount(): number {
    return new Set(this.pendingRequests.map(request => request.overtimeType)).size;
  }

  overtimeTypeLabel(type: OvertimeType): string {
    const labels: Record<OvertimeType, string> = {
      NORMAL_WORKING_DAY: 'Normal Working Day',
      REST_DAY: 'Rest Day',
      PUBLIC_HOLIDAY: 'Public Holiday'
    };
    return labels[type];
  }

  formatDuration(totalMinutes: number): string {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours && minutes) return `${hours}h ${minutes}m`;
    if (hours) return `${hours}h`;
    return `${minutes}m`;
  }

  statusClass(status: OvertimeStatus): string {
    switch (status) {
      case 'Pending': return 'bg-light-info text-info';
      case 'Approved': return 'bg-light-primary text-primary';
      case 'Rejected': return 'bg-light-danger text-danger';
      case 'Paid': return 'bg-light-success text-success';
    }
  }

  openRequestDetails(request: OvertimeRequestRecord): void {
    this.selectedRequest = request;
  }

  closeRequestDetails(): void {
    this.selectedRequest = null;
  }

  decideRequest(decision: { status: 'Approved' | 'Rejected'; comment: string }): void {
    const request = this.selectedRequest;
    if (!request || request.status !== 'Pending') return;
    const now = new Date();
    request.status = decision.status;
    request.approval = {
      approver: 'Sarah Lim',
      approvedDate: [now.getFullYear(), String(now.getMonth() + 1).padStart(2, '0'), String(now.getDate()).padStart(2, '0')].join('-'),
      comments: decision.comment || (decision.status === 'Approved' ? 'Approved.' : 'Rejected during overtime review.')
    };
    this.closeRequestDetails();
  }
}

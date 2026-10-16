import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';

export interface LeaveDialogData {
  title: string;
  subtitle: string;
  status: string;
  statusClass: string;
  employeeInformation: {
    name: string;
    employeeId: string;
    department: string;
    position: string;
    contactNo: string;
    nricNo: string;
  };
  details: {
    leaveType: string;
    reference: string;
    date: string;
    duration: string;
    reason: string;
  };
  approval: {
    approver: string;
    status: string;
    comments: string;
    approvedDate: string | null;
  };
}

@Component({
  selector: 'app-leave-detail-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './leave-detail-dialog.component.html',
  styleUrl: './leave-detail-dialog.component.scss'
})
export class LeaveDetailDialogComponent {
  @Input({ required: true }) data!: LeaveDialogData;
  @Output() closed = new EventEmitter<void>();

  close(): void {
    this.closed.emit();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close();
  }
}

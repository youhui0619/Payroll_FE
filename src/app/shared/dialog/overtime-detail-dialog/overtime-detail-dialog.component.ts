import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaterialImports, MaterialProviders } from '../../material-imports';
import type { OvertimeRequestRecord, OvertimeStatus, OvertimeType } from '../../../models/overtime.model';

@Component({
  selector: 'app-overtime-detail-dialog',
  standalone: true,
  imports: [...MaterialImports, CommonModule, FormsModule],
  providers: [...MaterialProviders],
  templateUrl: './overtime-detail-dialog.component.html',
  styleUrl: './overtime-detail-dialog.component.scss'
})
export class OvertimeDetailDialogComponent {
  @Input({ required: true }) request!: OvertimeRequestRecord;
  @Input() showDecisionActions = false;
  @Output() closed = new EventEmitter<void>();
  @Output() decisionMade = new EventEmitter<{ status: 'Approved' | 'Rejected'; comment: string }>();

  decisionComment = '';

  get statusClass(): string {
    const classes: Record<OvertimeStatus, string> = {
      Pending: 'bg-light-pending text-pending',
      Approved: 'bg-light-primary text-primary',
      Rejected: 'bg-light-danger text-danger',
      Paid: 'bg-light-success text-success'
    };
    return classes[this.request.status];
  }

  get overtimeTypeLabel(): string {
    const labels: Record<OvertimeType, string> = {
      NORMAL_WORKING_DAY: 'Normal Working Day',
      REST_DAY: 'Rest Day',
      PUBLIC_HOLIDAY: 'Public Holiday'
    };
    return labels[this.request.overtimeType];
  }

  formatDuration(totalMinutes: number): string {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours && minutes) return `${hours} hours ${minutes} minutes`;
    if (hours) return `${hours} hours`;
    return `${minutes} minutes`;
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

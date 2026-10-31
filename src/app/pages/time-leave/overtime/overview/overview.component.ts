import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MaterialImports, MaterialProviders } from '../../../../shared/material-imports';
import { departments } from '../../../../data/departments';
import { overtimeRequests } from '../../../../data/overtime-requests';
import type { OvertimeRequestRecord, OvertimeStatus, OvertimeType } from '../../../../models/overtime.model';
import { OvertimeDetailDialogComponent } from '../../../../shared/dialog/overtime-detail-dialog/overtime-detail-dialog.component';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [...MaterialImports, CommonModule, FormsModule, RouterLink, OvertimeDetailDialogComponent],
  providers: [...MaterialProviders],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss',
})
export class OverviewComponent {
  readonly overtimeRequests = overtimeRequests;
  readonly departments = departments.filter(department => department.status === 'Active');
  readonly statuses: OvertimeStatus[] = ['Pending', 'Approved', 'Rejected', 'Paid'];

  searchText = '';
  selectedDepartmentIds: string[] = [];
  selectedStatuses: OvertimeStatus[] = [];
  selectedStartDate: Date | null = null;
  selectedEndDate: Date | null = null;
  selectedRequest: OvertimeRequestRecord | null = null;

  get filteredRequests(): OvertimeRequestRecord[] {
    const query = this.searchText.trim().toLowerCase();
    return this.overtimeRequests.filter(request => {
      const matchesQuery = !query || [
        request.id, request.employeeId, request.employeeName, request.departmentName,
        this.overtimeTypeLabel(request.overtimeType), request.description
      ].some(value => value.toLowerCase().includes(query));
      const matchesDepartment = this.selectedDepartmentIds.length === 0
        || this.selectedDepartmentIds.includes(request.departmentId);
      const matchesStatus = this.selectedStatuses.length === 0 || this.selectedStatuses.includes(request.status);
      const matchesStartDate = !this.selectedStartDate || request.overtimeDate >= this.dateKey(this.selectedStartDate);
      const matchesEndDate = !this.selectedEndDate || request.overtimeDate <= this.dateKey(this.selectedEndDate);
      return matchesQuery && matchesDepartment && matchesStatus && matchesStartDate && matchesEndDate;
    });
  }

  get pendingCount(): number {
    return this.overtimeRequests.filter(request => request.status === 'Pending').length;
  }

  get approvedCount(): number {
    return this.overtimeRequests.filter(request => request.status === 'Approved').length;
  }

  get totalNetMinutes(): number {
    return this.overtimeRequests.reduce((total, request) => total + request.netMinutes, 0);
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
      case 'Pending': return 'bg-light-warning text-warning';
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

  clearFilters(): void {
    this.searchText = '';
    this.selectedDepartmentIds = [];
    this.selectedStatuses = [];
    this.selectedStartDate = null;
    this.selectedEndDate = null;
  }

  private dateKey(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}

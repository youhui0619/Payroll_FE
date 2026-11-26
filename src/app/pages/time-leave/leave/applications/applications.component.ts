import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { SkeletonLoaderComponent } from '../../../../shared/components/skeleton-loader/skeleton-loader.component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MaterialImports, MaterialProviders } from '../../../../shared/material-imports';
import { DropzoneComponent } from '../../../../shared/dropzone/dropzone.component';
import { FullCalendarModule, CalendarOptions } from '@fullcalendar/angular';
import interactionPlugin from '@fullcalendar/angular/interaction';
import themePlugin from "@fullcalendar/angular/themes/monarch"; 
import type { LeaveApplication } from '../../../../models/leave/leave.model';
import { employees, getEmployee } from '../../../../data/workforce/employees.data';
import { LeaveDetailDialogComponent, type LeaveDialogData } from '../../../../shared/dialog/leave-detail-dialog/leave-detail-dialog.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastService } from '../../../../shared/components/toast/toast.service';
import { LeaveApplicationApiService } from '../../../../services/api/leave-applications.service';

@Component({
  selector: 'app-applications',
  imports: [...MaterialImports, CommonModule, FormsModule, ReactiveFormsModule, FullCalendarModule, LeaveDetailDialogComponent, RouterLink, SkeletonLoaderComponent],
  providers: [...MaterialProviders, LeaveApplicationApiService],
  templateUrl: './applications.component.html',
  styleUrl: './applications.component.scss'
})
export class ApplicationsComponent implements OnInit {
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private apiService: LeaveApplicationApiService,
    private toastService: ToastService
  ) {}
  
  loading = true;
  leaveApplications = new MatTableDataSource<LeaveApplication>([]);
  filter: any = {};
  meta: any = {};
  
  ngOnInit() {
    this.resetFilter();
  }

  ngAfterViewInit() {
    this.paginator.page.subscribe(() => {
      this.meta.pageSize = this.paginator.pageSize;
      this.meta.page = this.paginator.pageIndex + 1; 
      console.log(this.meta, this.meta)
      this.getLeaveApplications();
    });
  }

  resetFilter(){
    this.filter = {
      search: "",
      active: null
    };
    this.getLeaveApplications();
  }

  getLeaveApplications(){
    this.loading = true;
    this.apiService.getAllLeaveApplications(this.filter).subscribe({
      next: (response) => {
        console.log("response", response)
        this.leaveApplications.data = response.data.length > 0 ? response.data : [];
        this.meta.total = response.meta.total
        this.loading = false;
        console.log("leaveApplications", this.leaveApplications)
      },
      error: (error) => {
        this.toastService.show({
          title: error.error.code,
          message: error.error.message,
          icon: 'danger'
        });
        this.loading = false;
      },
    });
  }

  onSortChange(event: { active: string; direction: string }) {
    this.meta.sortBy = event.active;
    this.meta.sortDir = event.direction.toUpperCase() || 'ASC';
    console.log("this.meta sort", this.meta)
    this.getLeaveApplications();
  }
  
  
  applyFilter(field: 'search' | 'type' | 'state', value: string) {
    this.filter[field] = value;
    this.getLeaveApplications();
  }
  // openLeaveDetails(leave: LeaveApplication): void {
  //   this.activeLeave = leave;
  //   const employee = getEmployee(leave.employeeId);
  //   this.selectedLeave = {
  //     title: leave.leaveType,
  //     subtitle: `Leave request · ${leave.reference}`,
  //     status: leave.status,
  //     statusClass: leave.statusClass,
  //     employeeInformation: {
  //       name: employee.name,
  //       employeeId: employee.employeeNo,
  //       department: employee.department,
  //       position: employee.position,
  //       contactNo: employee.contactNo,
  //       nricNo: employee.nricPassportNo
  //     },
  //     details: {
  //       leaveType: leave.leaveType,
  //       reference: leave.reference,
  //       date: leave.dateRange,
  //       duration: leave.daysTaken,
  //       reason: leave.reason
  //     },
  //     approval: leave.approval
  //   };
  // }

  // closeLeaveDialog(): void {
  //   this.selectedLeave = null;
  //   this.activeLeave = null;
  // }

  // decideLeave(decision: { status: 'Approved' | 'Rejected'; comment: string }): void {
  //   const leave = this.activeLeave;
  //   if (!leave) return;

  //   const decisionDate = new Date();
  //   const date = [
  //     decisionDate.getFullYear(),
  //     String(decisionDate.getMonth() + 1).padStart(2, '0'),
  //     String(decisionDate.getDate()).padStart(2, '0')
  //   ].join('-');

  //   leave.status = decision.status;
  //   leave.statusClass = decision.status === 'Approved' ? 'bg-light-primary text-primary' : 'bg-light-danger text-danger';
  //   leave.approval.status = decision.status;
  //   leave.approval.comments = decision.comment || 'Rejected during leave review.';
  //   leave.approval.approvedDate = date;

  //   const pendingIndex = this.leaveRequests.indexOf(leave);
  //   if (pendingIndex >= 0) this.leaveRequests.splice(pendingIndex, 1);
  //   this.closeLeaveDialog();
  // }

}

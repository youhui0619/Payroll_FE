import { Routes } from '@angular/router';
import { OverviewComponent as AttendanceOverviewComponent } from './attendance/overview/overview.component';
import { OverviewComponent as LeaveOverviewComponent } from './leave/overview/overview.component';
import { ViewComponent as LeaveViewComponent } from './leave/view/view.component';
import { ApprovalComponent as LeaveApprovalComponent } from './leave/approval/approval.component';
import { ApplicationsComponent as LeaveApplicationsComponent } from './leave/applications/applications.component';

export const TIME_LEAVE_ROUTES: Routes = [
  {
    path: 'attendance/overview',
    component: AttendanceOverviewComponent
  },
  {
    path: 'leave/overview',
    component: LeaveOverviewComponent
  },
  {
    path: 'leave/:id/view',
    component: LeaveViewComponent
  },
  {
    path: 'leave/approval',
    component: LeaveApprovalComponent
  },
  {
    path: 'leave/applications',
    component: LeaveApplicationsComponent
  }

];
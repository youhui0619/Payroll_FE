import { Routes } from '@angular/router';
import { OverviewComponent as AttendanceOverviewComponent } from './attendance/overview/overview.component';
import { OverviewComponent as LeaveOverviewComponent } from './leave/overview/overview.component';
import { ViewComponent as LeaveViewComponent } from './leave/view/view.component';
import { ApprovalComponent as LeaveApprovalComponent } from './leave/approval/approval.component';
import { ApplicationsComponent as LeaveApplicationsComponent } from './leave/applications/applications.component';
import { OverviewComponent as OvertimeOverviewComponent } from './overtime/overview/overview.component';
import { ApprovalComponent as OvertimeApprovalComponent } from './overtime/approval/approval.component';
import { CreateComponent as OvertimeCreateComponent } from './overtime/create/create.component';


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
  },
  {
    path: 'overtime/overview',
    component: OvertimeOverviewComponent
  },
  {
    path: 'overtime/approval',
    component: OvertimeApprovalComponent
  },
  {
    path: 'overtime/create',
    component: OvertimeCreateComponent
  }

];
import { Routes } from '@angular/router';
import { OverviewComponent as AttendanceOverviewComponent } from './attendance/overview/overview.component';
import { OverviewComponent as LeaveOverviewComponent } from './leave/overview/overview.component';

export const TIME_LEAVE_ROUTES: Routes = [
  {
    path: 'attendance/overview',
    component: AttendanceOverviewComponent
  },
  {
    path: 'leave/overview',
    component: LeaveOverviewComponent
  }

];
import { Routes } from '@angular/router';
import { ListComponent as PublicHolidayListComponent } from './public-holidays/list/list.component';
import { CreateComponent as PublicHolidayCreateComponent } from './public-holidays/create/create.component';
import { ProfileComponent as CompanyProfileComponent } from './company/profile/profile.component';
import { ViewComponent as PublicHolidayViewComponent } from './public-holidays/view/view.component';
import { OverviewComponent as LeaveOverviewComponent } from './leave/overview/overview.component';
import { CreateComponent as LeaveCreateComponent } from './leave/create/create.component';
import { EditComponent as LeaveEditComponent } from './leave/edit/edit.component';
import { OverviewComponent as ClaimOverviewComponent } from './claim/overview/overview.component';
import { CreateComponent as ClaimCreateComponent } from './claim/create/create.component';
import { EditComponent as ClaimEditComponent } from './claim/edit/edit.component';


export const SETTINGS_ROUTES: Routes = [
  {
    path: 'company/profile',
    title: 'Company Profile',
    component: CompanyProfileComponent
  },
  {
    path: 'public-holidays/list',
    title: 'Public Holidays',
    component: PublicHolidayListComponent
  },
  {
    path: 'public-holidays/create',
    title: 'Create Public Holidays',
    component: PublicHolidayCreateComponent
  },
  {
    path: 'public-holidays/view/:id',
    title: 'View Public Holiday',
    component: PublicHolidayViewComponent
  },
  {
    path: 'leave-settings/overview',
    title: 'Leave Setting',
    component: LeaveOverviewComponent
  },
  {
    path: 'leave-settings/create',
    title: 'Create Leave Setting',
    component: LeaveCreateComponent
  },
  {
    path: 'leave-settings/edit/:leaveCode',
    title: 'Edit Leave Setting',
    component: LeaveEditComponent
  },

  {
    path: 'claim-settings/overview',
    title: 'Claim Setting',
    component: ClaimOverviewComponent
  },
  {
    path: 'claim-settings/create',
    title: 'Create Claim Setting',
    component: ClaimCreateComponent
  },
  {
    path: 'claim-settings/edit/:claimCode',
    title: 'Edit Claim Setting',
    component: ClaimEditComponent
  },


];

import { Routes } from '@angular/router';
import { ListComponent as PublicHolidayListComponent } from './public-holidays/list/list.component';
import { CreateComponent as PublicHolidayCreateComponent } from './public-holidays/create/create.component';
import { ProfileComponent as CompanyProfileComponent } from './company/profile/profile.component';


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

];

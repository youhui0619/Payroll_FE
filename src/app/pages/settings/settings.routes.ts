import { Routes } from '@angular/router';
import { ListComponent as PublicHolidayListComponent } from './public-holidays/list/list.component';
import { CreateComponent as PublicHolidayCreateComponent } from './public-holidays/create/create.component';


export const SETTINGS_ROUTES: Routes = [
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

import { Routes } from '@angular/router';
import { ListComponent as EmployeeListComponent } from './employees/list/list.component';
import { CreateComponent as EmployeeCreateComponent } from './employees/create/create.component';
import { ViewComponent as EmployeeViewComponent } from './employees/view/view.component';

export const WORKFORCE_ROUTES: Routes = [
  {
    path: 'employees/list',
    component: EmployeeListComponent
  },
  {
    path: 'employees/create',
    component: EmployeeCreateComponent
  },
  {
    path: 'employees/view',
    component: EmployeeViewComponent
  }
];
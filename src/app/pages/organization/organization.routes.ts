import { Routes } from '@angular/router';
import { OverviewComponent as DepartmentOverviewComponent } from './departments/overview/overview.component';
import { CreateComponent as DepartmentCreateComponent } from './departments/create/create.component';

export const ORGANIZATION_ROUTES: Routes = [
  {
    path: 'departments/create',
    component: DepartmentCreateComponent
  },
  {
    path: 'departments/overview',
    component: DepartmentOverviewComponent
  }
];
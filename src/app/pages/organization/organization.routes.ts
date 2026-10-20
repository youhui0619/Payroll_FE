import { Routes } from '@angular/router';
import { OverviewComponent as DepartmentOverviewComponent } from './departments/overview/overview.component';
import { CreateComponent as DepartmentCreateComponent } from './departments/create/create.component';
import { ViewComponent as DepartmentViewComponent } from './departments/view/view.component';
import { OverviewComponent as PositionOverviewComponent } from './positions/overview/overview.component';
import { CreateComponent as PositionCreateComponent } from './positions/create/create.component';
import { ViewComponent as PositionViewComponent } from './positions/view/view.component';


export const ORGANIZATION_ROUTES: Routes = [
  {
    path: 'departments/create',
    component: DepartmentCreateComponent
  },
  {
    path: 'departments/overview',
    component: DepartmentOverviewComponent
  },
  {
    path: 'departments/view/:id',
    component: DepartmentViewComponent
  },
  {
    path: 'positions/create',
    component: PositionCreateComponent
  },
  {
    path: 'positions/overview',
    component: PositionOverviewComponent
  },
  {
    path: 'positions/view/:id',
    component: PositionViewComponent
  }
];
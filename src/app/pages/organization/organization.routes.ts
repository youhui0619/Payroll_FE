import { Routes } from '@angular/router';
import { OverviewComponent as DepartmentOverviewComponent } from './departments/overview/overview.component';
import { CreateComponent as DepartmentCreateComponent } from './departments/create/create.component';
import { ViewComponent as DepartmentViewComponent } from './departments/view/view.component';
import { OverviewComponent as PositionOverviewComponent } from './positions/overview/overview.component';
import { CreateComponent as PositionCreateComponent } from './positions/create/create.component';
import { ViewComponent as PositionViewComponent } from './positions/view/view.component';
import { OverviewComponent as WorkLocationOverviewComponent } from './work-locations/overview/overview.component';
import { CreateComponent as WorkLocationCreateComponent } from './work-locations/create/create.component';
import { EditComponent as WorkLocationEditComponent } from './work-locations/edit/edit.component';
import { ViewComponent as WorkLocationViewComponent } from './work-locations/view/view.component';


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
  },
  {
    path: 'work-locations/create',
    component: WorkLocationCreateComponent
  },
  {
    path: 'work-locations/overview',
    component: WorkLocationOverviewComponent
  },
  {
    path: 'work-locations/view/:id',
    component: WorkLocationViewComponent
  },
  {
    path: 'work-locations/edit/:id',
    component: WorkLocationEditComponent
  },
  {
    path: 'work-location/create',
    component: WorkLocationCreateComponent
  }
];

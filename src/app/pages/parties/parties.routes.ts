import { Routes } from '@angular/router';
import { ListComponent as VendorListComponent } from './vendors/list/list.component';
import { CreateComponent as VendorCreateComponent } from './vendors/create/create.component';
import { ViewComponent as VendorViewComponent } from './vendors/view/view.component';
import { ListComponent as CustomerListComponent } from './customers/list/list.component';
import { CreateComponent as CustomerCreateComponent } from './customers/create/create.component';
import { ViewComponent as CustomerViewComponent } from './customers/view/view.component';


export const PARTIES_ROUTES: Routes = [
  {
    path: 'vendors/list',
    component: VendorListComponent
  },
  {
    path: 'vendors/create',
    component: VendorCreateComponent
  },
  {
    path: 'vendors/view',
    component: VendorViewComponent
  },
  {
    path: 'customers/list',
    component: CustomerListComponent
  },
  {
    path: 'customers/create',
    component: CustomerCreateComponent
  },
  {
    path: 'customers/view',
    component: CustomerViewComponent
  },
];
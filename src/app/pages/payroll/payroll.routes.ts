import { Routes } from '@angular/router';
import { OverviewComponent as PayrollOverviewComponent } from './overview/overview.component';
import { OverviewComponent as CommissionIncentiveOverviewComponent  } from './commission-incentives/overview/overview.component';
import { CreateComponent as CommissionIncentiveCreateComponent } from './commission-incentives/create/create.component';

export const PAYROLL_ROUTES: Routes = [
  {
    path: 'overview',
    component: PayrollOverviewComponent
  },
  {
    path: 'commission-incentives/overview',
    component: CommissionIncentiveOverviewComponent
  },
  {
    path: 'commission-incentives/create',
    component: CommissionIncentiveCreateComponent
  }
];
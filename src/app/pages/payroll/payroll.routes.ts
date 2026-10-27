import { Routes } from '@angular/router';
import { OverviewComponent as PayrollOverviewComponent } from './overview/overview.component';
import { OverviewComponent as CommissionIncentiveOverviewComponent  } from './commission-incentives/overview/overview.component';
import { CreateComponent as CommissionIncentiveCreateComponent } from './commission-incentives/create/create.component';
import { ApprovalComponent as CommissionIncentiveApprovalComponent } from './commission-incentives/approval/approval.component';
import { OverviewComponent as ClaimsAllowanceOverviewComponent } from './claims-allowance/overview/overview.component';
import { ApprovalComponent as ClaimsAllowanceApprovalComponent } from './claims-allowance/approval/approval.component';
import { CreateComponent as ClaimsAllowanceCreateComponent } from './claims-allowance/create/create.component';


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
  },
  {
    path: 'commission-incentives/approval',
    component: CommissionIncentiveApprovalComponent
  },
  {
    path: 'claims-allowance/overview',
    component: ClaimsAllowanceOverviewComponent
  },
  {
    path: 'claims-allowance/approval',
    component: ClaimsAllowanceApprovalComponent
  },
  {
    path: 'claims-allowance/create',
    component: ClaimsAllowanceCreateComponent
  }
];

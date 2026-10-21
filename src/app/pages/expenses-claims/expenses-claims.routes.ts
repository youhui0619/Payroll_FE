import { Routes } from '@angular/router';
import { OverviewComponent as ClaimsOverviewComponent } from './claims/overview/overview.component';
import { ApprovalComponent as ClaimsApprovalComponent } from './claims/approval/approval.component';
import { CreateComponent as ClaimsCreateComponent } from './claims/create/create.component';

export const EXPENSES_CLAIMS_ROUTES: Routes = [
  {
    path: 'claims/overview',
    component: ClaimsOverviewComponent
  },
  {
    path: 'claims/approval',
    component: ClaimsApprovalComponent
  },
  {
    path: 'claims/create',
    component: ClaimsCreateComponent
  }

];
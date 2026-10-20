import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MaterialImports, MaterialProviders } from '../../../../shared/material-imports';
import { RouterLink } from '@angular/router';
import { leavePolicies } from '../../../../data/leave-policies';
import type { LeavePolicy } from '../../../../models/leave-policy.model';

@Component({
  selector: 'app-overview',
  imports: [...MaterialImports, CommonModule, RouterLink],
  providers: [...MaterialProviders],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent {
  readonly leavePolicies = leavePolicies;

  entitlementLabel(policy: LeavePolicy): string {
    if (policy.entitlementCalculationMethod === 'SERVICE') {
      return 'Based on length of service';
    }

    const unit = policy.entitlementUnit === 'DAILY' ? 'days' : 'hours';
    return `${policy.defaultEntitlement ?? 0} ${unit} per year`;
  }
}

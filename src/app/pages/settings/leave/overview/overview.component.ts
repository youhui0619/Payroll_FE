import { OnInit, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonLoaderComponent } from '../../../../shared/components/skeleton-loader/skeleton-loader.component';
import { MaterialImports, MaterialProviders } from '../../../../shared/material-imports';
import { RouterLink } from '@angular/router';
import { leavePolicies } from '../../../../data/leave/leave-policies.data';
import type { LeavePolicy } from '../../../../models/leave/leave-policy.model';

@Component({
  selector: 'app-overview',
  imports: [...MaterialImports, CommonModule, RouterLink, SkeletonLoaderComponent],
  providers: [...MaterialProviders],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent implements OnInit {
  loading = true;

  ngOnInit(): void {
    window.setTimeout(() => this.loading = false, 3000);
  }

  leavePolicies = leavePolicies;

  entitlementLabel(policy: LeavePolicy): string {
    if (policy.entitlementCalculationMethod === 'SERVICE') {
      return 'Based on length of service';
    }

    const unit = policy.entitlementUnit === 'DAILY' ? 'days' : 'hours';
    return `${policy.defaultEntitlement ?? 0} ${unit} per year`;
  }
}

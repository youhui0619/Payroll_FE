import { OnInit, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonLoaderComponent } from '../../../../shared/components/skeleton-loader/skeleton-loader.component';
import { RouterLink } from '@angular/router';
import { MaterialImports, MaterialProviders } from '../../../../shared/material-imports';
import { claimTypes } from '../../../../data/claims/claim-types.data';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [...MaterialImports, CommonModule, RouterLink, SkeletonLoaderComponent],
  providers: [...MaterialProviders],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent implements OnInit {
  loading = true;

  ngOnInit(): void {
    window.setTimeout(() => this.loading = false, 5000);
  }

  readonly claimTypes = claimTypes;

  get activeCount(): number {
    return this.claimTypes.filter(item => item.status === 'ACTIVE').length;
  }

  get inactiveCount(): number {
    return this.claimTypes.filter(item => item.status === 'INACTIVE').length;
  }
}

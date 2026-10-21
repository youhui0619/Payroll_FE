import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MaterialImports, MaterialProviders } from '../../../../shared/material-imports';
import { claimTypes } from '../../../../data/claim-types';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [...MaterialImports, CommonModule, RouterLink],
  providers: [...MaterialProviders],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent {
  readonly claimTypes = claimTypes;

  get activeCount(): number {
    return this.claimTypes.filter(item => item.status === 'ACTIVE').length;
  }

  get inactiveCount(): number {
    return this.claimTypes.filter(item => item.status === 'INACTIVE').length;
  }
}

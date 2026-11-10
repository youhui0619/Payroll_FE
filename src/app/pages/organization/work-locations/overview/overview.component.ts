import { OnInit, Component } from '@angular/core';
import { SkeletonLoaderComponent } from '../../../../shared/components/skeleton-loader/skeleton-loader.component';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MaterialImports, MaterialProviders } from '../../../../shared/material-imports';
import { workLocations } from '../../../../data/workforce/work-locations.data';
import type { WorkLocation, WorkLocationType } from '../../../../models/workforce/work-location.model';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [...MaterialImports, FormsModule, RouterLink, SkeletonLoaderComponent],
  providers: [...MaterialProviders],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent implements OnInit {
  loading = true;

  ngOnInit(): void {
    window.setTimeout(() => this.loading = false, 5000);
  }

  readonly workLocations = workLocations;
  readonly locationTypes: WorkLocationType[] = ['OFFICE', 'BRANCH', 'WAREHOUSE', 'REMOTE'];

  searchTerm = '';
  selectedTypes: WorkLocationType[] = [];

  get filteredWorkLocations(): WorkLocation[] {
    const query = this.searchTerm.trim().toLowerCase();
    return this.workLocations.filter(location => {
      const matchesSearch = !query || [
        location.code,
        location.name,
        location.remark,
        location.city,
        location.state,
        location.country
      ].some(value => value.toLowerCase().includes(query));
      const matchesType = this.selectedTypes.length === 0 || this.selectedTypes.includes(location.type);
      return matchesSearch && matchesType;
    });
  }

  countByType(type: WorkLocationType): number {
    return this.workLocations.filter(location => location.type === type).length;
  }

  locationTypeLabel(type: WorkLocationType): string {
    return type.charAt(0) + type.slice(1).toLowerCase();
  }

  fullAddress(location: WorkLocation): string {
    return [location.addressLine1, location.addressLine2, location.city, location.state, location.postcode]
      .filter(Boolean)
      .join(', ');
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedTypes = [];
  }
}

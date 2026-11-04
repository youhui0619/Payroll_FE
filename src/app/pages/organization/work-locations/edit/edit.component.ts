import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialImports, MaterialProviders } from '../../../../shared/material-imports';
import { NavigationService } from '../../../../services/navigation.service';
import { workLocations } from '../../../../data/workforce/work-locations.data';
import type { WorkLocation } from '../../../../models/workforce/work-location.model';

@Component({
  selector: 'app-work-location-edit',
  standalone: true,
  imports: [...MaterialImports, ReactiveFormsModule],
  providers: [...MaterialProviders],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly navigation = inject(NavigationService);

  location: WorkLocation | null = null;

  readonly workLocationForm = new FormGroup({
    code: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    type: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    remark: new FormControl('', { nonNullable: true }),
    addressLine1: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    addressLine2: new FormControl('', { nonNullable: true }),
    city: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    postcode: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    state: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    country: new FormControl('', { nonNullable: true, validators: [Validators.required] })
  });

  ngOnInit(): void {
    const locationId = this.route.snapshot.paramMap.get('id');
    this.location = workLocations.find(location => location.id === locationId) ?? null;

    if (!this.location) {
      void this.router.navigateByUrl('/organization/work-locations/overview');
      return;
    }

    this.workLocationForm.patchValue({
      code: this.location.code,
      name: this.location.name,
      type: this.location.type,
      remark: this.location.remark,
      addressLine1: this.location.addressLine1,
      addressLine2: this.location.addressLine2,
      city: this.location.city,
      postcode: this.location.postcode,
      state: this.location.state,
      country: this.location.country
    });
  }

  goBack(): void {
    void this.navigation.back('/organization/work-locations/overview');
  }

  onSubmit(): void {
    if (this.workLocationForm.invalid) {
      this.workLocationForm.markAllAsTouched();
      return;
    }

    if (this.location) {
      Object.assign(this.location, this.workLocationForm.getRawValue());
      void this.router.navigateByUrl('/organization/work-locations/overview');
    }
  }
}

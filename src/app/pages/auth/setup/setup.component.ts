import { Component, ElementRef, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MaterialImports, MaterialProviders } from '../../../shared/material-imports';
import { ProfileComponent } from '../../settings/company/profile/profile.component';
import { WorkingScheduleComponent } from '../../settings/working-schedule/working-schedule.component';
import { PayrollComponent } from '../../settings/payroll/payroll.component';
import { RegionalPreferencesComponent } from '../../settings/preferences/regional-preferences/regional-preferences.component';

@Component({
  selector: 'app-setup',
  standalone: true,
  imports: [
    ...MaterialImports,
    ProfileComponent,
    WorkingScheduleComponent,
    PayrollComponent,
    RegionalPreferencesComponent
  ],
  providers: [...MaterialProviders],
  templateUrl: './setup.component.html',
  styleUrl: './setup.component.scss',
})
export class SetupComponent {
  private readonly host = inject(ElementRef<HTMLElement>);
  currentStep = 0;
  readonly setupSections = [
    {
      title: 'Company profile',
      description: 'Tell us about your business so every payslip, report, and compliance record starts with the right details.'
    },
    {
      title: 'Working schedule',
      description: 'Set the rhythm of your team’s working week so leave, overtime, and daily pay calculations stay accurate.'
    },
    {
      title: 'Payroll settings',
      description: 'Choose how and when your team gets paid so your first payroll run is ready when you are.'
    },
    {
      title: 'Regional preferences',
      description: 'A local starting point, ready for your review. Confirm the defaults that keep dates, currency, and time zone consistent.'
    }
  ];
  readonly lastStep = this.setupSections.length - 1;

  get currentSection() {
    return this.setupSections[this.currentStep];
  }

  get setupProgress(): number {
    return Math.round(((this.currentStep + 1) / this.setupSections.length) * 100);
  }

  constructor(private readonly router: Router) {}

  nextStep(): void {
    if (this.currentStep < this.lastStep) {
      this.currentStep += 1;
      this.scrollToTop();
    }
  }

  previousStep(): void {
    if (this.currentStep > 0) {
      this.currentStep -= 1;
      this.scrollToTop();
    }
  }

  private scrollToTop(): void {
    document.getElementById('setup-heading')?.focus({ preventScroll: true });

    const scrollContainer = document.querySelector('.main-content') as HTMLElement | null;
    if (scrollContainer) {
      scrollContainer.style.scrollBehavior = 'auto';
      scrollContainer.scrollTop = 0;
    }
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }

  completeSetup(): void {
    this.router.navigateByUrl('/dashboard');
  }
}

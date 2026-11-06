
import { Component, OnInit } from '@angular/core';
import { FormControl, FormRecord, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialImports, MaterialProviders } from '../../../../shared/material-imports';
import { getNotificationPreferenceGroups, NOTIFICATION_PREFERENCE_MONTH_VALUES, NOTIFICATION_PREFERENCE_VALUES } from '../../../../data/notifications/notification-preferences.data';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [...MaterialImports, ReactiveFormsModule],
  providers: [...MaterialProviders],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class NotificationsComponent implements OnInit {
  readonly notificationGroups = getNotificationPreferenceGroups();
  readonly notificationForm = new FormRecord<FormControl<boolean>>({});
  readonly probationConfirmationMonths = new FormControl(NOTIFICATION_PREFERENCE_MONTH_VALUES.probationConfirmation, {
    nonNullable: true,
    validators: [Validators.required, Validators.min(1), Validators.max(12), Validators.pattern(/^\d+$/)]
  });

  ngOnInit(): void {
    for (const group of this.notificationGroups) {
      for (const preference of group.preferences) {
        this.notificationForm.addControl(
          preference.id,
          new FormControl(NOTIFICATION_PREFERENCE_VALUES[preference.id] ?? false, { nonNullable: true })
        );
      }
    }
  }

  onSubmit(): void {
    const probationReminderEnabled = this.notificationForm.controls['probationConfirmation']?.value ?? false;
    if (this.notificationForm.invalid || (probationReminderEnabled && this.probationConfirmationMonths.invalid)) {
      this.notificationForm.markAllAsTouched();
      this.probationConfirmationMonths.markAsTouched();
      return;
    }

    Object.assign(NOTIFICATION_PREFERENCE_VALUES, this.notificationForm.getRawValue());
    if (this.probationConfirmationMonths.valid) {
      NOTIFICATION_PREFERENCE_MONTH_VALUES.probationConfirmation = this.probationConfirmationMonths.value;
    }
  }
}

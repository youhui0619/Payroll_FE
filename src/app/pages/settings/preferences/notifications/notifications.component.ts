
import { Component, OnInit } from '@angular/core';
import { FormControl, FormRecord, ReactiveFormsModule } from '@angular/forms';
import { MaterialImports, MaterialProviders } from '../../../../shared/material-imports';
import { getNotificationPreferenceGroups, NOTIFICATION_PREFERENCE_VALUES } from '../../../../data/notification-preferences.data';

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
    console.log('Notification preferences', this.notificationForm.getRawValue());
  }
}

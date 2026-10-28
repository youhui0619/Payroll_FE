
import { Component, OnInit } from '@angular/core';
import { FormControl, FormRecord, ReactiveFormsModule } from '@angular/forms';
import { MaterialImports, MaterialProviders } from '../../../../shared/material-imports';
import { NOTIFICATION_PREFERENCE_GROUPS } from '../../../../data/notification-preferences.data';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [...MaterialImports, ReactiveFormsModule],
  providers: [...MaterialProviders],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class NotificationsComponent implements OnInit {
  readonly notificationGroups = NOTIFICATION_PREFERENCE_GROUPS;
  readonly notificationForm = new FormRecord<FormControl<boolean>>({});

  ngOnInit(): void {
    for (const group of this.notificationGroups) {
      for (const preference of group.preferences) {
        this.notificationForm.addControl(
          preference.id,
          new FormControl(preference.enabled, { nonNullable: true })
        );
      }
    }
  }

  onSubmit(form:any){
    console.log("form.value", form.valueca)
  }
}

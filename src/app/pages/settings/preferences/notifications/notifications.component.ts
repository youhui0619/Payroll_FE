import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MaterialImports, MaterialProviders } from '../../../../shared/material-imports';
import { NOTIFICATION_PREFERENCE_MONTH_VALUES, NOTIFICATION_PREFERENCE_VALUES } from '../../../../data/notifications/notification-preferences.data';
import { payrollSettings } from '../../../../data/payroll/payroll-settings.data';
import { NotificationSettingApiService } from '../../../../services/api/notification-setting.service';
import { ToastService } from '../../../../shared/components/toast/toast.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [...MaterialImports, ReactiveFormsModule],
  providers: [...MaterialProviders, NotificationSettingApiService],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class NotificationsComponent implements OnInit {
  constructor(
    private toastService: ToastService,
    private apiService: NotificationSettingApiService
  ) {}

  notificationPreferences: any;
  form = new FormGroup({
    emailNotifications: new FormControl("", { nonNullable: true }),
    whatsappNotifications: new FormControl("", { nonNullable: true }),
    leaveApplications: new FormControl("", { nonNullable: true }),
    claims: new FormControl("", { nonNullable: true }),
    attendanceOvertime: new FormControl("", { nonNullable: true }),
    payrollPayslips: new FormControl("", { nonNullable: true }),
    statutoryCompliance: new FormControl("", { nonNullable: true }),
    probationConfirmation: new FormControl("", { nonNullable: true }),
    probationConfirmationLeadMonths: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required]
    })
  });
  submitting = false;
  showClaims = payrollSettings.includeClaimsAndAllowance;
  showAttendanceOvertime = payrollSettings.includeOvertime;
  showStatutoryCompliance = payrollSettings.includeEpf || payrollSettings.includeSocso || payrollSettings.includeEis
    || payrollSettings.includePcb || payrollSettings.includeHrdCorpLevy;

  ngOnInit() {
    this.getNotificationSetting();
  }

  getNotificationSetting() {
    this.apiService.getNotificationSetting().subscribe({
      next: (response) => {
        this.notificationPreferences = response.data;
        if (this.notificationPreferences){
          this.form.patchValue(this.notificationPreferences);
        }
        this.updateReminderValidation();
      },
      error: (error) => {
        this.toastService.show({
          title: error.error.code,
          message: error.error.message,
          icon: 'danger'
        });
      },
    });
  }

  private updateReminderValidation() {
    const months = this.form.controls.probationConfirmationLeadMonths;
    if (this.form.controls.probationConfirmation.value) {
      months.enable({ emitEvent: false })
    }
    else {
      months.disable({ emitEvent: false })
    }
  }

  onSubmit(form: FormGroup): void {
    if (this.submitting) return;
    if (form.invalid) {
      form.markAllAsTouched();
      return;
    }
    this.submitting = true;
    const data = form.value;

    console.log("data", data)
    this.apiService.updateNotificationSetting(data).subscribe({
      next: (response) => {
        this.updateReminderValidation();
        this.form.markAsPristine();
        this.toastService.show({
          title: "Success",
          message: "Notification preferences have been updated.",
          icon: 'success'
        });
        this.submitting = false;
      },
      error: (error) => {
        console.log("Error:", error);
        const errorResponse = error?.error;

        if (errorResponse?.errors?.length) {
          errorResponse.errors.forEach((err: any) => {
            this.toastService.show({
              title: errorResponse.code,
              message: err.message,
              icon: 'danger'
            });
          });
        } else {
          this.toastService.show({
            title: errorResponse?.code || 'Error',
            message: errorResponse?.message || 'Something went wrong.',
            icon: 'danger'
          });
        }
        this.submitting = false;
      }
    });
  }
}

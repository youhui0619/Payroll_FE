import type { NotificationPreferenceGroup } from '../models/notification-preference.model';
import type { PayrollSettings } from '../models/payroll-settings.model';
import { payrollSettings } from './payroll-settings';

export const NOTIFICATION_PREFERENCE_VALUES: Record<string, boolean> = {
  emailNotifications: true,
  whatsappNotifications: false,
  leaveApplications: true,
  claims: true,
  attendanceOvertime: true,
  payrollPayslips: true,
  statutoryCompliance: true
};

export function getNotificationPreferenceGroups(settings: PayrollSettings = payrollSettings): NotificationPreferenceGroup[] {
  const groups: NotificationPreferenceGroup[] = [
    {
      id: 'notification-channels',
      title: 'Notification Channels',
      description: 'Choose how you want to receive notifications.',
      preferences: [
        {
          id: 'emailNotifications',
          title: 'Email notifications',
          description: 'Receive notifications by email.',
          icon: 'mail-question'
        },
        {
          id: 'whatsappNotifications',
          title: 'WhatsApp notifications',
          description: 'Receive notifications on WhatsApp.',
          icon: 'article'
        }
      ]
    },
    {
      id: 'events-to-notify',
      title: 'Events to notify',
      description: 'Choose which payroll and employee updates you want to hear about.',
      preferences: [
        {
          id: 'leaveApplications',
          title: 'Leave applications',
          description: 'Submitted, approved, rejected or cancelled.',
          icon: 'calendar-event'
        },
        ...(settings.includeClaimsAndAllowance ? [{
          id: 'claims',
          title: 'Claims',
          description: 'Submitted, approved, rejected or paid.',
          icon: 'file-description'
        }] : []),
        ...(settings.includeOvertime ? [{
          id: 'attendanceOvertime',
          title: 'Attendance & overtime',
          description: 'Adjustment requests and overtime approvals.',
          icon: 'clock'
        }] : []),
        {
          id: 'payrollPayslips',
          title: 'Payroll & payslips',
          description: 'Payroll completed, payslip published or corrected.',
          icon: 'file-description'
        },
        ...(
          settings.enableEpf || settings.enableSocso || settings.enableEis ||
          settings.enablePcb || settings.enableHrdCorpLevy
            ? [{
                id: 'statutoryCompliance',
                title: 'Statutory & compliance',
                description: 'Reminders for configured statutory tasks.',
                icon: 'progress-check'
              }]
            : []
        )
      ]
    }
  ];

  return groups;
}

export interface NotificationPreference {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface NotificationPreferenceGroup {
  id: string;
  title: string;
  description: string;
  preferences: NotificationPreference[];
}

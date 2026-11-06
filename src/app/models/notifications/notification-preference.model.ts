export interface NotificationPreference {
  id: string;
  title: string;
  description: string;
  icon: string;
  monthInterval?: {
    label: string;
    min: number;
    max: number;
    unit: string;
  };
}

export interface NotificationPreferenceGroup {
  id: string;
  title: string;
  description: string;
  preferences: NotificationPreference[];
}

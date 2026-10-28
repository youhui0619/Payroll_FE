export interface RegionalPreferenceOption {
  label: string;
  value: string;
}

export interface RegionalPreference {
  id: string;
  title: string;
  description: string;
  icon?: string;
  controlType?: 'select' | 'text';
  placeholder?: string;
  options?: RegionalPreferenceOption[];
}

export interface RegionalPreferenceGroup {
  id: string;
  title: string;
  description: string;
  preferences: RegionalPreference[];
}

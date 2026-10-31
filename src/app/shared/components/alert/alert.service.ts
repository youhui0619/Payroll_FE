import { Injectable, signal } from '@angular/core';

export interface AlertOptions {
  title: string;
  content: string;
  approveLabel?: string;
  rejectLabel?: string;
  onApprove?: () => void;
  onReject?: () => void;
}

@Injectable({ providedIn: 'root' })
export class AlertService {
  readonly currentAlert = signal<AlertOptions | null>(null);

  show(options: AlertOptions): void {
    this.currentAlert.set(options);
  }

  close(): void {
    this.currentAlert.set(null);
  }

  approve(): void {
    const alert = this.currentAlert();
    alert?.onApprove?.();
    this.close();
  }

  reject(): void {
    const alert = this.currentAlert();
    alert?.onReject?.();
    this.close();
  }
}

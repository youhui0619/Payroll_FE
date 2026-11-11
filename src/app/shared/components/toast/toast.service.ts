import { Injectable, signal } from '@angular/core';

export type ToastIcon = 'danger' | 'success' | 'warning' | 'info';

export interface ToastOptions {
  title: string;
  message: string;
  icon: ToastIcon;
  duration?: number;
}

export interface ToastMessage extends ToastOptions {
  id: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly toasts = signal<ToastMessage[]>([]);
  private nextId = 0;
  private readonly timers = new Map<number, ReturnType<typeof setTimeout>>();

  show(options: ToastOptions): number {
    const id = ++this.nextId;
    const toast: ToastMessage = { ...options, id };
    this.toasts.update(current => [...current, toast]);
    this.timers.set(id, setTimeout(() => this.dismiss(id), options.duration ?? 5000));
    return id;
  }

  dismiss(id: number): void {
    const timer = this.timers.get(id);
    if (timer) clearTimeout(timer);
    this.timers.delete(id);
    this.toasts.update(current => current.filter(toast => toast.id !== id));
  }
}

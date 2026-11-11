import { Component, inject } from '@angular/core';
import { TablerIconComponent } from '@tabler/icons-angular';
import { ToastService, type ToastIcon } from './toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [TablerIconComponent],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss'
})
export class ToastComponent {
  readonly toastService = inject(ToastService);

  iconName(icon: ToastIcon): string {
    const icons: Record<ToastIcon, string> = {
      danger: 'alert-circle',
      success: 'circle-check',
      warning: 'alert-triangle',
      info: 'info-circle'
    };
    return icons[icon];
  }
}

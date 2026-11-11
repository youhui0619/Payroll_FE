import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AlertComponent } from './shared/components/alert/alert.component';
import { AlertService } from './shared/components/alert/alert.service';
import { ToastComponent } from './shared/components/toast/toast.component';
import { ToastService } from './shared/components/toast/toast.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AlertComponent, ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'payroll-system';
  readonly alertService = inject(AlertService);
  readonly toastService = inject(ToastService);
}

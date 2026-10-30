import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NavigationService } from '../../../services/navigation.service';


@Component({
  selector: 'app-forgot-password',
  imports: [MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  private readonly navigation = inject(NavigationService);

  goBack(): void { void this.navigation.back('/login'); }
}

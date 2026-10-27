import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TablerIconComponent } from '@tabler/icons-angular';


@Component({
  selector: 'app-forgot-password',
  imports: [MatButtonModule, MatFormFieldModule, MatInputModule, TablerIconComponent],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  
}

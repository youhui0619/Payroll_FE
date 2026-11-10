import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialImports, MaterialProviders } from '../../../shared/material-imports';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [...MaterialImports, ReactiveFormsModule],
  providers: [...MaterialProviders, ApiService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  constructor(
    private apiService: ApiService,
    private authService: AuthService,
  ) { }

  form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });
  submitting: boolean = false;
  hidePassword = true;

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  private resetForm(){
    this.submitting = false;
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  onSubmit(form: any) {
    if (form.invalid || this.submitting) {
      form.markAllAsTouched();
      return;
    }

    const data = form.value;
    this.submitting = true;

    this.apiService.login(data).subscribe({
      next: (response: any) => {
        sessionStorage.setItem("user", JSON.stringify(response))
        this.resetForm()
        this.authService.login(response)

      },
      error: (error) => {
          console.log("error", error)
          this.submitting = false;
      }
    })
  }
}

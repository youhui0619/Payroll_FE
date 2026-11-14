import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialImports, MaterialProviders } from '../../../shared/material-imports';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../shared/components/toast/toast.service';
import { RouterLink  } from '@angular/router';
import { NavigationService } from '../../../services/navigation.service';

@Component({
  selector: 'app-reset-password',
  imports: [...MaterialImports, ReactiveFormsModule],
  providers: [...MaterialProviders, ApiService],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  constructor(
      private toastService: ToastService,
      private apiService: ApiService,
      private authService: AuthService,
      private navigation: NavigationService
    ) { }
    
    form = new FormGroup({
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        // Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/),
      ]),
    });
    submitting: boolean = false;
    hidePassword = true;

    togglePasswordVisibility(): void {
      this.hidePassword = !this.hidePassword;
    }

    goBack() { 
      return this.navigation.back('/login'); 
    }
  
    resetForm(){
      this.submitting = false;
      this.form.reset();
      this.form.markAsPristine();
      this.form.markAsUntouched();
    }
  
    onSubmit(form: FormGroup) {
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
          this.toastService.show({
            title: error.error.code,
            message: error.error.message,
            icon: 'danger'
          });
          this.submitting = false;
        }
      })
    }
  }
  

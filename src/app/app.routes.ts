import { Routes } from '@angular/router';
import { AuthGuard } from './guard/auth.guard';
import { GuestGuard } from './guard/guest.guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [GuestGuard],
    loadComponent: () =>
      import('./pages/auth/login/login.component')
        .then(m => m.LoginComponent)
  },
  {
    path: 'setup',
    canActivate: [GuestGuard],
    loadComponent: () =>
      import('./pages/auth/setup/setup.component')
        .then(m => m.SetupComponent)
  },
  {
    path: 'forgot-password',
    canActivate: [GuestGuard],
    loadComponent: () =>
      import('./pages/auth/forgot-password/forgot-password.component')
        .then(m => m.ForgotPasswordComponent)
  },
  {
    path: 'verify-code',
    canActivate: [GuestGuard],
    loadComponent: () =>
      import('./pages/auth/verify-code/verify-code.component')
        .then(m => m.VerifyCodeComponent)
  },
  {
    path: 'reset-password',
    canActivate: [GuestGuard],
    loadComponent: () =>
      import('./pages/auth/reset-password/reset-password.component')
        .then(m => m.ResetPasswordComponent)
  },
  {
    path: '',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./layouts/full/full.component')
        .then(m => m.FullComponent),

    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        canActivate: [AuthGuard],
        loadComponent: () =>
          import('./pages/dashboard/dashboard.component')
            .then(m => m.DashboardComponent)
      },
      {
        path: 'workforce',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./pages/workforce/workforce.routes')
            .then(m => m.WORKFORCE_ROUTES)
      },
      {
        path: 'payroll',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./pages/payroll/payroll.routes')
            .then(m => m.PAYROLL_ROUTES)
      },
      {
        path: 'time-leave',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./pages/time-leave/time-leave.routes')
            .then(m => m.TIME_LEAVE_ROUTES)
      },
      {
        path: 'organization',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./pages/organization/organization.routes')
            .then(m => m.ORGANIZATION_ROUTES)
      },
      {
        path: 'settings',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./pages/settings/settings.routes')
            .then(m => m.SETTINGS_ROUTES)
      }
    ]
  },

  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
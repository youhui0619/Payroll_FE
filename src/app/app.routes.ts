import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/auth/login/login.component')
        .then(m => m.LoginComponent)
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./pages/auth/forgot-password/forgot-password.component')
        .then(m => m.ForgotPasswordComponent)
  },
  {
    path: 'verify-code',
    loadComponent: () =>
      import('./pages/auth/verify-code/verify-code.component')
        .then(m => m.VerifyCodeComponent)
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./pages/auth/reset-password/reset-password.component')
        .then(m => m.ResetPasswordComponent)
  },
  {
    path: '',
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
        loadComponent: () =>
          import('./pages/dashboard/dashboard.component')
            .then(m => m.DashboardComponent)
      },
      {
        path: 'workforce',
        loadChildren: () =>
          import('./pages/workforce/workforce.routes')
            .then(m => m.WORKFORCE_ROUTES)
      },
      {
        path: 'payroll',
        loadChildren: () =>
          import('./pages/payroll/payroll.routes')
            .then(m => m.PAYROLL_ROUTES)
      },
      {
        path: 'time-leave',
        loadChildren: () =>
          import('./pages/time-leave/time-leave.routes')
            .then(m => m.TIME_LEAVE_ROUTES)
      },
      {
        path: 'organization',
        loadChildren: () =>
          import('./pages/organization/organization.routes')
            .then(m => m.ORGANIZATION_ROUTES)
      },
      {
        path: 'settings',
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
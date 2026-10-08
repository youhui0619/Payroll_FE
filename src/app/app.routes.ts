import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/auth/login/login.component')
        .then(m => m.LoginComponent)
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
    ]
  },

  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
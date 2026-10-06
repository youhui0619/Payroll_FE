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
        path: 'inventory',
        loadChildren: () =>
          import('./pages/inventory/inventory.routes')
            .then(m => m.INVENTORY_ROUTES)
      },
      {
        path: 'parties',
        loadChildren: () =>
          import('./pages/parties/parties.routes')
            .then(m => m.PARTIES_ROUTES)
      },
      {
        path: 'warehouses',
        loadChildren: () =>
          import('./pages/warehouses/warehouses.routes')
            .then(m => m.WAREHOUSES_ROUTES)
      },
    ]
  },

  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
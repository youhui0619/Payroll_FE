import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideToastr } from 'ngx-toastr';
import { routes } from './app.routes';
import { MaterialIconProviders, MaterialProviders } from './shared/material-imports';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    MaterialIconProviders,
    ...MaterialProviders,
    provideToastr()
  ]
};

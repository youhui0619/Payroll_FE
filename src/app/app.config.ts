import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authErrorInterceptor } from './interceptors/auth-error.interceptor';
import { MaterialIconProviders, MaterialProviders } from './shared/material-imports';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authErrorInterceptor])),
    MaterialIconProviders,
    ...MaterialProviders
  ]
};

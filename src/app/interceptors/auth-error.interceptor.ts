import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';

export const authErrorInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);
  const isApiRequest = request.url.startsWith(environment.apiURL);
  const isLoginRequest = request.url.startsWith(`${environment.apiURL}/auth/login`);

  // Once the session is rejected, stop later API calls until the user logs in again.
  if (isApiRequest && !isLoginRequest && authService.isSessionExpired()) {
    return throwError(() => new HttpErrorResponse({
      status: 401,
      statusText: 'Unauthorized',
      url: request.url
    }));
  }

  return next(request).pipe(
    catchError((error: unknown) => {
      if (isApiRequest && !isLoginRequest && error instanceof HttpErrorResponse && error.status === 401) {
        authService.handleUnauthorized();
      }
      return throwError(() => error);
    })
  );
};

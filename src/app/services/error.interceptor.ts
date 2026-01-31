import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Unauthorized - logout user
        authService.logout();
        console.error('Unauthorized request - user logged out');
      }

      // Log error
      console.error('HTTP Error:', error);

      // Return error
      return throwError(() => error);
    })
  );
};

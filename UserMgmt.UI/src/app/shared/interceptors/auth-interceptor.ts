import {
  HttpInterceptorFn, HttpErrorResponse,
  HttpRequest, HttpHandlerFn, HttpEvent
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';

export const authInterceptor: HttpInterceptorFn =
  (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // 1. Define endpoints that DO NOT need a token
    const exemptUrls: string[] = [
      '/login',
      '/register',
      '/forgetpassword',
      '/resetpassword'
    ];

    debugger;
    // 2. Check if the current request URL contains any of the exempt URLs
    const isExempt = exemptUrls.some(url => req.url.toLowerCase().includes(url.toLowerCase()));
    if (!isExempt) {
      const token = authService.getToken();

      if (token != null && token.length > 0) {
        req = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
      }
    }

    return next(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          authService.logout();
          router.navigate(['/login']);
        }
        else if (error.status === 403) {
          router.navigate(['/unauthorized']);
        }
        return throwError(() => error);
      })
    );

  };

import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError, timeout, TimeoutError } from 'rxjs';
import { NotificationService } from '../services/notifications/notification-service';
import { inject } from '@angular/core';

export const timeoutInterceptor: HttpInterceptorFn = (req, next) => {
  const notifService = inject(NotificationService);

  return next(req).pipe(
    timeout(20000),
    catchError((error: TimeoutError) => {
      if (error.name === "TimeoutError") notifService.showNotificationToast('La solicitud esta tardando demasiado.');
      return throwError(() => error);
    })
  );
};

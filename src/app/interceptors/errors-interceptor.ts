import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { NotificationService } from '../services/notifications/notification-service';

@Injectable()
export class ErrorsInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const notifService = inject(NotificationService);

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        switch (error.status) {
          case 0:
            // Network error or server unavailable
            notifService.showNotificationToast('Error de conexión: ' + error);
            break;

          case 400:
            notifService.showNotificationToast('Solicitud Inválida ' + error.error);
            break;

          case 401:
            notifService.showNotificationToast('Sin Autorización');
            // Redirect to login if needed
            break;

          case 403:
            notifService.showNotificationToast('Denegado');
            break;

          case 404:
            notifService.showNotificationToast('No Encontrado');
            break;

          case 500:
            notifService.showNotificationToast('Error de Servidor');
            break;

          default:
            notifService.showNotificationToast('Error Inesperado: ' + error);

        }
        return throwError(() => error);
      })
    )
  }
}
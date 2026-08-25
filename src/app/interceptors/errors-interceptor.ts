import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { NotificationService } from '../services/notifications/notification-service';

@Injectable()
export class ErrorsInterceptor implements HttpInterceptor {

  private notifService = inject(NotificationService)

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        switch (error.status) {
          case 0:
            // Network error or server unavailable
            this.notifService.showNotificationToast('Error de conexión');
            break;

          case 400:
            this.notifService.showNotificationToast('Solicitud Inválida');
            break;

          case 401:
            this.notifService.showNotificationToast('Sin Autorización');
            // Redirect to login if needed
            break;

          case 403:
            this.notifService.showNotificationToast('Denegado');
            break;

          case 404:
            this.notifService.showNotificationToast('No Encontrado');
            break;

          case 500:
            this.notifService.showNotificationToast('Error del Servidor');
            break;

          default:
            this.notifService.showNotificationToast('Error Inesperado');

        }
        return throwError(() => error);
      })
    )
  }
}
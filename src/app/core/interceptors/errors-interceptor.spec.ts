import { HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { throwError } from 'rxjs';
import { ErrorsInterceptor } from '@core/interceptors/errors-interceptor';
import { NotificationService } from '@core/services/notifications/notification-service';

describe('ErrorsInterceptor', () => {
  let interceptor: ErrorsInterceptor;
  let notificationSpy: jasmine.SpyObj<NotificationService>;

  beforeEach(() => {
    notificationSpy = jasmine.createSpyObj('NotificationService', ['showNotificationToast']);

    TestBed.configureTestingModule({
      providers: [
        ErrorsInterceptor,
        { provide: NotificationService, useValue: notificationSpy }
      ]
    });

    interceptor = TestBed.inject(ErrorsInterceptor);
  });

  it('debe crearse correctamente', () => {
    expect(interceptor).toBeTruthy();
  });

  it('debe mostrar el toast para errores de conexión', () => {
    const request = new HttpRequest('GET', '/api/data');
    const next = jasmine.createSpy('next').and.returnValue(
      throwError(() => new HttpErrorResponse({ status: 0, statusText: 'Network Error' }))
    );

    interceptor.intercept(request, { handle: next }).subscribe({
      error: () => undefined
    });

    expect(notificationSpy.showNotificationToast).toHaveBeenCalledWith('Error de conexión');
  });

  it('debe mostrar el toast para error 404', () => {
    const request = new HttpRequest('GET', '/api/missing');
    const next = jasmine.createSpy('next').and.returnValue(
      throwError(() => new HttpErrorResponse({ status: 404, statusText: 'Not Found' }))
    );

    interceptor.intercept(request, { handle: next }).subscribe({
      error: () => undefined
    });

    expect(notificationSpy.showNotificationToast).toHaveBeenCalledWith('No Encontrado');
  });

  it('debe propagar el error original', () => {
    const request = new HttpRequest('GET', '/api/data');
    const error = new HttpErrorResponse({ status: 500, statusText: 'Server Error' });
    const next = jasmine.createSpy('next').and.returnValue(throwError(() => error));

    interceptor.intercept(request, { handle: next }).subscribe({
      error: caught => {
        expect(caught).toBe(error);
      }
    });
  });
});


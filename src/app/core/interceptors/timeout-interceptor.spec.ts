import { HttpRequest, HttpResponse } from '@angular/common/http';
import { fakeAsync, tick } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { of, timer } from 'rxjs';
import { NotificationService } from '@core/services/notifications/notification-service';
import { timeoutInterceptor } from '@core/interceptors/timeout-interceptor';

describe('timeoutInterceptor', () => {
  let notificationSpy: jasmine.SpyObj<NotificationService>;

  beforeEach(() => {
    notificationSpy = jasmine.createSpyObj('NotificationService', ['showNotificationToast']);

    TestBed.configureTestingModule({
      providers: [{ provide: NotificationService, useValue: notificationSpy }]
    });
  });

  it('debe existir como interceptor', () => {
    expect(timeoutInterceptor).toEqual(jasmine.any(Function));
  });

  it('debe aplicar timeout a una petición lenta', fakeAsync(() => {
    const request = new HttpRequest('GET', '/api/slow');
    const slowResponse = timer(30000).pipe(() => of(new HttpResponse({ body: { ok: true } })));

    TestBed.runInInjectionContext(() => {
      timeoutInterceptor(request, () => slowResponse).subscribe({
        error: () => {
          expect(notificationSpy.showNotificationToast).toHaveBeenCalledWith('La solicitud esta tardando demasiado.');
        }
      });
    });
    tick(20001);
  }));
});

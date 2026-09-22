import { TestBed } from '@angular/core/testing';
import { ToastController } from '@ionic/angular';
import { NotificationService } from '@core/services/notifications/notification-service';

describe('NotificationService', () => {
  let service: NotificationService;
  let toastControllerSpy: jasmine.SpyObj<ToastController>;
  let toastSpy: jasmine.SpyObj<HTMLIonToastElement>;

  beforeEach(async () => {
    toastSpy = jasmine.createSpyObj('HTMLIonToastElement', ['present']);
    toastControllerSpy = jasmine.createSpyObj('ToastController', ['create']);
    toastControllerSpy.create.and.resolveTo(toastSpy);

    TestBed.configureTestingModule({
      providers: [{ provide: ToastController, useValue: toastControllerSpy }]
    });

    service = TestBed.inject(NotificationService);
  });

  it('debe crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('debe crear y presentar un toast con el mensaje indicado', async () => {
    await service.showNotificationToast('Usuario actualizado');

    expect(toastControllerSpy.create).toHaveBeenCalledWith({
      message: 'Usuario actualizado',
      duration: 5000
    });
    expect(toastSpy.present).toHaveBeenCalled();
  });
});


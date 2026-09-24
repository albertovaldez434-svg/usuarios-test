import { TestBed } from '@angular/core/testing';
import { ModalController } from '@ionic/angular';
import { Confirmation } from '@core/services/helpers/confirmation';

describe('Confirmation', () => {
  const myTitle = 'Titulo modal';
  const myMessage = 'Mensaje modal';

  let service: Confirmation;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let modalSpy: jasmine.SpyObj<HTMLIonModalElement>;

  beforeEach(() => {
    modalSpy = jasmine.createSpyObj('HTMLIonModalElement', ['present']);
    modalControllerSpy = jasmine.createSpyObj('ModalController', ['create']);
    modalControllerSpy.create.and.resolveTo(modalSpy);

    TestBed.configureTestingModule({
      providers: [
        Confirmation,
        { provide: ModalController, useValue: modalControllerSpy }
      ]
    });

    service = TestBed.inject(Confirmation);
  });

  it('debe crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('debe iniciar con un valor nulo en el signal', () => {
    expect(service.confirmed()).toBeNull();
  });

  it('debe guardar un valor booleano en el signal', () => {
    service.setConfirmed(true);

    expect(service.confirmed()).toBeTrue();
    service.setConfirmed(false);
    expect(service.confirmed()).toBeFalse();
  });

  it('debe crear y presentar el modal de confirmación', async () => {
    await service.openConfirmationSheet(myTitle, myMessage, 'Mensaje extra');

    expect(modalControllerSpy.create).toHaveBeenCalledWith(jasmine.objectContaining({
      componentProps: {
        title: myTitle,
        msj: myMessage,
        msj2: 'Mensaje extra'
      }
    }));
    expect(modalSpy.present).toHaveBeenCalled();
  });
});


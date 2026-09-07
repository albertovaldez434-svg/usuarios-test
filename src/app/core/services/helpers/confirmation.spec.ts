import { TestBed } from '@angular/core/testing';
import { ModalController } from '@ionic/angular';

import { Confirmation } from 'src/app/core/services/helpers/confirmation';

describe('Confirmation', () => {
  const myTitle = 'Titulo modal';
  const myMessage = 'Mensaje modal';

  let service: Confirmation;
  let modalcontroller: jasmine.SpyObj<ModalController>;
  let modalSpy: jasmine.SpyObj<HTMLIonModalElement>;

  beforeEach(() => {
    modalSpy = jasmine.createSpyObj('HTMLIonModalElement', ['present']);
    modalcontroller = jasmine.createSpyObj('ModalController', ['create']);
    modalcontroller.create.and.resolveTo(modalSpy);

    TestBed.configureTestingModule({
      providers: [
        Confirmation,
        { provide: ModalController, useValue: modalcontroller }
      ]
    });

    service = TestBed.inject(Confirmation);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('El signal deberia de ser null por defecto', () => {
    expect(service.confirmed()).toBeNull();
  });

  it('El signal deberia de tener valor true', () => {
    service.confirmed.set(true);

    expect(service.confirmed()).toBe(true);
  });

  it('El signal deberia de tener valor false', () => {
    service.confirmed.set(false);

    expect(service.confirmed()).toBe(false);
  });

  it('Deberia de crear y presentar un modal', async () => {
    await service.openConfirmationSheet(myTitle, myMessage);

    expect(modalcontroller.create).toHaveBeenCalledWith(jasmine.objectContaining({
      componentProps: {
        title: myTitle,
        msj: myMessage,
        msj2: undefined
      }
    }));
    expect(modalSpy.present).toHaveBeenCalled();
  });

  it('Deberia de guardar un valor en el signal', () => {
    service.setConfirmed(true);

    expect(service.confirmed()).toBeTrue();
  })

});

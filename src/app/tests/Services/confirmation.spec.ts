import { TestBed } from '@angular/core/testing';
import { ModalController } from '@ionic/angular';

import { Confirmation } from 'src/app/core/services/helpers/confirmation';

describe('Confirmation', () => {
  const myTitle = 'Titulo modal';
  const myMessage = 'Mensaje modal';

  let service: Confirmation;
  let modalcontroller: ModalController;

  beforeEach(() => {
    TestBed.configureTestingModule({});

    modalcontroller = TestBed.inject(ModalController);
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

  it('Deberia de crear un modal', () => {
    service.openConfirmationSheet(myTitle, myMessage);

    expect(service).toHaveBeenCalled();
    expect(service.openConfirmationSheet).toHaveBeenCalledWith(myTitle, myMessage);
  });

  it('Deberia de guardar un valor en el signal', () => {
    service.setConfirmed(true);

    expect(service.confirmed()).toBeTrue();
  })

});

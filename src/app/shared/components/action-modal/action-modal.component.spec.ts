import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalController } from '@ionic/angular';
import { Confirmation } from '@core/services/helpers/confirmation';
import { ActionModalComponent } from '@shared/components/action-modal/action-modal.component';

describe('ActionModalComponent', () => {
  let component: ActionModalComponent;
  let fixture: ComponentFixture<ActionModalComponent>;
  let modalSpy: jasmine.SpyObj<ModalController>;
  let confirmationSpy: jasmine.SpyObj<Confirmation>;

  beforeEach(async () => {
    modalSpy = jasmine.createSpyObj('ModalController', ['dismiss']);
    confirmationSpy = jasmine.createSpyObj('Confirmation', ['setConfirmed']);

    await TestBed.configureTestingModule({
      imports: [ActionModalComponent],
      providers: [
        { provide: ModalController, useValue: modalSpy },
        { provide: Confirmation, useValue: confirmationSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ActionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debe cerrar el modal y marcar la confirmación como falsa', () => {
    component.close();

    expect(confirmationSpy.setConfirmed).toHaveBeenCalledWith(false);
    expect(modalSpy.dismiss).toHaveBeenCalled();
  });

  it('debe confirmar y cerrar el modal', () => {
    component.confirm();

    expect(confirmationSpy.setConfirmed).toHaveBeenCalledWith(true);
    expect(modalSpy.dismiss).toHaveBeenCalled();
  });
});

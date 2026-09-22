import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalController } from '@ionic/angular';
import { IonModalComponent } from './ion-modal.component';

describe('IonModalComponent', () => {
  let component: IonModalComponent;
  let fixture: ComponentFixture<IonModalComponent>;
  let modalSpy: jasmine.SpyObj<ModalController>;

  beforeEach(async () => {
    modalSpy = jasmine.createSpyObj('ModalController', ['dismiss']);

    await TestBed.configureTestingModule({
      imports: [IonModalComponent],
      providers: [{ provide: ModalController, useValue: modalSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(IonModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse con los valores por defecto del modal', () => {
    expect(component).toBeTruthy();
    expect(component.titulo).toBe('Titulo Modal');
    expect(component.mensaje).toBe('Hola, soy un modal de Ionic');
  });

  it('debe emitir el evento openModal al disparar triggerModal', () => {
    spyOn(component.openModal, 'emit');

    component.triggerModal();

    expect(component.openModal.emit).toHaveBeenCalled();
  });

  it('debe cerrar el modal con ModalController', () => {
    component.close();

    expect(modalSpy.dismiss).toHaveBeenCalled();
  });
});
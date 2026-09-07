import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalController, IonicModule } from '@ionic/angular';
import { IonModalComponent } from './ion-modal.component';

describe('IonModalComponent', () => {
  let component: IonModalComponent;
  let fixture: ComponentFixture<IonModalComponent>;
  let modalSpy: jasmine.SpyObj<ModalController>;

  beforeEach(async () => {
    modalSpy = jasmine.createSpyObj('ModalController', ['dismiss']);
    await TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), IonModalComponent],
      providers: [{ provide: ModalController, useValue: modalSpy }]
    }).compileComponents();
    fixture = TestBed.createComponent(IonModalComponent);
    component = fixture.componentInstance;
    (component as any).modalCtrl = modalSpy;
    fixture.detectChanges();
  });

  // Verifica la creación y los textos iniciales del modal.
  it('crea el componente con sus valores por defecto', () => {
    expect(component).toBeTruthy();
    expect(component.titulo).toBe('Titulo Modal');
    expect(component.mensaje).toBe('Hola, soy un modal de Ionic');
  });

  // Verifica que el componente emita el evento de apertura.
  it('emite el evento al activar el modal', () => {
    const emitSpy = spyOn(component.openModal, 'emit');

    component.triggerModal();

    expect(emitSpy).toHaveBeenCalled();
  });

  // Verifica que el modal se cierre mediante Ionic.
  it('cierra el modal mediante ModalController', () => {
    component.close();

    expect(modalSpy.dismiss).toHaveBeenCalled();
  });
});
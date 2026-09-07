import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';
import { RegisterFormComponent } from './register-form.component';

describe('RegisterFormComponent', () => {
  let component: RegisterFormComponent;
  let fixture: ComponentFixture<RegisterFormComponent>;
  let modalSpy: jasmine.SpyObj<ModalController>;

  beforeEach(async () => {
    modalSpy = jasmine.createSpyObj('ModalController', ['dismiss']);
    await TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), RegisterFormComponent],
      providers: [{ provide: ModalController, useValue: modalSpy }]
    }).compileComponents();
    fixture = TestBed.createComponent(RegisterFormComponent);
    component = fixture.componentInstance;
    (component as any).modalCtrl = modalSpy;
    fixture.detectChanges();
  });

  // Verifica que el formulario tenga sus controles principales.
  it('crea el formulario con sus controles principales', () => {
    expect(component).toBeTruthy();
    expect(component.registerForm.contains('firstName')).toBeTrue();
    expect(component.registerForm.contains('email')).toBeTrue();
  });

  // Verifica que un envío inválido marque el formulario.
  it('marca el formulario como enviado cuando es inválido', () => {
    component.onSubmit();

    expect(component.submitted).toBeTrue();
    expect(component.registerForm.invalid).toBeTrue();
  });

  // Verifica los interruptores de visibilidad de contraseñas.
  it('cambia la visibilidad de la contraseña', () => {
    component.togglePasswordVisibility();
    component.toggleConfPswVisibility();

    expect(component.passwordVisible).toBeTrue();
    expect(component.confPwsVisible).toBeTrue();
  });

  // Verifica que cancelar limpie y cierre el formulario.
  it('limpia el formulario y cierra el modal', () => {
    component.closeModal();

    expect(component.registerForm.value.firstName).toBeNull();
    expect(modalSpy.dismiss).toHaveBeenCalled();
  });
});
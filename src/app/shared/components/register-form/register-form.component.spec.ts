import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalController } from '@ionic/angular';
import { RegisterFormComponent } from './register-form.component';

describe('RegisterFormComponent', () => {
  let component: RegisterFormComponent;
  let fixture: ComponentFixture<RegisterFormComponent>;
  let modalSpy: jasmine.SpyObj<ModalController>;

  beforeEach(async () => {
    modalSpy = jasmine.createSpyObj('ModalController', ['dismiss']);

    await TestBed.configureTestingModule({
      imports: [RegisterFormComponent],
      providers: [{ provide: ModalController, useValue: modalSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el formulario con los campos principales', () => {
    expect(component).toBeTruthy();
    expect(component.registerForm.contains('firstName')).toBeTrue();
    expect(component.registerForm.contains('email')).toBeTrue();
    expect(component.registerForm.contains('password')).toBeTrue();
  });

  it('debe marcar el formulario como enviado cuando se intenta registrar con datos inválidos', () => {
    component.onSubmit();

    expect(component.submitted).toBeTrue();
    expect(component.registerForm.invalid).toBeTrue();
  });

  it('debe alternar la visibilidad de las contraseñas', () => {
    component.togglePasswordVisibility();
    component.toggleConfPswVisibility();

    expect(component.passwordVisible).toBeTrue();
    expect(component.confPwsVisible).toBeTrue();
  });

  it('debe limpiar el formulario y cerrar el modal', () => {
    component.closeModal();

    expect(component.registerForm.value.firstName).toBeNull();
    expect(modalSpy.dismiss).toHaveBeenCalled();
  });
});
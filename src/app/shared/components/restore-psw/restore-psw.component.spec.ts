import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalController } from '@ionic/angular';
import { of, throwError } from 'rxjs';
import { UsuariosService } from '@app/features/users/services/usuarios';
import { RestorePswComponent } from '@shared/components/restore-psw/restore-psw.component';

describe('RestorePswComponent', () => {
  let component: RestorePswComponent;
  let fixture: ComponentFixture<RestorePswComponent>;
  let modalSpy: jasmine.SpyObj<ModalController>;
  let userServiceSpy: jasmine.SpyObj<UsuariosService>;

  beforeEach(async () => {
    modalSpy = jasmine.createSpyObj('ModalController', ['dismiss']);
    userServiceSpy = jasmine.createSpyObj('UsuariosService', ['UpdatePsw']);

    await TestBed.configureTestingModule({
      imports: [RestorePswComponent],
      providers: [
        { provide: ModalController, useValue: modalSpy },
        { provide: UsuariosService, useValue: userServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RestorePswComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debe validar si las contraseñas coinciden', () => {
    component.password1 = 'abc123';
    component.password2 = 'abc123';

    component.validatePswMatch();

    expect(component.pswMatch).toBeTrue();

    component.password2 = 'otro';
    component.validatePswMatch();
    expect(component.pswMatch).toBeFalse();
  });

  it('debe actualizar la contraseña y mostrar confirmación si el servicio tiene éxito', () => {
    userServiceSpy.UpdatePsw.and.returnValue(of({}));
    const openModalSpy = spyOn(component, 'openModalFunc').and.stub();
    component.password2 = 'nueva123';

    component.sendPswData();

    expect(userServiceSpy.UpdatePsw).toHaveBeenCalledWith('nueva123');
    expect(modalSpy.dismiss).toHaveBeenCalled();
    expect(openModalSpy).toHaveBeenCalledWith(
      'Exito',
      'Se actualizo la contraseña correctamente'
    );
  });

  it('debe mostrar un error si falla la actualización de la contraseña', () => {
    userServiceSpy.UpdatePsw.and.returnValue(
      throwError(() => new Error('Error al actualizar la contraseña'))
    );
    const openModalSpy = spyOn(component, 'openModalFunc').and.stub();
    component.password2 = 'nueva123';

    component.sendPswData();

    expect(userServiceSpy.UpdatePsw).toHaveBeenCalledWith('nueva123');
    expect(modalSpy.dismiss).toHaveBeenCalled();
    expect(openModalSpy).toHaveBeenCalledWith(
      'Error',
      'Hubo un problema al actualizar la contraseña'
    );
  });

  it('debe limpiar el formulario y cerrar el modal', () => {
    component.password1 = 'a';
    component.password2 = 'a';

    component.clean();

    expect(component.password1).toBe('');
    expect(component.password2).toBe('');
    expect(component.pswMatch).toBeTrue();
    expect(modalSpy.dismiss).toHaveBeenCalled();
  });
});

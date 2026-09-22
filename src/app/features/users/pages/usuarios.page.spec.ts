import { TestBed } from '@angular/core/testing';
import { ModalController } from '@ionic/angular';
import { of } from 'rxjs';
import { AuthService } from '@features/auth/services/auth-service';
import { Users } from '@features/users/models/users';
import { UsuariosService } from '@features/users/services/usuarios';
import { Confirmation } from '@core/services/helpers/confirmation';
import { UsuariosPage } from './usuarios.page';

describe('UsuariosPage', () => {
  let component: UsuariosPage;
  let authSpy: jasmine.SpyObj<AuthService>;
  let usersSpy: jasmine.SpyObj<UsuariosService>;
  let confirmationSpy: jasmine.SpyObj<Confirmation>;
  let modalSpy: jasmine.SpyObj<ModalController>;

  const usersList: Users[] = [
    { idUser: 1, idRol: 1, nombre: 'Ana', apellidos: 'García', email: 'ana@test.com', telefono: '1111111111' },
    { idUser: 2, idRol: 2, nombre: 'Luis', apellidos: 'Pérez', email: 'luis@test.com', telefono: '2222222222' }
  ];

  beforeEach(async () => {
    authSpy = jasmine.createSpyObj<AuthService>('AuthService', [], { loggedData$: () => ({ accessToken: 'token', tokenType: 'bearer', idUser: 1, idRol: 1, nombre: 'Ana', apellidos: 'García', email: 'ana@test.com', avatar: '' }) });
    usersSpy = jasmine.createSpyObj<UsuariosService>('UsuariosService', ['getUsers', 'clearUsers', 'setUsers', 'signUpNewUser', 'editUser', 'obtenerUsuariosTest'], { users$: () => usersList });
    usersSpy.getUsers.and.returnValue(of(usersList));
    confirmationSpy = jasmine.createSpyObj<Confirmation>('Confirmation', ['setConfirmed'], { confirmed: () => null });
    modalSpy = jasmine.createSpyObj<ModalController>('ModalController', ['create']);
    modalSpy.create.and.resolveTo(jasmine.createSpyObj('HTMLIonModalElement', ['present']));

    await TestBed.configureTestingModule({
      imports: [UsuariosPage],
      providers: [
        { provide: UsuariosService, useValue: usersSpy },
        { provide: AuthService, useValue: authSpy },
        { provide: Confirmation, useValue: confirmationSpy },
        { provide: ModalController, useValue: modalSpy }
      ]
    }).compileComponents();

    component = TestBed.createComponent(UsuariosPage).componentInstance;
  });

  it('debe crearse correctamente y crear el formulario', () => {
    expect(component).toBeTruthy();
    expect(component.signupForm).toBeTruthy();
  });

  it('debe indicar si existen usuarios cargados', () => {
    expect(component.hasUsers()).toBeFalse();

    component.usuarios.set(usersList);

    expect(component.hasUsers()).toBeTrue();
  });

  it('debe seleccionar un usuario por id', () => {
    component.usuarios.set(usersList);
    component.idUserSignal.set(2);

    expect(component.selectedUser()).toEqual(usersList[1]);
  });

  it('debe cargar usuarios desde el servicio', () => {
    component.obtenerUsuarios();

    expect(usersSpy.getUsers).toHaveBeenCalled();
    expect(component.usuarios()).toEqual(usersList);
  });

  it('debe añadir un usuario nuevo a la lista', () => {
    const newUser: Users = {
      idUser: 99,
      nombre: 'Pedro',
      apellidos: 'Soto',
      email: 'pedro@test.com',
      telefono: '3333333333',
      idRol: 1
    };

    usersSpy.signUpNewUser.and.returnValue(of(newUser));
    component.usuarios.set(usersList);

    component.beginSignup(newUser);

    expect(usersSpy.signUpNewUser).toHaveBeenCalledWith({
      idUser: 0,
      nombre: 'Pedro',
      apellidos: 'Soto',
      email: 'pedro@test.com',
      telefono: '3333333333',
      idRol: 1
    });
  });

  it('debe ignorar la creación si no llega data desde el formulario', () => {
    component.beginSignup(null);

    expect(usersSpy.signUpNewUser).not.toHaveBeenCalled();
  });
});

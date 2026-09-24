import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { of } from 'rxjs';
import { LoginPage } from '@features/auth/pages/login.page';
import { AuthService } from '@features/auth/services/auth-service';
import { loginResponseDTO } from '@features/auth/models/loginDTO';
import { Users } from '@features/users/models/users';
import { UsuariosService } from '@features/users/services/usuarios';
import { TasksService } from '@features/dashboard/services/tasks-service';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let authSpy: jasmine.SpyObj<AuthService>;
  let usersSpy: jasmine.SpyObj<UsuariosService>;
  let tasksSpy: jasmine.SpyObj<TasksService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let modalSpy: jasmine.SpyObj<ModalController>;

  const fakeUser: loginResponseDTO = {
    idUser: 2,
    idRol: 1,
    accessToken: 'fake-token',
    tokenType: 'bearer',
    nombre: 'Alberto',
    apellidos: 'Valdez',
    email: 'alberto@test.com',
    avatar: ''
  };

  beforeEach(async () => {
    authSpy = jasmine.createSpyObj<AuthService>('AuthService', ['Login', 'setLoginData']);
    usersSpy = jasmine.createSpyObj<UsuariosService>('UsuariosService', ['getUsers', 'signUpNewUser', 'UpdatePsw']);
    tasksSpy = jasmine.createSpyObj<TasksService>('TasksService', ['cargarTareasUsuario']);
    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);
    modalSpy = jasmine.createSpyObj<ModalController>('ModalController', ['create', 'dismiss']);

    authSpy.Login.and.returnValue(of(fakeUser));
    usersSpy.getUsers.and.returnValue(of([]));
    tasksSpy.cargarTareasUsuario.and.returnValue(of([]));
    modalSpy.create.and.resolveTo(jasmine.createSpyObj('HTMLIonModalElement', ['present']));

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, LoginPage],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: UsuariosService, useValue: usersSpy },
        { provide: TasksService, useValue: tasksSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ModalController, useValue: modalSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debe iniciar el formulario vacío', () => {
    expect(component.loginForm.value).toEqual({ Email: '', Password: '' });
  });

  it('no debe iniciar sesión cuando el formulario está vacío', () => {
    spyOn(component, 'openModalFunc');

    component.loginFunction();

    expect(component.openModalFunc).toHaveBeenCalledWith('Error', 'Datos incorrectos, por favor ingrese un usuario y contraseña válidos');
    expect(authSpy.Login).not.toHaveBeenCalled();
  });

  it('debe iniciar sesión con éxito y navegar al dashboard', () => {
    component.loginForm.setValue({ Email: 'alberto@test.com', Password: '123456' });

    component.loginFunction();

    expect(authSpy.Login).toHaveBeenCalledWith({ Email: 'alberto@test.com', Password: '123456' });
    expect(usersSpy.getUsers).toHaveBeenCalled();
    expect(tasksSpy.cargarTareasUsuario).toHaveBeenCalledWith(2);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('debe iniciar sesión como invitado y navegar a profile', async () => {
    const setLoginDataSpy = authSpy.setLoginData.and.resolveTo();
    spyOn(component, 'openModalFunc');

    component.logginInvitado();

    expect(setLoginDataSpy).toHaveBeenCalled();
    expect(component.openModalFunc).toHaveBeenCalledWith('Alerta', 'Sesion iniciada');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/profile']);
  });

  it('debe registrar un usuario nuevo cuando se emite data válida', () => {
    const user: Users = {
      idUser: 0,
      nombre: 'Ana',
      apellidos: 'López',
      email: 'ana@test.com',
      telefono: '1234567890',
      idRol: 2,
      password: '12345678'
    };
    usersSpy.signUpNewUser.and.returnValue(of({ ...user, idUser: 10 }));

    component.getDataEmitted(user);

    expect(usersSpy.signUpNewUser).toHaveBeenCalledWith(user);
  });

  it('debe ignorar datos nulos del formulario de registro', () => {
    component.getDataEmitted(null);

    expect(usersSpy.signUpNewUser).not.toHaveBeenCalled();
  });
});

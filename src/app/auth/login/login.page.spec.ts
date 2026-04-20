import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { LoginPage } from './login.page';
import { UsuariosService } from 'src/app/services/usuarios';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;

  const mockRouter = jasmine.createSpyObj('Router', ['navigate']);
  const mockUserService = jasmine.createSpyObj('UsuariosService', ['Login', 'setLogin']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginPage],
      imports: [ReactiveFormsModule, IonicModule.forRoot()],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: UsuariosService, useValue: mockUserService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the login page', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with Usuario and Password controls', () => {
    expect(component.loginForm.contains('Usuario')).toBeTrue();
    expect(component.loginForm.contains('Password')).toBeTrue();
    expect(component.loginForm.value).toEqual({ Usuario: '', Password: '' });
  });

  it('should show modal when loginFunction is called with empty credentials', async () => {
    spyOn(component, 'openModalFunc').and.returnValue(Promise.resolve());

    component.loginForm.setValue({ Usuario: '', Password: '' });
    await component.loginFunction();

    expect(component.openModalFunc).toHaveBeenCalledWith(
      'Datos incorrectos, por favor ingrese un usuario y contraseña válidos'
    );
  });

  it('should log in and navigate when credentials are valid', async () => {
    const userInfo = { id: 1, Usuario: 'hawke434' };
    mockUserService.Login.and.returnValue(Promise.resolve(userInfo));
    spyOn(component, 'openModalFunc').and.returnValue(Promise.resolve());

    component.loginForm.setValue({ Usuario: 'hawke434', Password: 'Iamd3ath' });
    await component.loginFunction();

    expect(mockUserService.Login).toHaveBeenCalledWith({ Usuario: 'hawke434', Password: 'Iamd3ath' });
    expect(mockUserService.setLogin).toHaveBeenCalledWith(userInfo);
    expect(component.openModalFunc).toHaveBeenCalledWith('Sesion iniciada');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/usuarios']);
  });

  it('should show error modal when login service throws', async () => {
    mockUserService.Login.and.returnValue(Promise.reject('error')); 
    spyOn(component, 'openModalFunc').and.returnValue(Promise.resolve());

    component.loginForm.setValue({ Usuario: 'hawke434', Password: 'Iamd3ath' });
    await component.loginFunction();

    expect(component.openModalFunc).toHaveBeenCalledWith(
      'Ha ocurrido un error al iniciar sesión, por favor intente nuevamente'
    );
  });

  it('should open registration modal when registerFunction is called', async () => {
    spyOn(component, 'openModalFunc').and.returnValue(Promise.resolve());

    component.registerFunction();

    expect(component.openModalFunc).toHaveBeenCalledWith('Función de registro aún no implementada');
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { jest, describe, beforeEach, it, expect } from '@jest/globals';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { LoginPage } from './login.page';
import { UsuariosService } from 'src/app/services/usuarios';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;

  const mockRouter = {
    navigate: jest.fn()
  };

  const mockUserService = {
    Login: jest.fn(),
    setLogin: jest.fn()
  };

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

  it('should initialize the form', () => {
    expect(component.loginForm.contains('Usuario')).toBe(true);
    expect(component.loginForm.contains('Password')).toBe(true);
    expect(component.loginForm.value).toEqual({ Usuario: '', Password: '' });
  });

  it('should show modal with empty credentials', async () => {
    jest.spyOn(component, 'openModalFunc').mockResolvedValue(undefined);

    component.loginForm.setValue({ Usuario: '', Password: '' });
    await component.loginFunction();

    expect(component.openModalFunc).toHaveBeenCalledWith(
      'Datos incorrectos, por favor ingrese un usuario y contraseña válidos'
    );
  });

  it('should login and navigate', async () => {
    const userInfo = { id: 1, Usuario: 'hawke434' };
    mockUserService.Login.mockResolvedValue(userInfo);

    jest.spyOn(component, 'openModalFunc').mockResolvedValue(undefined);

    component.loginForm.setValue({ Usuario: 'hawke434', Password: 'Iamd3ath' });
    await component.loginFunction();

    expect(mockUserService.Login).toHaveBeenCalledWith({
      Usuario: 'hawke434',
      Password: 'Iamd3ath'
    });

    expect(mockUserService.setLogin).toHaveBeenCalledWith(userInfo);
    expect(component.openModalFunc).toHaveBeenCalledWith('Sesion iniciada');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/usuarios']);
  });

  it('should handle login error', async () => {
    mockUserService.Login.mockRejectedValue('error');

    jest.spyOn(component, 'openModalFunc').mockResolvedValue(undefined);

    component.loginForm.setValue({ Usuario: 'hawke434', Password: 'Iamd3ath' });
    await component.loginFunction();

    expect(component.openModalFunc).toHaveBeenCalledWith(
      'Ha ocurrido un error al iniciar sesión, por favor intente nuevamente'
    );
  });

  it('should open register modal', () => {
    jest.spyOn(component, 'openModalFunc').mockResolvedValue(undefined);

    component.registerFunction();

    expect(component.openModalFunc).toHaveBeenCalledWith(
      'Función de registro aún no implementada'
    );
  });
});
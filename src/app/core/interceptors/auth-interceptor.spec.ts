import { HttpRequest, HttpResponse } from '@angular/common/http';
import { signal, WritableSignal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AuthInterceptor } from './auth-interceptor';
import { AuthService } from '@features/auth/services/auth-service';
import { loginResponseDTO } from '@features/auth/models/loginDTO';

describe('AuthInterceptor', () => {
  let interceptor: AuthInterceptor;
  let authSpy: jasmine.SpyObj<AuthService>;
  let next: jasmine.Spy;
  let loggedData: WritableSignal<loginResponseDTO | null>;

  const user: loginResponseDTO = {
    accessToken: 'eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjQ2MzQwMDAwMDB9.signature',
    tokenType: 'bearer',
    idUser: 1,
    idRol: 1,
    nombre: 'Alberto',
    apellidos: 'Valdez',
    email: 'alberto@test.com',
    avatar: ''
  };

  beforeEach(() => {
    loggedData = signal<loginResponseDTO | null>(null);
    authSpy = jasmine.createSpyObj<AuthService>('AuthService', [], { loggedData$: loggedData });

    TestBed.configureTestingModule({
      providers: [
        AuthInterceptor,
        { provide: AuthService, useValue: authSpy }
      ]
    });

    interceptor = TestBed.inject(AuthInterceptor);
    next = jasmine.createSpy('next').and.callFake((request: HttpRequest<unknown>) => of(
      new HttpResponse({ body: { request } })
    ));
  });

  it('debe crearse correctamente', () => {
    expect(interceptor).toBeTruthy();
  });

  it('debe dejar la solicitud sin cambios cuando no hay usuario autenticado', () => {
    const request = new HttpRequest('GET', '/api/data');

    interceptor.intercept(request, { handle: next });

    expect(next).toHaveBeenCalledWith(request);
  });

  it('debe eliminar la sesión y continuar si el token ha expirado', () => {
    loggedData.set(user);
    spyOn(interceptor, 'checkTokenExpired').and.returnValue(true);
    const removeItemSpy = spyOn(localStorage, 'removeItem');
    const request = new HttpRequest('GET', '/api/data');

    interceptor.intercept(request, { handle: next });

    expect(removeItemSpy).toHaveBeenCalledWith('authUser');
    expect(next).toHaveBeenCalled();
  });

  it('debe adjuntar el header Authorization para solicitudes autenticadas', () => {
    loggedData.set(user);
    spyOn(interceptor, 'checkTokenExpired').and.returnValue(false);
    const request = new HttpRequest('GET', '/api/data');

    interceptor.intercept(request, { handle: next });

    const cloned = next.calls.mostRecent().args[0] as HttpRequest<unknown>;
    expect(cloned.headers.get('Authorization')).toContain('Bearer');
    expect(cloned.headers.get('Content-Type')).toBe('application/json');
  });
});

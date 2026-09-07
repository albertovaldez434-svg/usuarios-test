import { HttpRequest } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { AuthService } from 'src/app/features/auth/services/auth-service';
import { loginResponseDTO } from 'src/app/features/auth/models/loginDTO';
import { AuthInterceptor } from './auth-interceptor';

describe('AuthInterceptor', () => {
  let interceptor: AuthInterceptor;
  let authSpy: jasmine.SpyObj<AuthService>;
  let next: jasmine.Spy;

  const user: loginResponseDTO = {
    accessToken: 'invalid-token',
    tokenType: 'bearer',
    idUser: 1,
    idRol: 1,
    nombre: 'Test',
    apellidos: 'User',
    email: 'test@example.com',
    avatar: ''
  };

  beforeEach(() => {
    authSpy = jasmine.createSpyObj('AuthService', [], { loggedData$: () => null });
    TestBed.configureTestingModule({
      providers: [
        AuthInterceptor,
        { provide: AuthService, useValue: authSpy }
      ]
    });
    interceptor = TestBed.inject(AuthInterceptor);
    next = jasmine.createSpy('next').and.callFake((request: HttpRequest<unknown>) => request);
  });

  // Verifica que Angular pueda crear el interceptor.
  it('crea el interceptor correctamente', () => {
    expect(interceptor).toBeTruthy();
  });

  // Verifica que una petición sin sesión continúe sin modificaciones.
  it('deja la solicitud sin cambios cuando no hay sesión', () => {
    const request = new HttpRequest('GET', '/api/data');

    interceptor.intercept(request, { handle: next });

    expect(next).toHaveBeenCalledWith(request);
  });

  // Verifica que una petición autenticada reciba las cabeceras de seguridad.
  it('agrega las cabeceras a solicitudes autenticadas', () => {
    Object.defineProperty(authSpy, 'loggedData$', { value: () => user });
    spyOn(interceptor, 'checkTokenExpired').and.returnValue(false);
    const request = new HttpRequest('GET', '/api/data');

    interceptor.intercept(request, { handle: next });

    const forwarded = next.calls.mostRecent().args[0] as HttpRequest<unknown>;
    expect(forwarded.headers.has('Authorization')).toBeTrue();
    expect(forwarded.headers.get('Content-Type')).toBe('application/json');
  });
});

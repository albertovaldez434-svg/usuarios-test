import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withXhr } from '@angular/common/http';
import { SecureStorageService } from '@core/services/securestorage-service';
import { environment } from '@environments/environment';
import { loginResponseDTO } from '../models/loginDTO';
import { Login } from '../models/login';
import { AuthService } from './auth-service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let storageSpy: jasmine.SpyObj<SecureStorageService>;

  const loginData: loginResponseDTO = {
    idUser: 19,
    idRol: 1,
    nombre: 'Alberto',
    apellidos: 'Valdez Lopez',
    email: 'albertovaldez434@gmail.com',
    accessToken: '123_mytoken_test',
    tokenType: 'bearer',
    avatar: ''
  };

  beforeEach(() => {
    storageSpy = jasmine.createSpyObj<SecureStorageService>('SecureStorageService', ['setItem', 'getItem', 'clear']);
    storageSpy.setItem.and.resolveTo();

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withXhr()),
        provideHttpClientTesting(),
        { provide: SecureStorageService, useValue: storageSpy }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debe crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('debe iniciar sesión y guardar los datos en el signal y almacenamiento', async () => {
    const loginRequest: Login = {
      Email: 'albertovaldez434@gmail.com',
      Password: 'myP4ssw0rd123$'
    };

    const responsePromise = firstValueFrom(service.Login(loginRequest));
    const request = httpMock.expectOne(`${environment.URL_API}/api/Usuarios/Login`);

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(loginRequest);

    request.flush(loginData);
    const response = await responsePromise;

    expect(response).toEqual(loginData);
    expect(service.loggedData$()).toEqual(loginData);
    expect(storageSpy.setItem).toHaveBeenCalledWith('authUser', loginData);
  });

  it('debe guardar los datos del usuario autenticado en el signal', async () => {
    await service.setLoginData(loginData);

    expect(service.loggedData$()).toEqual(loginData);
  });

  it('debe limpiar la sesión y delegar la limpieza del almacenamiento', () => {
    service.clearLoginData();

    expect(service.loggedData$()).toBeNull();
    expect(storageSpy.clear).toHaveBeenCalled();
  });

  it('debe cerrar sesión llamando a clearLoginData', () => {
    service.closeSesion();

    expect(service.loggedData$()).toBeNull();
    expect(storageSpy.clear).toHaveBeenCalled();
  });
});

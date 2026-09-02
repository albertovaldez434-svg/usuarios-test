import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth-service';
import { HttpTestingController } from '@angular/common/http/testing';
import { SecureStorageService } from 'src/app/core/services/securestorage-service';
import { Login } from '../models/login';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

describe('AuthService', () => {
  let service: AuthService;

  //mockup objeto login
  const loginData = {
    idUser: 19,
    nombre: 'Alberto',
    apellidos: 'Valdez Lopez',
    email: 'albertovaldez434@gmail.com',
    accessToken: '123_mytoken_test'
  } as any;

  // mock de los servicios
  let httpMock: HttpTestingController;

  // spy/mockup del servicio del localstorage para no usar el real
  // ya que tendra su propio testing
  let storageSpy: jasmine.SpyObj<SecureStorageService>;

  beforeEach(() => {
    // se crea el objeto spy
    storageSpy = jasmine.createSpyObj('SecureStorageService', [
      'setItem', 'getItem', 'clear'
    ]);

    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController)
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Deberia de Inciar Sesión', () => {
    const loginRequest = {
      Email: 'albertovaldez434@gmail.com',
      Password: 'myP4ssw0rd123$'
    } as Login

    service.Login(loginRequest).subscribe(resp => {
      expect(resp).toEqual(loginData);
    });

    const req = httpMock.expectOne(`${environment.URL_API}/api/Usuarios/Login`);

    expect(req.request.method).toBe('POST');

    expect(req.request.body).toEqual(loginRequest);

    req.flush(loginData);
  });

  it('Primera Prueba: Deberia de guardar la informacion del login y actualizar el signal', () => {
    // llamamos el service
    service.setLoginData(loginData);

    // esperamos que los datos en el signal sean equivalentes al mockup
    expect(service.loggedData$()).toEqual(loginData);
  });

  it('Segunda Prueba: Deberia de poder recuperar la informacion del localStorage', () => {
    service.setLoginData(loginData);

    expect(service.loggedData$()).toEqual(loginData);

    expect(storageSpy.setItem).toHaveBeenCalledWith('authUser', loginData);
  });

  it('Tercera Prueba: Deberia de eliminar el loginData del signal', () => {
    //primero guardamos los datos
    service.setLoginData(loginData);

    // luego removemos los datos
    service.clearLoginData();

    //se espera que el signal ya este limpio
    expect(service.loggedData$()).toBeNull();
  });
});

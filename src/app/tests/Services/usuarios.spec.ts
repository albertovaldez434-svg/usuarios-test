// se agrega la referencia a jasmine si tienes errores
// este suele ser problema de VS Code
/// <reference types="jasmine" />

// se importa primero el testbed del core/testing
import { TestBed } from "@angular/core/testing";

//se importa los http testing controllers
import { provideHttpClientTesting, HttpTestingController } from "@angular/common/http/testing"
import { provideHttpClient } from "@angular/common/http";
import { Login } from "src/app/models/login";
import { Localstorage } from "src/app/services/localstorage";
import { UsuariosService } from "src/app/services/usuarios";
import { environment } from "src/environments/environment";


//describimos el test
describe('Usuarios Service Test', () => {

    //mockup objeto login
    const loginData = {
        idUser: 19,
        nombre: 'Alberto',
        apellidos: 'Valdez Lopez',
        email: 'albertovaldez434@gmail.com',
        accessToken: '123_mytoken_test'
    } as any;

    // mockup de lista de usuarios
    const usersMock = [
        {
            idUser: 19,
            idRol: 1,
            nombre: 'Alberto',
            apellidos: 'Valdez Lopez'
        },
        {
            idUser: 19,
            idRol: 1,
            nombre: 'Crista',
            apellidos: 'Valdez Lopez'
        },
        {
            idUser: 19,
            idRol: 1,
            nombre: 'Arturo',
            apellidos: 'Valdez Lopez'
        }

    ] as any[];

    const userResponseMock = [
        {
            idUser: 19,
            nombre: 'Alberto',
            apellidos: 'Valdez Lopez',
            email: 'albertovaldez434@gmail.com',
        }
    ] as any[]

    const userMock = {
        idUser: 19,
        idRol: 1,
        nombre: 'Arturo',
        apellidos: 'Valdez Lopez'
    } as any;


    // mock de los servicios
    let service: UsuariosService;
    let httpMock: HttpTestingController;

    // spy/mockup del servicio del localstorage para no usar el real
    // ya que tendra su propio testing
    let storageSpy: jasmine.SpyObj<Localstorage>;

    beforeEach(() => {
        // se crea el objeto spy
        storageSpy = jasmine.createSpyObj('Localstorage', [
            'setItem', 'getItem', 'clear'
        ]);

        // se confitura el testbed, se pone el servicio, se ponen los providers
        // y despues eñ servicio que tendra el spy
        TestBed.configureTestingModule({
            providers: [
                UsuariosService, provideHttpClient(), provideHttpClientTesting(),
                {
                    provide: Localstorage,
                    useValue: storageSpy
                }]
        });

        // se injectan las dependencias 
        service = TestBed.inject(UsuariosService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('Debe de crearse esta prueba de: Usuarios Service', () => {
        expect(service).toBeTruthy();
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

    it('Cuarta Prueba: Deberia de dar el set de Usuarios', async () => {
        await service.setUsers(usersMock);

        expect(service.users$()).toEqual(usersMock);

        expect(storageSpy.setItem).toHaveBeenCalledWith('users', usersMock);
    });

    it('Quinta Prueba: Deberia de poder cargar datos desde el storage', async () => {

        storageSpy.getItem.and.resolveTo(usersMock);

        await service.loadStoredData();

        expect(storageSpy.getItem).toHaveBeenCalledWith('users');

        expect(service.users$()).toEqual(usersMock);
    });

    it('Sexta Prueba: No deberia de actualizar el signal si no hay usuarios', async () => {
        storageSpy.getItem.and.resolveTo(null);

        await service.loadStoredData();

        expect(service.users$()).toBeNull();
    });

    // PRUEBAS HTTP
    it('Deberia de obtener Usuarios', () => {
        service.getUsers();

        const response = service.users$();
            
        expect(response).toEqual(userResponseMock);

        const req = httpMock.expectOne(`${environment.URL_API}/api/Usuarios`);

        expect(req.request.method).toBe('GET');

        req.flush(userResponseMock);
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

    it('Deberia de crear un nuevo usuario', () => {
        service.signUpNewUser(userMock).subscribe(resp => {
            expect(resp).toEqual(userMock);
        });

        const req = httpMock.expectOne(`${environment.URL_API}/api/Usuarios`);

        expect(req.request.method).toBe('POST');

        expect(req.request.body).toEqual(userMock);

        req.flush(userMock);
    });

    it('Deberia de editar un Usuario', () => {
        service.editUser(userMock).subscribe();

        const req = httpMock.expectOne(`${environment.URL_API}/api/Usuarios/19`);

        expect(req.request.method).toBe('PUT');

        expect(req.request.body).toEqual(userMock);

        req.flush(userMock);

    });

    it('Deberia de eliminar Usuario', () => {
        service.deleteUsuario(userMock.idUser).subscribe();

        const req = httpMock.expectOne(`${environment.URL_API}/api/Usuarios/19`);

        expect(req.request.method).toBe('DELETE');

        req.flush({});
    });

    it('Deberia de actualizar Contraseña', () => {
        const newPsw = 'Angul4T3stB3d$';

        service.UpdatePsw(newPsw).subscribe();

        const req = httpMock.expectOne(`${environment.URL_API}/api/Usuarios/UpdatePassword`);

        expect(req.request.method).toBe('POST');

        expect(req.request.body).toBe(newPsw);

        req.flush({});
    });

    it('Deberia de cargar Imagen', () => {
        const formData = new FormData;

        formData.append('image', new Blob(), 'imagen.png');

        service.cargarImagen(formData).subscribe();

        const req = httpMock.expectOne(`${environment.URL_API}/api/Usuarios/CargarImagen`);

        expect(req.request.method).toBe('POST');

        expect(req.request.body).toBe(formData);

        req.flush({});

    });

});
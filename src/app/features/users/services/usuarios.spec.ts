/// <reference types="jasmine" />

import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import {
    HttpTestingController,
    provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '@environments/environment';
import { SecureStorageService } from '@core/services/securestorage-service';
import { Users } from '@features/users/models/users';
import { UsuariosService } from '@features/users/services/usuarios';

describe('UsuariosService', () => {
    const apiUrl = `${environment.URL_API}/api/Usuarios`;

    const usersMock: Users[] = [
        {
            idUser: 19,
            idRol: 1,
            nombre: 'Alberto',
            apellidos: 'Valdez Lopez',
            email: 'alberto@test.com',
            telefono: '6441747474',
        },
        {
            idUser: 20,
            idRol: 2,
            nombre: 'Crista',
            apellidos: 'Valdez Lopez',
            email: 'crista@test.com',
            telefono: '6441747475',
        },
    ];

    const userMock: Users = {
        idUser: 19,
        idRol: 1,
        nombre: 'Arturo',
        apellidos: 'Valdez Lopez',
        email: 'arturo@test.com',
        telefono: '6441747476',
    };

    let service: UsuariosService;
    let httpMock: HttpTestingController;
    let storageSpy: jasmine.SpyObj<SecureStorageService>;

    beforeEach(() => {
        storageSpy = jasmine.createSpyObj<SecureStorageService>(
            'SecureStorageService',
            ['setItem', 'getItem', 'clear'],
        );
        storageSpy.setItem.and.resolveTo();

        TestBed.configureTestingModule({
            providers: [
                UsuariosService,
                provideHttpClient(),
                provideHttpClientTesting(),
                {
                    provide: SecureStorageService,
                    useValue: storageSpy,
                },
            ],
        });

        service = TestBed.inject(UsuariosService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('debe crearse correctamente', () => {
        expect(service).toBeTruthy();
    });

    it('debe iniciar sin usuarios cargados', () => {
        expect(service.users$()).toBeNull();
    });

    it('debe guardar los usuarios en el signal y en el almacenamiento seguro', async () => {
        await service.setUsers(usersMock);

        expect(service.users$()).toEqual(usersMock);
        expect(storageSpy.setItem).toHaveBeenCalledOnceWith('users', usersMock);
    });

    it('debe cargar los usuarios existentes desde el almacenamiento seguro', async () => {
        storageSpy.getItem.and.resolveTo(usersMock);

        await service.loadStoredData();

        expect(storageSpy.getItem).toHaveBeenCalledOnceWith('users');
        expect(service.users$()).toEqual(usersMock);
    });

    it('no debe modificar el signal cuando no hay usuarios almacenados', async () => {
        await service.setUsers(usersMock);
        storageSpy.getItem.and.resolveTo(null);

        await service.loadStoredData();

        expect(service.users$()).toEqual(usersMock);
    });

    it('debe limpiar los usuarios del signal y de localStorage', async () => {
        await service.setUsers(usersMock);
        const removeItemSpy = spyOn(localStorage, 'removeItem');

        await service.clearUsers();

        expect(service.users$()).toBeNull();
        expect(removeItemSpy).toHaveBeenCalledOnceWith('users');
    });

    it('debe cargar la lista local de usuarios de prueba en el signal', () => {
        service.obtenerUsuariosTest();

        const users = service.users$();

        expect(users).not.toBeNull();
        expect(users?.length).toBe(9);
        expect(users?.[0].nombre).toBe('Carlos');
        expect(users?.[8].nombre).toBe('Miguel');
    });

    it('debe obtener usuarios, actualizar el signal y devolver la respuesta', () => {
        let response: Users[] | undefined;

        service.getUsers().subscribe(result => {
            response = result;
        });
        const request = httpMock.expectOne(apiUrl);

        expect(request.request.method).toBe('GET');

        request.flush(usersMock);

        expect(response).toEqual(usersMock);
        expect(service.users$()).toEqual(usersMock);
    });

    it('debe obtener usuarios paginados sin agregar un filtro vacío', () => {
        service.getUsersV2(2, 10, '').subscribe();
        const request = httpMock.expectOne(
            `${apiUrl}/getUsuariosListv2?page=2&pageSize=10`,
        );

        expect(request.request.method).toBe('GET');

        request.flush(usersMock);

        expect(service.users$()).toEqual(usersMock);
    });

    it('debe obtener usuarios paginados aplicando el filtro de búsqueda', () => {
        service.getUsersV2(3, 25, 'Alberto').subscribe();
        const request = httpMock.expectOne(
            `${apiUrl}/getUsuariosListv2?page=3&pageSize=25&filtro=Alberto`,
        );

        expect(request.request.method).toBe('GET');

        request.flush(usersMock);

        expect(service.users$()).toEqual(usersMock);
    });

    it('debe crear un usuario enviando el cuerpo esperado', () => {
        let response: Users | undefined;

        service.signUpNewUser(userMock).subscribe(result => {
            response = result;
        });
        const request = httpMock.expectOne(apiUrl);

        expect(request.request.method).toBe('POST');
        expect(request.request.body).toEqual(userMock);

        request.flush(userMock);

        expect(response).toEqual(userMock);
    });

    it('debe actualizar un usuario por su identificador', () => {
        service.editUser(userMock).subscribe();
        const request = httpMock.expectOne(`${apiUrl}/${userMock.idUser}`);

        expect(request.request.method).toBe('PUT');
        expect(request.request.body).toEqual(userMock);

        request.flush(userMock);
    });

    it('debe eliminar un usuario por su identificador', () => {
        service.deleteUsuario(userMock.idUser).subscribe();
        const request = httpMock.expectOne(`${apiUrl}/${userMock.idUser}`);

        expect(request.request.method).toBe('DELETE');

        request.flush({});
    });

    it('debe actualizar la contraseña mediante POST', () => {
        const password = 'Angul4T3stB3d$';

        service.UpdatePsw(password).subscribe();
        const request = httpMock.expectOne(`${apiUrl}/UpdatePassword`);

        expect(request.request.method).toBe('POST');
        expect(request.request.body).toBe(password);

        request.flush({});
    });

    it('debe cargar una imagen como FormData', () => {
        const formData = new FormData();
        formData.append('image', new Blob(['imagen']), 'imagen.png');

        service.cargarImagen(formData).subscribe();
        const request = httpMock.expectOne(`${apiUrl}/CargarImagen`);

        expect(request.request.method).toBe('POST');
        expect(request.request.body).toBe(formData);

        request.flush({});
    });

    it('debe propagar un error HTTP al obtener usuarios sin ocultarlo', () => {
        let receivedError: HttpErrorResponse | undefined;

        service.getUsers().subscribe({
            error: error => {
                receivedError = error;
            },
        });
        const request = httpMock.expectOne(apiUrl);

        request.flush('Error del servidor', {
            status: 500,
            statusText: 'Error interno',
        });

        expect(receivedError?.status).toBe(500);
        expect(service.users$()).toBeNull();
    });

    it('debe propagar un error HTTP en una operación de escritura', () => {
        let receivedError: HttpErrorResponse | undefined;

        service.editUser(userMock).subscribe({
            error: error => {
                receivedError = error;
            },
        });
        const request = httpMock.expectOne(`${apiUrl}/${userMock.idUser}`);

        request.flush('Usuario no encontrado', {
            status: 404,
            statusText: 'No encontrado',
        });

        expect(receivedError?.status).toBe(404);
    });
});

// se agrega la referencia a jasmine si tienes errores
// este suele ser problema de VS Code
/// <reference types="jasmine" />

// se importa primero el testbed del core/testing
import { TestBed } from "@angular/core/testing";

//se importa los http testing controllers
import { provideHttpClientTesting, HttpTestingController } from "@angular/common/http/testing"

import { UsuariosService } from "./usuarios";
import { Localstorage } from "./localstorage";
import { provideHttpClient } from "@angular/common/http";
import { loginResponseDTO } from "../models/loginDTO";

//describimos el test
describe('Usuarios Service Test', () => {

    //mockup objeto login
    const loginData = {
        idUser: 19,
        nombre: 'Alberto',
        apellidos: 'Valdez Lopez',
        email: 'albertovaldez434@gmail.com',
        accessToken: '123_mytoken_test'
    } as loginResponseDTO;

    // mock de los servicios
    let service: UsuariosService;
    let httpMock: HttpTestingController;

    // spy/mockup del servicio del localstorage para no usar el real
    // ya que tendra su propio testing
    let storageSpy: jasmine.SpyObj<Localstorage>;

    beforeEach(() => {
        // se crea el objeto spy
        storageSpy = jasmine.createSpyObj('localStorage', [
            'setItem', 'getItem', 'clear'
        ]);

        // se confitura el testbed, se pone el servicio, se ponen los providers
        // y despues eñ servicio que tendra el spy
        TestBed.configureTestingModule({
            providers: [
                UsuariosService, provideHttpClient(), provideHttpClientTesting(),
                {
                    provide: localStorage, useValue: storageSpy
                }]
        });

        // se injectan las dependencias 
        service = TestBed.inject(UsuariosService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('Primera Prueba: Deberia de guardar la informacion del login y actualizar el signal', () => {
        // llamamos el service
        service.setLoginData(loginData);

        // esperamos que los datos en el signal sean equivalentes al mockup
        expect(service.loggedData$()).toEqual(loginData);

        // esperamos que el setItem haya sido llamado con ese key y ese value
        expect(storageSpy.setItem).toHaveBeenCalledWith('authUser', loginData);

    });

    it('Segunda Prueba: Deberia de poder recuperar la informacion del localStorage', () => {
        service.setLoginData(loginData);

        const storedData = localStorage.getItem('authUser');

        expect(storedData).toBeTruthy();
        expect(JSON.parse(storedData!)).toEqual(loginData);
    });

    it('Tercera Prueba: Deberia de eliminar el loginData del signal y del storage', () => {
        //primero guardamos los datos
        service.setLoginData(loginData);

        // luego removemos los datos
        service.clearLoginData();

        //se espera que el signal ya este limpio
        expect(service.loggedData$()).toBeNull();

        //se espera que el storage este limpio
        expect(storageSpy.removeItem).toHaveBeenCalledWith('authUser');
    });
})
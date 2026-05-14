import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular'
import { of } from 'rxjs';

import { LoginPage } from './login.page';
import { UsuariosService } from 'src/app/services/usuarios';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Localstorage } from 'src/app/services/localstorage';
import { AuthUser } from 'src/app/models/users';

// describe('nombre_de_prueba')
describe('LoginPage', () => {

    // component instance
    let component: LoginPage;

    // testing wrapper for component
    let fixture: ComponentFixture<LoginPage>;

    // fake service objects (mocks)
    let userServiceMock: any;
    let routerMock: any;

    beforeEach(async () => {
        /*
          Fake service methods.
          We use spies so we can verify if they were called.
        */
        userServiceMock = {
            Login: jasmine.createSpy('Login'),
            setLoginData: jasmine.createSpy('setLoginData'),
            setUser: jasmine.createSpy('setUser')
        };

        routerMock = {
            navigate: jasmine.createSpy('navigate')
        };

        // configure testing module
        await TestBed.configureTestingModule({
            declarations: [LoginPage],
            imports: [IonicModule.forRoot(), ReactiveFormsModule],
            providers: [
                { provide: UsuariosService, useValue: userServiceMock },
                { provide: Router, useValue: routerMock },
                { provide: ModalController, useValue: {} },
                { provide: Localstorage, useValue: {} }
            ]
        }).compileComponents();

        // create component
        fixture = TestBed.createComponent(LoginPage);

        // access component class
        component = fixture.componentInstance;

        // initialize component
        fixture.detectChanges();
    });

    /*
      BASIC TEST
      verifies component was created correctly
    */
    it('should create component', () => {

        expect(component).toBeTruthy();

    });

    /*
      TEST FORM INITIAL VALUES
    */
    it('should create empty login form', () => {

        expect(component.loginForm.value).toEqual({
            Email: '',
            Password: ''
        });

    });

    /*
      TEST EMPTY LOGIN
      should not call API if fields are empty
    */
    it('should not login if form is empty', () => {

        // spy on modal function
        spyOn(component, 'openModalFunc');

        // execute method
        component.loginFunction();

        // verify modal message appeared
        expect(component.openModalFunc).toHaveBeenCalled();

        // verify login service was NOT called
        expect(userServiceMock.Login).not.toHaveBeenCalled();

    });

    /*
      TEST SUCCESS LOGIN
    */
    it('should login successfully', () => {

        // fake API response
        const fakeResponse: AuthUser = {
            idRol: 1,
            idUser: 2,
            access_token: 'fake-jwt-token-123',
            token_type: 'bearer',
            userInfo: {
                email: 'albertovaldez434@gmail.com',
                idUser: 2,
                idRol: 1,
                nombre: 'Alberto',
                apellidos: 'Valdez Lopez',
                telefono: '6441727482'
            }
        };

        /*
          when Login() is called,
          return fake observable data
        */
        userServiceMock.Login.and.returnValue(
            of(fakeResponse)
        );

        // fill form
        component.loginForm.setValue({
            Email: 'test@test.com',
            Password: '123456'
        });

        // execute login
        component.loginFunction();

        // verify service was called
        expect(userServiceMock.Login).toHaveBeenCalled();

        // verify navigation
        expect(routerMock.navigate)
            .toHaveBeenCalledWith(['/profile']);

    });

});
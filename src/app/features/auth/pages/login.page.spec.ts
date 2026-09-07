import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular'
import { of } from 'rxjs';

import { LoginPage } from 'src/app/features/auth/pages/login.page';
import { UsuariosService } from 'src/app/features/users/services/usuarios';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/features/auth/services/auth-service';
import { TasksService } from 'src/app/features/dashboard/services/tasks-service';
import { loginResponseDTO } from 'src/app/features/auth/models/loginDTO';

// describe('nombre_de_prueba')
describe('LoginPage', () => {

    // component instance
    let component: LoginPage;

    // testing wrapper for component
    let fixture: ComponentFixture<LoginPage>;

    // fake service objects (mocks)
    let authServiceMock: any;
    let userServiceMock: any;
    let tasksServiceMock: any;
    let routerMock: any;

    beforeEach(async () => {
        /*
          Fake service methods.
          We use spies so we can verify if they were called.
        */
        authServiceMock = {
            Login: jasmine.createSpy('Login')
        };
        userServiceMock = {
            getUsers: jasmine.createSpy('getUsers')
        };
        tasksServiceMock = {
            cargarTareasUsuario: jasmine.createSpy('cargarTareasUsuario')
        };

        routerMock = {
            navigate: jasmine.createSpy('navigate')
        };

        // configure testing module
        await TestBed.configureTestingModule({
    imports: [IonicModule.forRoot(), ReactiveFormsModule, LoginPage],
    providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: UsuariosService, useValue: userServiceMock },
        { provide: TasksService, useValue: tasksServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ModalController, useValue: jasmine.createSpyObj('ModalController', ['create', 'dismiss']) }
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
        expect(authServiceMock.Login).not.toHaveBeenCalled();

    });

    /*
      TEST SUCCESS LOGIN
    */
    it('should login successfully', () => {

        // fake API response
        const fakeResponse: loginResponseDTO = {
            idRol: 1,
            idUser: 2,
            accessToken: 'fake-jwt-token-123',
            tokenType: 'bearer',
            email: 'albertovaldez434@gmail.com',
            nombre: 'Alberto',
            apellidos: 'Valdez Lopez',
            avatar: '....'
        };

        /*
          when Login() is called,
          return fake observable data
        */
        authServiceMock.Login.and.returnValue(
            of(fakeResponse)
        );
        userServiceMock.getUsers.and.returnValue(of([]));
        tasksServiceMock.cargarTareasUsuario.and.returnValue(of([]));

        // fill form
        component.loginForm.setValue({
            Email: 'test@test.com',
            Password: '123456'
        });

        // execute login
        component.loginFunction();

        // verify service was called
        expect(authServiceMock.Login).toHaveBeenCalledWith({
            Email: 'test@test.com',
            Password: '123456'
        });
        expect(userServiceMock.getUsers).toHaveBeenCalled();
        expect(tasksServiceMock.cargarTareasUsuario).toHaveBeenCalledWith(2);

        // verify navigation
        expect(routerMock.navigate)
            .toHaveBeenCalledWith(['/dashboard']);

    });

});
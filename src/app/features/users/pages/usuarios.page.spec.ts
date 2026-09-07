import { TestBed } from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';
import { UsuariosPage } from './usuarios.page';
import { UsuariosService } from 'src/app/features/users/services/usuarios';
import { AuthService } from 'src/app/features/auth/services/auth-service';
import { Confirmation } from 'src/app/core/services/helpers/confirmation';

describe('UsuariosPage', () => {
  let component: UsuariosPage;
  let usersSpy: any;

  beforeEach(async () => {
    usersSpy = { users$: () => null };
    await TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), UsuariosPage],
      providers: [
        { provide: UsuariosService, useValue: usersSpy },
        { provide: AuthService, useValue: { loggedData$: () => null } },
        { provide: Confirmation, useValue: { confirmed: () => null } },
        { provide: ModalController, useValue: jasmine.createSpyObj('ModalController', ['create']) }
      ]
    }).compileComponents();
    component = TestBed.createComponent(UsuariosPage).componentInstance;
  });

  // Verifica la creación de la página y su formulario.
  it('crea la página y el formulario de registro', () => {
    expect(component).toBeTruthy();
    expect(component.signupForm).toBeTruthy();
  });

  // Verifica el indicador de usuarios disponibles.
  it('indica si existen usuarios cargados', () => {
    expect(component.hasUsers()).toBeFalse();
    component.usuarios.set([{ idUser: 1, nombre: 'A', apellidos: 'B', email: 'a@b.com', telefono: '1234567890' }]);
    expect(component.hasUsers()).toBeTrue();
  });

  // Verifica la selección reactiva de un usuario.
  it('selecciona un usuario por su identificador', () => {
    const user = { idUser: 7, nombre: 'A', apellidos: 'B', email: 'a@b.com', telefono: '1234567890' };
    component.usuarios.set([user]);
    component.idUserSignal.set(7);

    expect(component.selectedUser()).toEqual(user);
  });
});
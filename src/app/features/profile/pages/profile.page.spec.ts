import { TestBed } from '@angular/core/testing';
import { IonicModule, ActionSheetController, ModalController } from '@ionic/angular';
import { ProfilePage } from './profile.page';
import { AuthService } from 'src/app/features/auth/services/auth-service';
import { UsuariosService } from 'src/app/features/users/services/usuarios';

describe('ProfilePage', () => {
  let component: ProfilePage;
  let usersSpy: any;

  beforeEach(async () => {
    usersSpy = { users$: () => null };
    await TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), ProfilePage],
      providers: [
        { provide: AuthService, useValue: { loggedData$: () => null } },
        { provide: UsuariosService, useValue: usersSpy },
        { provide: ActionSheetController, useValue: jasmine.createSpyObj('ActionSheetController', ['create']) },
        { provide: ModalController, useValue: jasmine.createSpyObj('ModalController', ['create']) }
      ]
    }).compileComponents();
    component = TestBed.createComponent(ProfilePage).componentInstance;
  });

  // Verifica la creación y el estado inicial de la imagen.
  it('crea la página con imagen vacía por defecto', () => {
    expect(component).toBeTruthy();
    expect(component.imgSrc).toBe('');
  });

  // Verifica que se encuentre el usuario autenticado.
  it('encuentra al usuario actualmente autenticado', () => {
    component.loggedUser = {
      accessToken: 'token', tokenType: 'bearer', idUser: 2, idRol: 1,
      nombre: 'Test', apellidos: 'User', email: 'test@example.com', avatar: ''
    };
    component.users = [
      { idUser: 1, nombre: 'Other', apellidos: 'User', email: 'other@example.com', telefono: '1234567890' },
      { idUser: 2, nombre: 'Test', apellidos: 'User', email: 'test@example.com', telefono: '1234567890' }
    ];

    component.findLoggedUser();

    expect(component.currentUser?.idUser).toBe(2);
  });

  // Verifica que datos vacíos no modifiquen el perfil.
  it('ignora los datos vacíos emitidos por el formulario', () => {
    component.getDataEmitted(null);

    expect(component.currentUser).toBeUndefined();
  });
});
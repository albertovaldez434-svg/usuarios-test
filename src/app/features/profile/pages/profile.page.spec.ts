import { TestBed } from '@angular/core/testing';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { of } from 'rxjs';
import { AuthService } from '@features/auth/services/auth-service';
import { UsuariosService } from '@features/users/services/usuarios';
import { Users } from '@features/users/models/users';
import { ProfilePage } from './profile.page';

describe('ProfilePage', () => {
  let component: ProfilePage;
  let authSpy: jasmine.SpyObj<AuthService>;
  let usersSpy: jasmine.SpyObj<UsuariosService>;
  let actionSheetSpy: jasmine.SpyObj<ActionSheetController>;
  let modalSpy: jasmine.SpyObj<ModalController>;

  const userList: Users[] = [
    { idUser: 1, nombre: 'Ana', apellidos: 'García', email: 'ana@test.com', telefono: '1111111111', idRol: 1 },
    { idUser: 2, nombre: 'Bruno', apellidos: 'López', email: 'bruno@test.com', telefono: '2222222222', idRol: 1 }
  ];

  beforeEach(async () => {
    authSpy = jasmine.createSpyObj<AuthService>('AuthService', [], {
      loggedData$: () => ({
        accessToken: 'token',
        tokenType: 'bearer',
        idUser: 2,
        idRol: 1,
        nombre: 'Bruno',
        apellidos: 'López',
        email: 'bruno@test.com',
        avatar: ''
      })
    });
    usersSpy = jasmine.createSpyObj<UsuariosService>('UsuariosService', ['cargarImagen', 'setUsers'], {
      users$: () => userList
    });
    usersSpy.cargarImagen.and.returnValue(of({ URLPublica: 'https://cdn.test/image.png' } as any));
    actionSheetSpy = jasmine.createSpyObj<ActionSheetController>('ActionSheetController', ['create']);
    actionSheetSpy.create.and.resolveTo(jasmine.createSpyObj('HTMLIonActionSheetElement', ['present']));
    modalSpy = jasmine.createSpyObj<ModalController>('ModalController', ['create']);
    modalSpy.create.and.resolveTo(jasmine.createSpyObj('HTMLIonModalElement', ['present']));

    await TestBed.configureTestingModule({
      imports: [ProfilePage],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: UsuariosService, useValue: usersSpy },
        { provide: ActionSheetController, useValue: actionSheetSpy },
        { provide: ModalController, useValue: modalSpy }
      ]
    }).compileComponents();

    component = TestBed.createComponent(ProfilePage).componentInstance;
  });

  it('debe crearse correctamente con imagen vacía por defecto', () => {
    expect(component).toBeTruthy();
    expect(component.imgSrc).toBe('');
  });

  it('debe encontrar el usuario autenticado dentro de la lista', () => {
    component.users = userList;
    component.loggedUser = authSpy.loggedData$();

    component.findLoggedUser();

    expect(component.currentUser).toEqual(userList[1]);
  });

  it('debe ignorar la emisión nula del formulario', () => {
    component.getDataEmitted(null);

    expect(component.currentUser).toBeUndefined();
  });

  it('debe abrir el selector de origen de imagen', async () => {
    await component.showPictureSourceOptions();

    expect(actionSheetSpy.create).toHaveBeenCalled();
  });

  it('debe subir una imagen para el usuario autenticado', () => {
    component.loggedUser = authSpy.loggedData$();

    component.uploadImage(new File(['hello'], 'img.png', { type: 'image/png' }));

    expect(usersSpy.cargarImagen).toHaveBeenCalled();
  });
});

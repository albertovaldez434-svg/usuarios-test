import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { Router, provideRouter } from '@angular/router';
import { AuthService } from 'src/app/features/auth/services/auth-service';
import { Confirmation } from 'src/app/core/services/helpers/confirmation';
import { MenuComponent } from './menu.component';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;
  let authSpy: jasmine.SpyObj<AuthService>;
  let confirmationSpy: jasmine.SpyObj<Confirmation>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authSpy = jasmine.createSpyObj('AuthService', ['closeSesion'], { loggedData$: () => ({
      idUser: 1, idRol: 1, nombre: 'Test', apellidos: 'User',
      email: 'test@example.com', accessToken: 'token', tokenType: 'bearer', avatar: ''
    }) });
    confirmationSpy = jasmine.createSpyObj('Confirmation', ['confirmed', 'openConfirmationSheet', 'setConfirmed']);
    (confirmationSpy.confirmed as jasmine.Spy).and.returnValue(null);
    await TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), MenuComponent],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Confirmation, useValue: confirmationSpy },
        provideRouter([])
      ]
    }).compileComponents();
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    spyOn(routerSpy, 'navigate').and.resolveTo(true);
    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Verifica la creación y configuración de las páginas del menú.
  it('crea el componente y carga las páginas disponibles', () => {
    expect(component).toBeTruthy();
    expect(component.pages.length).toBe(3);
  });

  // Verifica que un rol autorizado pueda ver una página.
  it('permite ver una página cuando el rol está autorizado', () => {
    expect(component.canView(component.pages[0])).toBeTrue();
  });

  // Verifica que cerrar sesión limpie la sesión y navegue al login.
  it('cierra la sesión y navega al login', async () => {
    await component.logout();

    expect(authSpy.closeSesion).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { Router, provideRouter } from '@angular/router';
import { AuthService } from '@features/auth/services/auth-service';
import { Confirmation } from '@core/services/helpers/confirmation';
import { MenuComponent } from './menu.component';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;
  let authSpy: jasmine.SpyObj<AuthService>;
  let confirmationSpy: jasmine.SpyObj<Confirmation>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authSpy = jasmine.createSpyObj<AuthService>('AuthService', ['closeSesion'], {
      loggedData$: signal({
        idUser: 1,
        idRol: 1,
        nombre: 'Test',
        apellidos: 'User',
        email: 'test@example.com',
        accessToken: 'token',
        tokenType: 'bearer',
        avatar: ''
      })
    });
    confirmationSpy = jasmine.createSpyObj<Confirmation>('Confirmation', ['openConfirmationSheet', 'setConfirmed'], {
      confirmed: signal(null)
    });

    await TestBed.configureTestingModule({
      imports: [MenuComponent],
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

  it('debe crearse y cargar las páginas disponibles', () => {
    expect(component).toBeTruthy();
    expect(component.pages.length).toBe(3);
  });

  it('debe permitir ver una página cuando el rol está autorizado', () => {
    expect(component.canView(component.pages[0])).toBeTrue();
  });

  it('debe cerrar la sesión y navegar al login', async () => {
    await component.logout();

    expect(authSpy.closeSesion).toHaveBeenCalled();
    expect(confirmationSpy.setConfirmed).toHaveBeenCalledWith(false);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});
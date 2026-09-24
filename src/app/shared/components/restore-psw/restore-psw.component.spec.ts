import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalController } from '@ionic/angular';
import { RestorePswComponent } from '@shared/components/restore-psw/restore-psw.component';

describe('RestorePswComponent', () => {
  let component: RestorePswComponent;
  let fixture: ComponentFixture<RestorePswComponent>;
  let modalSpy: jasmine.SpyObj<ModalController>;

  beforeEach(async () => {
    modalSpy = jasmine.createSpyObj('ModalController', ['dismiss']);

    await TestBed.configureTestingModule({
      imports: [RestorePswComponent],
      providers: [{ provide: ModalController, useValue: modalSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(RestorePswComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debe validar si las contraseñas coinciden', () => {
    component.password1 = 'abc123';
    component.password2 = 'abc123';

    component.validatePswMatch();

    expect(component.pswMatch).toBeTrue();

    component.password2 = 'otro';
    component.validatePswMatch();
    expect(component.pswMatch).toBeFalse();
  });

  it('debe emitir la contraseña validada', () => {
    spyOn(component.validatedPsw, 'emit');
    component.password2 = 'nueva123';

    component.sendPswData();

    expect(component.validatedPsw.emit).toHaveBeenCalledWith('nueva123');
  });

  it('debe limpiar el formulario y cerrar el modal', () => {
    component.password1 = 'a';
    component.password2 = 'a';

    component.clean();

    expect(component.password1).toBe('');
    expect(component.password2).toBe('');
    expect(component.pswMatch).toBeTrue();
    expect(modalSpy.dismiss).toHaveBeenCalled();
  });
});

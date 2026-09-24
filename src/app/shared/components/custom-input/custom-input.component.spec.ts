import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomInputComponent } from '@shared/components/custom-input/custom-input.component';

describe('CustomInputComponent', () => {
  let component: CustomInputComponent;
  let fixture: ComponentFixture<CustomInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomInputComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CustomInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debe escribir un valor y emitirlo al cambiar la entrada', () => {
    spyOn(component.valueChange, 'emit');
    component.registerOnChange(() => undefined);
    component.writeValue('Hola');

    component.onInput({ detail: { value: 'Hola' } });

    expect(component.value).toBe('Hola');
    expect(component.valueChange.emit).toHaveBeenCalledWith('Hola');
  });

  it('debe invocar onTouched al perder el foco', () => {
    spyOn(component, 'onTouched');

    component.handleBlur();

    expect(component.onTouched).toHaveBeenCalled();
  });
});

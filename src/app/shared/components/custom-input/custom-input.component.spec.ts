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

    component.onInput(new CustomEvent('ionInput', { detail: { value: 'Hola' } }));

    expect(component.value).toBe('Hola');
    expect(component.valueChange.emit).toHaveBeenCalledWith('Hola');
  });

  it('debe invocar onTouched al perder el foco', () => {
    spyOn(component, 'onTouched');

    component.handleBlur();

    expect(component.onTouched).toHaveBeenCalled();
  });

  it('debe propagar el valor seleccionado a los formularios y emitir el cambio', () => {
    const onChange = jasmine.createSpy('onChange');
    spyOn(component.valueChange, 'emit');
    component.registerOnChange(onChange);
    component.controlType = 'select';
    component.selectOptions = [
      { label: 'Por hacer', value: 1 },
      { label: 'En curso', value: 2 }
    ];
    component.writeValue(1);

    component.onSelectChange({ detail: { value: 2 } } as CustomEvent<{ value?: string | number | null }>);

    expect(component.value).toBe(2);
    expect(onChange).toHaveBeenCalledWith(2);
    expect(component.valueChange.emit).toHaveBeenCalledWith(2);
  });
});

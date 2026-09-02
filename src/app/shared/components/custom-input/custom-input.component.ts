import { ChangeDetectionStrategy, Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule, ControlValueAccessor } from "@angular/forms";

@Component({
  selector: 'app-custom-input',
  templateUrl: './custom-input.component.html',
  styleUrls: ['./custom-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonicModule, FormsModule, ReactiveFormsModule],
  // primero se hace el providers de lo que sera el CVA (controlvalueaccessor), para que este componente pueda ser usado como
  // form control en otros componentes/paginas
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputComponent),
      multi: true
    }
  ]
})
export class CustomInputComponent implements ControlValueAccessor {
  // @Input() labelText: string = '';
  // @Input() labelSlot: 'fixed' | 'floating' | 'stacked' | 'undefined' = 'undefined';

  @Input() iconSlot: 'start' | 'end' = 'start';
  @Input() iconName: string = '';
  @Input() placeholderText: string = '';
  @Input() inputType: 'text' | 'email' | 'tel' | 'password' = 'text';
  
  // como el template ahora se usa el ControlValueAccessor, ya no hay que poner directamente el formcontrolname
  // @Input() formCtrlName: string = '';

  @Output() valueChange = new EventEmitter<string>();
  @Output() Clicked = new EventEmitter<void>();

  value = '';

  private onChange = (value: string) => { };
  onTouched = () => { };

  constructor() { }

  // ngOnInit() { }

  writeValue(value: string): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  // Lo veremos después
  // setDisabledState(isDisabled: boolean): void {
  //   
  // }

  handleBlur() {
    this.onTouched();
  }

  onInput(event: any): void {
    const value = event.detail.value ?? '';

    this.value = value;

    this.onChange(value);

    this.valueChange.emit(value);
  }

  iconClicked(): void{ 
    this.Clicked.emit();
  }

}

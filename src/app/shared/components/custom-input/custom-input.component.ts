import { ChangeDetectionStrategy, Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule, ControlValueAccessor } from "@angular/forms";
import { IonIcon, IonInput, IonItem, IonSelect, IonSelectOption } from "@ionic/angular";

export interface CustomInputOption {
  label: string;
  value: string | number;
}

@Component({
  selector: 'app-custom-input',
  templateUrl: './custom-input.component.html',
  styleUrls: ['./custom-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, ReactiveFormsModule, IonItem, IonInput, IonIcon, IonSelect, IonSelectOption],
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
  @Input() iconSlot: 'start' | 'end' = 'start';
  @Input() iconName: string = '';
  @Input() placeholderText: string = '';
  @Input() inputType: 'text' | 'email' | 'tel' | 'password' = 'text';
  @Input() controlType: 'input' | 'select' = 'input';
  @Input() selectLabel = '';
  @Input() selectOptions: CustomInputOption[] = [];

  @Output() valueChange = new EventEmitter<string | number | null>();
  @Output() Clicked = new EventEmitter<void>();

  value: string | number | null = '';
  disabled = false;

  private onChange = (value: string | number | null) => { };
  onTouched = () => { };

  writeValue(value: string | number | null): void {
    this.value = value ?? (this.controlType === 'select' ? null : '');
  }

  registerOnChange(fn: (value: string | number | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  handleBlur(): void {
    this.onTouched();
  }

  onInput(event: CustomEvent<{ value?: string | null }>): void {
    const value = event.detail.value ?? '';

    this.value = value;

    this.onChange(value);

    this.valueChange.emit(value);
  }

  onSelectChange(event: CustomEvent<{ value?: string | number | null }>): void {
    const value = event.detail.value ?? null;

    this.value = value;
    this.onChange(value);
    this.valueChange.emit(value);
  }

  iconClicked(): void {
    this.Clicked.emit();
  }
}

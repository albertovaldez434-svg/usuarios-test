import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonButton, IonIcon } from "@ionic/angular";

@Component({
  selector: 'app-custom-button',
  templateUrl: './custom-button.component.html',
  styleUrls: ['./custom-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonButton, IonIcon],
})
export class CustomButtonComponent implements OnInit {
  @Input() text: string = '';
  @Input() iconName: string = '';
  @Input() tipoBtn: 'primary' | 'secondary' = 'primary';
  @Input() type?: 'submit' = 'submit';
  @Input() expand?: 'block' | 'full' = 'block';
  @Input() slot: 'start' | 'end' | 'icon-only' = 'start';
  @Input() size: 'large' | 'default' | 'small' = 'default';
  @Input() disabled: boolean = false;
  @Input() color?: 'danger' | 'primary' | 'warning' | 'success' | undefined = undefined;

  @Output() clicked = new EventEmitter<void>();

  constructor() { }

  ngOnInit() { }

  onClick() {
    this.clicked.emit();
  }

}

import { ChangeDetectionStrategy, Component, EventEmitter, input, Input, OnInit, Output } from '@angular/core';
import { IonicModule, IonRippleEffect } from "@ionic/angular";
import { IonButton } from "@ionic/angular/standalone";
import { CdkDragPlaceholder } from "@angular/cdk/drag-drop";

@Component({
  selector: 'app-custom-button',
  templateUrl: './custom-button.component.html',
  styleUrls: ['./custom-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonicModule],
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

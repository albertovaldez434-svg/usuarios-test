import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonicModule } from "@ionic/angular";
import { IonButton } from "@ionic/angular/standalone";
import { CdkDragPlaceholder } from "@angular/cdk/drag-drop";

@Component({
  selector: 'app-custom-button',
  templateUrl: './custom-button.component.html',
  imports: [IonicModule],
  styleUrls: ['./custom-button.component.scss'],
})
export class CustomButtonComponent implements OnInit {
  @Input() text: string = '';
  @Input() iconName: string = '';
  @Input() type: 'primary' | 'secondary' | 'submit' = 'primary';
  @Input() expand: 'block' | 'full' = 'block';
  @Input() slot: 'start' | 'end' = 'start';
  @Input() size: 'large' | 'default' | 'small' = 'default';
  @Input() class: string = '';

  @Output() clicked = new EventEmitter<void>();

  constructor() { }

  ngOnInit() { }

  onClick() {
    this.clicked.emit();
  }

}

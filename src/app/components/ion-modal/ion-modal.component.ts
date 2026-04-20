import { Component, EventEmitter, Input, input, OnInit, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-ion-modal',
  templateUrl: './ion-modal.component.html',
  styleUrls: ['./ion-modal.component.scss'],
  standalone: false
})
export class IonModalComponent implements OnInit {
  @Output() openModal = new EventEmitter<void>();
  @Input() mensaje: string = 'Hola, soy un modal de Ionic';

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() { }

  triggerModal() {
    this.openModal.emit();
  }

  close() {
    this.modalCtrl.dismiss();
  }

}

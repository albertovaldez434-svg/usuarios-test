import { ChangeDetectionStrategy, Component, EventEmitter, Input, input, OnInit, Output } from '@angular/core';
import { ModalController, IonicModule } from '@ionic/angular';

@Component({
    selector: 'app-ion-modal',
    templateUrl: './ion-modal.component.html',
    styleUrls: ['./ion-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [IonicModule]
})
export class IonModalComponent implements OnInit {
  @Output() openModal = new EventEmitter<void>();
  @Input() titulo: string = 'Titulo Modal';
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

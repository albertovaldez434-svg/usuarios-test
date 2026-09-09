import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { ModalController, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonContent } from '@ionic/angular';

@Component({
  selector: 'app-ion-modal',
  templateUrl: './ion-modal.component.html',
  styleUrls: ['./ion-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonContent]
})
export class IonModalComponent implements OnInit {
  @Output() openModal = new EventEmitter<void>();
  @Input() titulo: string = 'Titulo Modal';
  @Input() mensaje: string = 'Hola, soy un modal de Ionic';

  private modalCtrl = inject(ModalController)

  ngOnInit() { }

  triggerModal() {
    this.openModal.emit();
  }

  close() {
    this.modalCtrl.dismiss();
  }

}

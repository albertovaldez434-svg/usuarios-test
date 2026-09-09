import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonButton, IonIcon,
  IonContent, IonButtons, ModalController
} from '@ionic/angular';
import { CustomButtonComponent } from "../custom-button/custom-button.component";
import { Confirmation } from '@core/services/helpers/confirmation';

@Component({
  selector: 'app-action-modal',
  templateUrl: './action-modal.component.html',
  styleUrls: ['./action-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonHeader, IonToolbar, IonTitle, IonButton,
    IonIcon, IonContent, IonButtons, CustomButtonComponent]
})
export class ActionModalComponent {
  @Input() title: string = '';
  @Input() msj: string = '';
  @Input() msj2?: string | undefined;

  private ModalCtrl = inject(ModalController);
  private confirmationService = inject(Confirmation);

  close() {
    this.confirmationService.setConfirmed(false);
    this.ModalCtrl.dismiss();
  }

  confirm() {
    this.confirmationService.setConfirmed(true);
    this.ModalCtrl.dismiss();
  }

}

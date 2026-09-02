import { Component, inject, Input } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CustomButtonComponent } from "../custom-button/custom-button.component";
import { Confirmation } from 'src/app/core/services/helpers/confirmation';

@Component({
  selector: 'app-action-modal',
  templateUrl: './action-modal.component.html',
  styleUrls: ['./action-modal.component.scss'],
  imports: [IonicModule, CustomButtonComponent]
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

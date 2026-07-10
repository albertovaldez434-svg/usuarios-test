import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { ActionSheetController, IonicModule, ModalController } from '@ionic/angular';
import { CustomButtonComponent } from "../custom-button/custom-button.component";

@Component({
  selector: 'app-action-modal',
  templateUrl: './action-modal.component.html',
  styleUrls: ['./action-modal.component.scss'],
  imports: [IonicModule, CustomButtonComponent]
})
export class ActionModalComponent {
  @Input() title: string = '';
  @Input() msj: string = '';
  @Output() response = new EventEmitter<boolean>();

  private ModalCtrl = inject(ModalController);

  // async openActionSheet() {
  //   const actionSheet = await this.ActionCtrl.create({
  //     header: 'Test header',
  //     buttons: [
  //       {
  //         text: 'hola mundo X',
  //         icon: 'close-outline',
  //         handler: () => {
  //           console.log('closeeeed');
  //           this.response.emit('closeeeed');
  //         },
  //       },
  //       {
  //         text: 'hola mundo O',
  //         icon: 'check-outline',
  //         handler: () => {
  //           console.log('Opennnn');
  //           this.response.emit('Opennnn');
  //         },
  //       }
  //     ]
  //   });

  //   await actionSheet.present();
  // }

  close() {
    this.ModalCtrl.dismiss();
  }

  closeSession() {
    this.ModalCtrl.dismiss('logoutConfirm');
  }

}

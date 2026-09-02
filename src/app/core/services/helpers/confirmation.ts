import { inject, Injectable, signal } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ActionModalComponent } from 'src/app/shared/components/action-modal/action-modal.component';

@Injectable({
  providedIn: 'root',
})
export class Confirmation {

  private ModalCtrl = inject(ModalController);

  confirmed = signal<boolean | null>(null);

  async openConfirmationSheet(title: string, message: string, message2?: string) {
    const actionSheet = await this.ModalCtrl.create({
      component: ActionModalComponent,
      breakpoints: [0, 0.25, 0.5, 0.75],
      initialBreakpoint: 0.5,
      componentProps: {
        title: title,
        msj: message,
        msj2: message2
      },
    });

    await actionSheet.present();
  }

  setConfirmed(data:boolean) {
    this.confirmed.set(data);
  }

}

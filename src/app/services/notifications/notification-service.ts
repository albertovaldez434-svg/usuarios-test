import { inject, Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notification = inject(ToastController);

  async showNotificationToast(myMessage: string) {
    const toast = this.notification.create({
      message: myMessage,
      duration: 5000
    });

    (await toast).present();
  }
}

import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private requestCount = 0; // numero de solicitudes en curso

  private loading: HTMLIonLoadingElement | null = null;
  private isLoading = false;

  constructor(
    private loadingCtrl: LoadingController
  ) { }

  async show() {
    this.requestCount++;

    this.isLoading = true;

    if (this.requestCount > 1) {
      this.loading = await this.loadingCtrl.create({
        message: 'Cargando...',
        spinner: 'crescent'
      });
      
      await this.loading.present();
    }
  }

  async hide() {
    this.requestCount--;

    if (this.requestCount <= 0 && this.loading) {
      await this.loading.dismiss();
      this.loading = null;
      this.isLoading = false;
    }
  }

}

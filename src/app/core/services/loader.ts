import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private requestCount = 0;

  private loading: HTMLIonLoadingElement | null = null;
  private isCreating = false;

  private showTimeout: any = null;
  private readonly DELAY = 300; // ms (ajústalo a 200–500)

  constructor(private loadingCtrl: LoadingController) { }

  async show() {
    this.requestCount++;

    // Si ya hay loader o está en proceso, no hagas nada
    if (this.loading || this.isCreating) return;

    // Si ya hay un timeout pendiente, tampoco
    if (this.showTimeout) return;

    // Programa el show con delay
    this.showTimeout = setTimeout(async () => {
      this.showTimeout = null;

      // Si ya no hay requests, no mostrar
      if (this.requestCount === 0) return;

      this.isCreating = true;

      this.loading = await this.loadingCtrl.create({
        message: 'Cargando...',
        spinner: 'crescent'
      });

      await this.loading.present();

      this.isCreating = false;
    }, this.DELAY);
  }

  async hide() {
    this.requestCount = Math.max(this.requestCount - 1, 0);

    // Si ya no hay requests:
    if (this.requestCount === 0) {

      // ❌ Cancela el show si aún no se ha ejecutado
      if (this.showTimeout) {
        clearTimeout(this.showTimeout);
        this.showTimeout = null;
      }

      // ✅ Cierra loader si existe
      if (this.loading) {
        try {
          await this.loading.dismiss();
        } catch { }
        this.loading = null;
      }
    }
  }
}

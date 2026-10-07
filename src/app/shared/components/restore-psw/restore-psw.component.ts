import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import {
  ModalController, IonHeader, IonToolbar, IonTitle, IonButton, IonButtons,
  IonIcon, IonContent, IonItem, IonLabel, IonInput, IonModal
} from "@ionic/angular";
import { FormsModule } from "@angular/forms";
import { CustomButtonComponent } from "@shared/components/custom-button/custom-button.component";
import { UsuariosService } from '@app/features/users/services/usuarios';
import { NotificationService } from '@app/core/services/notifications/notification-service';

@Component({
  selector: 'app-restore-psw',
  templateUrl: './restore-psw.component.html',
  styleUrls: ['./restore-psw.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonHeader, IonHeader, FormsModule, IonHeader,
    IonToolbar, IonTitle, IonButton, IonButtons, IonIcon, IonContent, IonItem,
    IonLabel, IonInput, CustomButtonComponent]
})
export class RestorePswComponent implements OnInit {
  private userService = inject(UsuariosService);
  private modalCtrl = inject(ModalController);

  @Input() title: string = '';
  @Input() warning: boolean = false;
  // @Output() validatedPsw = new EventEmitter<string>();
  verPsw: boolean;
  verPswConf: boolean;
  pswMatch!: boolean;

  password1: string;
  password2: string;

  displayWarning = signal<boolean>(true);
  constructor() {
    this.verPsw = false;
    this.verPswConf = false;
    this.pswMatch = true;

    this.password1 = '';
    this.password2 = '';
  }

  ngOnInit() {
    setTimeout(() => {
      this.displayWarning.set(false);
    }, 3000)
  }

  async openModalFunc(titulo: string, mensaje: string) {
    const modal = this.modalCtrl.create({
      component: IonModal,
      breakpoints: [0, 0.25, 0.5, 0.75],
      initialBreakpoint: 0.5,
      cssClass: 'custom-modal',
      componentProps: {
        titulo: titulo,
        mensaje: mensaje
      }

    });

    (await modal).present();
  }

  validatePswMatch() {
    if (this.password1 === this.password2) {
      this.pswMatch = true;
    } else {
      this.pswMatch = false;
    }
  }

  sendPswData() {
    // porque lo emito si aqui esta la acción que quiero hacer??
    // this.validatedPsw.emit(this.password2);

    this.userService.UpdatePsw(this.password2).subscribe({
      next: () => {
        this.modalCtrl.dismiss();
        this.openModalFunc('Exito', 'Se actualizo la contraseña correctamente');
      },
      error: () => {
        this.modalCtrl.dismiss();
        this.openModalFunc('Error', 'Hubo un problema al actualizar la contraseña');
      }
    })


  }

  clean() {
    this.password1 = '';
    this.password2 = '';
    this.pswMatch = true;
    this.verPsw = false;
    this.verPswConf = false;
    this.modalCtrl.dismiss();
  }

  close() {
    this.modalCtrl.dismiss();
  }

}

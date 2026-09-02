import { Component, effect, inject, OnInit, ViewChild } from '@angular/core';
import { Users } from 'src/app/features/users/models/users';
import { UsuariosService } from 'src/app/features/users/services/usuarios';
import { Camera } from '@capacitor/camera';
import { ActionSheetController, IonModal, ModalController, IonicModule } from '@ionic/angular';
import { IonModalComponent } from 'src/app/shared/components/ion-modal/ion-modal.component';

import imageCompression from 'browser-image-compression';
import { loginResponseDTO } from 'src/app/features/auth/models/loginDTO';
import { CustomButtonComponent } from 'src/app/shared/components/custom-button/custom-button.component';
import { RegisterFormComponent } from 'src/app/shared/components/register-form/register-form.component';
import { AuthService } from '../../auth/services/auth-service';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.page.html',
    styleUrls: ['./profile.page.scss'],
    imports: [IonicModule, CustomButtonComponent, RegisterFormComponent]
})
export class ProfilePage implements OnInit {
  private authService = inject(AuthService);
  private usuariosService = inject(UsuariosService);

  @ViewChild('modalEditInfo') ModalEditInfo!: IonModal;
  users!: Users[] | null;
  loggedUser!: loginResponseDTO | null;
  currentUser?: Users;
  imgSrc: string = '';
  //editingUser: boolean = false;

  constructor(
    private actionSheetCtrl: ActionSheetController,
    private modalCtrl: ModalController
  ) {
    const imgData = localStorage.getItem('myImage');
    if (imgData) {
      this.imgSrc = imgData;
    }

    this.loggedUser = this.authService.loggedData$();
    if (this.loggedUser) {
      this.imgSrc = this.loggedUser.avatar;
    }

    effect(() => {
      this.users = this.usuariosService.users$();
      if (this.users) {
        this.findLoggedUser();
      }
    });
  }

  ngOnInit() {
    // // console.log('inicia pagina');
  }

  ionViewDidEnter() {
    //
  }

  ionViewWillLeave() {
    //
  }

  async openModalFunc(mensaje: string) {
    const modal = this.modalCtrl.create({
      component: IonModalComponent,
      breakpoints: [0, 0.25, 0.5, 0.75],
      initialBreakpoint: 0.5,
      cssClass: 'custom-modal',
      componentProps: {
        mensaje: mensaje
      }

    });

    (await modal).present();
  }

  findLoggedUser = () => {
    const logUser = this.users?.find(usr => usr.idUser == this.loggedUser?.idUser);
    if (logUser) {
      this.currentUser = logUser;
    }
  }

  showPictureSourceOptions = async () => {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Seleccione',
      buttons: [
        {
          text: 'Camara',
          icon: 'camera',
          handler: () => {
            this.takePictureFromCamera();
          }
        },
        {
          text: 'Galeria',
          icon: 'image',
          handler: () => {
            this.pickPictureFromGallery();
          }
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel'
        }
      ]
    });

    await actionSheet.present();
  };

  takePictureFromCamera = async () => {
    try {
      const result = await Camera.takePhoto({
        quality: 90,
        includeMetadata: true,
      });

      if (result?.webPath) {
        this.imgSrc = result.webPath;
      }

      // console.log('Format:', result.metadata?.format);
      // console.log('Resolution:', result.metadata?.resolution);
    } catch (e) {
      const error = e as any;
      const message = error.code ? `[${error.code}] ${error.message}` : error.message;
      console.error('takePhoto failed:', message);
    }
  };

  pickPictureFromGallery = async () => {
    try {
      const result = await Camera.chooseFromGallery({
        quality: 40,
        limit: 1
      });

      if (result?.results) {
        //let photo = result.results[0].webPath;
        const response = await fetch(result.results[0].webPath!);

        const blob = await response.blob();

        const file = new File([blob], `image.${result.results[0].metadata?.format ?? 'jpg'}`, { type: blob.type });

        const data = await this.compressWEBP(file);

        if (data) {
          // console.log(data);
          this.uploadImage(data);
        }
      }

      // // console.log('Format:', result.metadata?.format);
      // // console.log('Resolution:', result.metadata?.resolution);
    } catch (e) {
      const error = e as any;
      const message = error.code ? `[${error.code}] ${error.message}` : error.message;
      console.error('pickPhoto failed:', message);
    }
  };

  async compressWEBP(file: any) {
    if (!file) return;

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1280,
      useWebWorker: true,
      fileType: 'image/webp'
    };

    const compressedFile = await imageCompression(file, options);

    const formData = new FormData();
    formData.append('file', compressedFile);

    return compressedFile;
  }

  uploadImage(file: File) {
    if (!this.loggedUser) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('IdUser', this.loggedUser?.idUser.toString());

    this.usuariosService.cargarImagen(formData).subscribe({
      next: (value) => {
        // console.log(value);
        this.imgSrc = value.URLPublica;
      }, error: (err) => {
        // console.log(err);
      },
    });
  }

  editProfile() {
    // this.ModalEditInfo.present();
   
    this.modalCtrl.create({
      component: RegisterFormComponent,
      breakpoints: [0, 0.25, 0.5, 0.75, 0.90],
      initialBreakpoint: 0.90,
      componentProps: {
        userData: this.currentUser,
        Title: 'Editar Perfil',
      },
      
    });
  }

  getDataEmitted(data: Users | null) {
    if (!data) {
      //this.editingUser = false;
      return;
    }

    if (!this.users) return;

    if (data) {
      if (data.idUser === 999) {
        this.currentUser = data;
        let userIndex = this.users.findIndex(user => user.idUser == 999);

        if (userIndex !== -1) {
          this.users[userIndex] = this.currentUser;
        }

        this.usuariosService.setUsers(this.users);
        this.ModalEditInfo.dismiss();
        this.openModalFunc('Datos actualizados.');
        //this.editingUser = false;
        return;
      } else {
        this.guardarCambiosEdit();
      }
    }
  }

  guardarCambiosEdit() {

  }


}

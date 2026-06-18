import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthUser, Users } from 'src/app/models/users';
import { UsuariosService } from 'src/app/services/usuarios';
import { Camera } from '@capacitor/camera';
import { ActionSheetController, IonModal, ModalController } from '@ionic/angular';
import { IonModalComponent } from 'src/app/components/ion-modal/ion-modal.component';

import imageCompression from 'browser-image-compression';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false
})
export class ProfilePage implements OnInit {
  @ViewChild('modalEditInfo') ModalEditInfo!: IonModal;
  users!: Users[] | null;
  loggedUser!: AuthUser | null;
  currentUser?: Users;
  imgSrc: string = '';
  editingUser: boolean = false;

  usersSub!: Subscription;

  constructor(
    private userService: UsuariosService,
    private actionSheetCtrl: ActionSheetController,
    private modalCtrl: ModalController
  ) {
    const imgData = localStorage.getItem('myImage');
    if (imgData) {
      this.imgSrc = imgData;
    }

    this.loggedUser = this.userService.loggedData$();
    if (this.loggedUser) {
      this.imgSrc = this.loggedUser.avatar;
      this.currentUser = this.loggedUser.userInfo;
    }

  }

  ngOnInit() {
    // console.log('inicia pagina');
  }

  ionViewDidEnter() {
    this.usersSub = new Subscription;
    this.usersSub = this.userService.Users$.subscribe({
      next: (usersData) => {
        this.users = usersData;
        //this.findLoggedUser();
      }, error: () => {
        this.openModalFunc('Error al cargar información de usuarios');
      }
    })

  }

  ionViewWillLeave() {
    this.usersSub.unsubscribe();
  }

  async openModalFunc(mensaje: string) {
    const modal = this.modalCtrl.create({
      component: IonModalComponent,
      breakpoints: [0, 0.25, 0.5, 0.75],
      initialBreakpoint: 0.5,
      componentProps: {
        mensaje: mensaje
      }

    });

    (await modal).present();
  }

  // findLoggedUser = () => {
  //   const logUser = this.users?.find(usr => usr.idUser == this.loggedUser?.idUser);
  //   if (logUser) {
  //     this.currentUser = logUser;
  //   }
  // }

  showPictureSourceOptions = async () => {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Select picture source',
      buttons: [
        {
          text: 'Camera',
          icon: 'camera',
          handler: () => {
            this.takePictureFromCamera();
          }
        },
        {
          text: 'Photo Gallery',
          icon: 'image',
          handler: () => {
            this.pickPictureFromGallery();
          }
        },
        {
          text: 'Cancel',
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

      console.log('Format:', result.metadata?.format);
      console.log('Resolution:', result.metadata?.resolution);
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
          console.log(data);
          this.uploadImage(data);
        }
      }

      // console.log('Format:', result.metadata?.format);
      // console.log('Resolution:', result.metadata?.resolution);
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

    this.userService.cargarImagen(formData).subscribe({
      next: (value) => {
        console.log(value);
        this.imgSrc = value.URLPublica;
      }, error: (err) => {
        console.log(err);
      },
    });
  }

  editProfile() {
    this.editingUser = true;
    this.ModalEditInfo.present();
    // this.modalCtrl.create({
    //   component: RegisterFormComponent,
    //   componentProps: {
    //     userData: this.currentUser
    //   }
    // })

  }

  getDataEmitted(data: Users | null) {
    if (!this.users) {
      this.editingUser = false;
      return;
    }

    if (data) {
      if (data.idUser === 999) {
        this.currentUser = data;
        let userIndex = this.users.findIndex(user => user.idUser == 999);

        if (userIndex !== -1) {
          this.users[userIndex] = this.currentUser;
        }

        this.userService.setUsers(this.users);
        this.ModalEditInfo.dismiss();
        this.openModalFunc('Datos actualizados.');
        this.editingUser = false;
        return;
      } else {
        this.guardarCambiosEdit();
      }
    }
  }

  guardarCambiosEdit() {

  }


}

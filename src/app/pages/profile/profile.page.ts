import { Component, OnInit, ViewChild } from '@angular/core';
import { combineLatest, Subscription } from 'rxjs';
import { AuthUser, Users } from 'src/app/models/users';
import { UsuariosService } from 'src/app/services/usuarios';
import { Camera } from '@capacitor/camera';
import { ActionSheetController, IonModal, ModalController } from '@ionic/angular';
import { RegisterFormComponent } from "src/app/components/register-form/register-form.component";
import { IonModalComponent } from 'src/app/components/ion-modal/ion-modal.component';

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
  }

  ngOnInit() {
    // console.log('inicia pagina');
  }

  ionViewDidEnter() {
    this.usersSub = new Subscription;
    this.usersSub = this.userService.user$.subscribe({
      next: (usersData) => {
        this.users = usersData;
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

  findLoggedUser = () => {
    const logUser = this.users?.find(usr => usr.idUser == this.loggedUser?.idUser);
    if (logUser) {
      this.currentUser = logUser;
    }
  }

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
        includeMetadata: true,
      });

      if (result?.results) {
        const element = result.results[0];
        const rawData = `data:image/${element.metadata?.format};base64,${element.thumbnail}`;
        this.imgSrc = await this.compressBase64(rawData);
        localStorage.setItem('myImage', this.imgSrc);
      }

      // console.log('Format:', result.metadata?.format);
      // console.log('Resolution:', result.metadata?.resolution);
    } catch (e) {
      const error = e as any;
      const message = error.code ? `[${error.code}] ${error.message}` : error.message;
      console.error('pickPhoto failed:', message);
    }
  };

  async compressBase64(base64: string, maxWidth = 800, quality = 0.7): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64;

      img.onload = () => {
        const canvas = document.createElement('canvas');

        const scale = maxWidth / img.width;
        canvas.width = maxWidth;
        canvas.height = img.height * scale;

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

        const compressed = canvas.toDataURL('image/jpeg', quality);
        resolve(compressed);
      };
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
    if (!data) {
      this.openModalFunc('No se han guardado los cambios.');
      this.editingUser = false;
      return;
    }
  }

  guardarCambiosEdit() {

  }


}

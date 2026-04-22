import { Component, OnInit } from '@angular/core';
import { combineLatest, Subscription } from 'rxjs';
import { AuthUser, Users } from 'src/app/models/users';
import { UsuariosService } from 'src/app/services/usuarios';
import { Camera } from '@capacitor/camera';
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false
})
export class ProfilePage implements OnInit {
  users!: Users[] | null;
  loggedUser!: AuthUser | null;
  currentUser?: Users;
  imgSrc: string = '';

  activeSubs!: Subscription;

  constructor(
    private userService: UsuariosService,
    private actionSheetCtrl: ActionSheetController,
  ) { }

  ngOnInit() {
    // console.log('inicia pagina');
  }

  ionViewDidEnter() {
    console.log('inicia pagina');
    this.activeSubs = new Subscription;

    this.activeSubs.add(
      combineLatest([
        this.userService.LoginData$,
        this.userService.user$
      ]).subscribe(([Login, users]) => {
        this.loggedUser = Login;
        this.users = users;
        this.findLoggedUser()
      })
    );
  }

  ionViewWillLeave() {
    this.activeSubs.unsubscribe();
  }

  findLoggedUser = () => {
    console.log('buscando usuario logeado');
    const logUser = this.users?.find(usr => usr.idUser == this.loggedUser?.idUser);
    console.log(logUser);
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


}

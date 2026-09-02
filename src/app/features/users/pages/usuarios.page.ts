import { ChangeDetectionStrategy, Component, computed, effect, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { IonModal, ModalController, RefresherCustomEvent, IonicModule } from '@ionic/angular';
import { of } from 'rxjs';
import { IonModalComponent } from 'src/app/shared/components/ion-modal/ion-modal.component';
import { RestorePswComponent } from 'src/app/shared/components/restore-psw/restore-psw.component';
import { Users } from 'src/app/features/users/models/users';
import { Confirmation } from 'src/app/core/services/helpers/confirmation';
import { UsuariosService } from 'src/app/features/users/services/usuarios';
import { SearchPipe } from '../../../shared/pipes/search-pipe';
import { RegisterFormComponent } from 'src/app/shared/components/register-form/register-form.component';
import { AuthService } from '../../auth/services/auth-service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonicModule, FormsModule, SearchPipe]
})
export class UsuariosPage implements OnInit {
  private authService = inject(AuthService);
  private usersService = inject(UsuariosService);
  private loaded = false;

  @ViewChild('modalSignUp') modalSignUp!: IonModal;
  editandoUsuario: boolean = false;
  usuarioToEdit!: Users;
  //usuarios: Users[] = [];
  readonly usuarios = signal<Users[]>([]);

  signupForm: FormGroup;
  searchValue = signal('');
  idUserSignal = signal<number>(0);
  selectedUser = computed<Users | undefined>(() =>
    this.usuarios().find(usr => usr.idUser == this.idUserSignal())
  );

  constructor(
    private modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    private confirmationService: Confirmation
  ) {
    this.signupForm = this.formBuilder.group({
      Nombre: [''],
      Apellidos: [''],
      Email: [''],
      Telefono: [''],
      Rol: ['']
    });

    effect(() => {
      const usersData = this.usersService.users$();
      const result = this.confirmationService.confirmed();

      if (usersData) {
        this.usuarios.set(usersData);
      }

      if (result === true) {
        this.EliminarUsuario(this.idUserSignal());
      }
    })
  }

  ngOnInit() {
    // this.obtenerUsuarios();
  }

  ionViewDidEnter() {
    // if (!this.loaded) {
    //   this.obtenerUsuarios();
    //   this.loaded = true;
    // }

  }

  handleRefresh(event: RefresherCustomEvent) {
    setTimeout(() => {
      // Any calls to load data go here
      this.obtenerUsuarios()
      event.target.complete();
    }, 2000);
  }

  readonly hasUsers = computed(() => this.usuarios().length > 0);

  async openModalFunc(mTitulo: string, mensaje: string) {
    const modal = this.modalCtrl.create({
      component: IonModalComponent,
      breakpoints: [0, 0.25, 0.5, 0.75],
      initialBreakpoint: 0.5,
      cssClass: 'custom-modal',
      componentProps: {
        titulo: mTitulo,
        mensaje: mensaje
      }
    });

    (await modal).present();
  }

  async OpenRegisterModal(title: string) {
    const modal = this.modalCtrl.create({
      component: RegisterFormComponent,
      breakpoints: [0, 0.25, 0.5, 0.75],
      initialBreakpoint: 0.75,
      cssClass: 'custom-modal',
      componentProps: {
        Title: title,
      }
    });

    (await modal).present();
  }

  async editarPsw() {
    const pswModal = this.modalCtrl.create({
      component: RestorePswComponent,
      breakpoints: [0, 0.25, 0.5, 0.75],
      initialBreakpoint: 0.75,
      cssClass: 'custom-modal',
      componentProps: {
        title: 'Editar contraseña',
        warning: true
      }
    });

    (await pswModal).present();
  }

  obtenerUsuarios = () => {

    if (this.authService.loggedData$()?.idUser === 999) {
      this.usersService.clearUsers();
      this.usersService.obtenerUsuariosTest();
      this.usersService.setUsers(this.usuarios());
      return;
    }

    this.usersService.getUsers().subscribe({
      next: (usuarios) => {
        this.usersService.clearUsers();
        this.usuarios.set(usuarios);
        this.usersService.setUsers(this.usuarios());
      },
      error: () => {
        this.openModalFunc('Error', 'No se pudo cargar la informacion de usuarios');
      }
    });
  }

  signupFunc() {
    this.editandoUsuario = false;
    this.OpenRegisterModal('Nuevo usuario');
  }

  async beginSignup(data: Users | null) {
    if (!data) return;

    const newUser: Users = {
      idUser: 0,
      nombre: data.nombre,
      apellidos: data.apellidos,
      email: data.email,
      telefono: data.telefono,
      idRol: (data.idRol) ? data.idRol : 0,
    }

    if (this.authService.loggedData$()?.idRol == 999) {
      let newUser: Users = {
        idUser: Math.random(),
        nombre: data.nombre,
        apellidos: data.apellidos,
        email: data.email,
        telefono: data.telefono,
        idRol: (data.idRol) ? data.idRol : 0,
      }

      this.usuarios.update(usuarios => [...usuarios, newUser]);
      this.usersService.setUsers(this.usuarios());
      this.openModalFunc('Éxito', 'Usuario registrado exitosamente');
      this.signupForm.reset();
      return;
    }

    this.usersService.signUpNewUser(newUser).subscribe({
      next: (response) => {
        this.modalSignUp.dismiss();
        //this.usuarios.push(response);
        this.usuarios.update(usuarios => [...usuarios, response]);
        this.usersService.setUsers(this.usuarios());
        this.openModalFunc('Éxito', 'Usuario registrado exitosamente');
        this.signupForm.reset();
      }, error: () => {
        this.openModalFunc('Error', 'Error al registrar el usuario');
        return of([]);
      }
    });

  }

  editarUsuario(idUser: number) {
    this.editandoUsuario = true;
    const userSelected = this.usuarios().find(u => u.idUser === idUser);

    if (userSelected) {
      this.usuarioToEdit = userSelected;
    }

    // let usrData: Users = {
    //   idUser: this.usuarioToEdit.idUser,
    //   nombre: this.usuarioToEdit.nombre,
    //   apellidos: this.usuarioToEdit.apellidos,
    //   email: this.usuarioToEdit.email,
    //   telefono: this.usuarioToEdit.telefono,
    //   idRol: this.usuarioToEdit.idRol
    // };

    this.OpenRegisterModal('Editar usuario');
  }

  guardarCambiosUsuario() {
    const formData = this.signupForm.value;
    if (this.usuarioToEdit) {
      this.usuarioToEdit.nombre = formData.Nombre;
      this.usuarioToEdit.apellidos = formData.Apellidos;
      this.usuarioToEdit.email = formData.Email;
      this.usuarioToEdit.telefono = formData.Telefono;
      this.usuarioToEdit.idRol = parseInt(formData.Rol);
    }

    if (this.authService.loggedData$()?.idRol == 999) {
      this.usersService.setUsers(this.usuarios());
      //// console.log(this.usuarios());
      this.modalSignUp.dismiss();
      this.openModalFunc('Éxito', 'Usuario registrado exitosamente');
      this.signupForm.reset();
      this.editandoUsuario = false;
      return;
    }

    this.usersService.editUser(this.usuarioToEdit).subscribe({
      next: () => {
        this.modalSignUp.dismiss();
        this.editandoUsuario = false;
      },
      error: (error) => {
        // console.log(error);
        this.openModalFunc('Error', 'Error al editar el usuario');
      }
    });

  }

  ElimiarUsrEvent(idUser: number) {
    this.idUserSignal.set(idUser);
    const data = this.selectedUser();
    if (!data) {
      this.openModalFunc('Error', 'No se selecciono un usuario.');
      return;
    }
    this.confirmationService.openConfirmationSheet('Eliminar Usuario', 'Va a eliminar a este usuario, ¿Desea continuar?',
      '' + data?.nombre + ' ' + data.apellidos);
  }

  EliminarUsuario(idUser: number) {

    if (this.authService.loggedData$()?.idRol === 999) {
      this.usuarios.update(usr => usr.filter(u => u.idUser !== idUser));
      //this.usersService.setUsers(this.usuarios);
      this.openModalFunc('Éxito', 'Usuario eliminado');
      return;
    }

    this.usersService.deleteUsuario(idUser).subscribe({
      next: () => {
        this.openModalFunc('Éxito', 'Usuario eliminado');
        this.usuarios.update(usr => usr.filter(u => u.idUser !== idUser));
        //this.usersService.setUsers(this.usuarios);
        this.idUserSignal.set(0);
        this.confirmationService.setConfirmed(false);
      },
      error: (error) => {
        // console.log(error);
        this.openModalFunc('Error', 'Error al eliminar usuario');
      }
    });
  }

}

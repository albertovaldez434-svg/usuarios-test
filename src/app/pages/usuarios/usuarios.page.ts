import { ChangeDetectionStrategy, Component, computed, effect, OnInit, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IonModal, ModalController, RefresherCustomEvent } from '@ionic/angular';
import { of } from 'rxjs';
import { IonModalComponent } from 'src/app/shared/ion-modal/ion-modal.component';
import { RestorePswComponent } from 'src/app/shared/restore-psw/restore-psw.component';
import { Users } from 'src/app/models/users';
import { Confirmation } from 'src/app/services/helpers/confirmation';
import { UsuariosService } from 'src/app/services/usuarios';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsuariosPage implements OnInit {
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
    private usersService: UsuariosService,
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

  obtenerUsuarios = () => {

    if (this.usersService.loggedData$()?.idUser === 999) {
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
        this.openModalFunc('No se pudo cargar la informacion de usuarios');
      }
    });
  }

  signupFunc() {
    this.editandoUsuario = false;
    this.modalSignUp.present();
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

    if (this.usersService.loggedData$()?.idRol == 999) {
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
      this.openModalFunc('Usuario registrado exitosamente');
      this.signupForm.reset();
      return;
    }

    this.usersService.signUpNewUser(newUser).subscribe({
      next: (response) => {
        this.modalSignUp.dismiss();
        //this.usuarios.push(response);
        this.usuarios.update(usuarios => [...usuarios, response]);
        this.usersService.setUsers(this.usuarios());
        this.openModalFunc('Usuario registrado exitosamente');
        this.signupForm.reset();
      }, error: () => {
        this.openModalFunc('Error al registrar el usuario');
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

    this.modalSignUp.present();
  }

  guardarCambiosUsuario() {
    const formData = this.signupForm.value;
    if (this.usuarioToEdit) {
      this.usuarioToEdit.nombre = formData.Nombre;
      this.usuarioToEdit.apellidos = formData.Apellidos;
      this.usuarioToEdit.email = formData.Email;
      this.usuarioToEdit.telefono = formData.Telefono;
      this.usuarioToEdit.idRol = parseInt(formData.Rol)
    }

    if (this.usersService.loggedData$()?.idRol == 999) {
      this.usersService.setUsers(this.usuarios());
      //// console.log(this.usuarios());
      this.modalSignUp.dismiss();
      this.openModalFunc('Usuario registrado exitosamente');
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
        this.openModalFunc('Error al editar el usuario');
      }
    });

  }

  ElimiarUsrEvent(idUser: number) {
    this.idUserSignal.set(idUser);
    const data = this.selectedUser();
    if (!data) {
      this.openModalFunc('No se selecciono un usuario.');
      return;
    }
    this.confirmationService.openConfirmationSheet('Eliminar Usuario', 'Va a eliminar a este usuario, ¿Desea continuar?',
      '' + data?.nombre + ' ' + data.apellidos);
  }

  EliminarUsuario(idUser: number) {

    if (this.usersService.loggedData$()?.idRol === 999) {
      this.usuarios.update(usr => usr.filter(u => u.idUser !== idUser));
      //this.usersService.setUsers(this.usuarios);
      this.openModalFunc('Usuario eliminado');
      return;
    }

    this.usersService.deleteUsuario(idUser).subscribe({
      next: () => {
        this.openModalFunc('Usuario eliminado');
        this.usuarios.update(usr => usr.filter(u => u.idUser !== idUser));
        //this.usersService.setUsers(this.usuarios);
        this.idUserSignal.set(0);
        this.confirmationService.setConfirmed(false);
      },
      error: (error) => {
        // console.log(error);
        this.openModalFunc('Error al eliminar usuario');
      }
    });
  }

  async editarPsw() {
    const pswModal = this.modalCtrl.create({
      component: RestorePswComponent,
      breakpoints: [0, 0.25, 0.5, 0.75],
      initialBreakpoint: 0.75,
      componentProps: {
        title: 'Editar Psw',
        warning: true
      }
    });

    (await pswModal).present();
  }

}

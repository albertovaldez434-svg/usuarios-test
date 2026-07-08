import { ChangeDetectionStrategy, Component, computed, OnInit, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IonModal, ModalController, RefresherCustomEvent } from '@ionic/angular';
import { of } from 'rxjs';
import { IonModalComponent } from 'src/app/components/ion-modal/ion-modal.component';
import { Users } from 'src/app/models/users';
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

  constructor(
    private usersService: UsuariosService,
    private modalCtrl: ModalController,
    private formBuilder: FormBuilder
  ) {
    this.signupForm = this.formBuilder.group({
      Nombre: [''],
      Apellidos: [''],
      Email: [''],
      Telefono: [''],
      Rol: ['']
    });
  }

  ngOnInit() {
    // this.obtenerUsuarios();
  }

  ionViewDidEnter() {
    if (!this.loaded) {
      this.obtenerUsuarios();
      this.loaded = true;
    }

  }

  handleRefresh(event: RefresherCustomEvent) {
    setTimeout(() => {
      // Any calls to load data go here
      this.obtenerUsuarios()
      event.target.complete();
    }, 2000);
  }

  readonly hasUsers = computed(()=> this.usuarios().length > 0);

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

  obtenerUsuariosTest() {
    const usersList: Users[] = [
      {
        idUser: 3,
        nombre: "Carlos",
        apellidos: "Ramírez López",
        email: "carlos.ramirez@test.com",
        telefono: "6441747474",
        idRol: 2,
        password: "Carlos123!"
      },
      {
        idUser: 4,
        nombre: "María",
        apellidos: "González Torres",
        email: "maria.gonzalez@test.com",
        telefono: "6441747474",
        idRol: 2,
        password: "Maria123!"
      },
      {
        idUser: 5,
        nombre: "Luis",
        apellidos: "Fernández Ruiz",
        email: "luis.fernandez@test.com",
        telefono: "6441747474",
        idRol: 2,
        password: "Luis123!"
      },
      {
        idUser: 6,
        nombre: "Ana",
        apellidos: "Martínez Vega",
        email: "ana.martinez@test.com",
        telefono: "6441747474",
        idRol: 2,
        password: "Ana123!"
      },
      {
        idUser: 7,
        nombre: "Jorge",
        apellidos: "Hernández Castro",
        email: "jorge.hernandez@test.com",
        telefono: "6441747474",
        idRol: 2,
        password: "Jorge123!"
      },
      {
        idUser: 8,
        nombre: "Fernanda",
        apellidos: "Soto Navarro",
        email: "fernanda.soto@test.com",
        telefono: "6441747474",
        idRol: 2,
        password: "Fer123!"
      },
      {
        idUser: 9,
        nombre: "Ricardo",
        apellidos: "Morales Díaz",
        email: "ricardo.morales@test.com",
        telefono: "6441747474",
        idRol: 2,
        password: "Ricardo123!"
      },
      {
        idUser: 10,
        nombre: "Daniela",
        apellidos: "Pérez Silva",
        email: "daniela.perez@test.com",
        telefono: "6441747474",
        idRol: 2,
        password: "Dani123!"
      },
      {
        idUser: 11,
        nombre: "Miguel",
        apellidos: "Ortega Reyes",
        email: "miguel.ortega@test.com",
        telefono: "6441747474",
        idRol: 2,
        password: "Miguel123!"
      },
      {
        idUser: 12,
        nombre: "Sofía",
        apellidos: "Cruz Mendoza",
        email: "sofia.cruz@test.com",
        telefono: "6441747474",
        idRol: 2,
        password: "Sofia123!"
      }
    ];

    this.usuarios.set(usersList);
  }

  obtenerUsuarios = () => {

    if (this.usersService.loggedData$()?.idUser === 999) {
      this.usersService.clearUsers();
      this.obtenerUsuariosTest();
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
      console.log(this.usuarios());
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
        console.log(error);
        this.openModalFunc('Error al editar el usuario');
      }
    });

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
      },
      error: (error) => {
        console.log(error);
        this.openModalFunc('Error al eliminar usuario');
      }
    });
  }

}

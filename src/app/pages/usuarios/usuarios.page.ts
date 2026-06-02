import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { IonModal, ModalController } from '@ionic/angular';
import { catchError, of, tap } from 'rxjs';
import { IonModalComponent } from 'src/app/components/ion-modal/ion-modal.component';
import { Users } from 'src/app/models/users';
import { Localstorage } from 'src/app/services/localstorage';
import { UsuariosService } from 'src/app/services/usuarios';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
  standalone: false
})
export class UsuariosPage implements OnInit {
  private loaded = false;
  @ViewChild('modalSignUp') modalSignUp!: IonModal;
  editandoUsuario: boolean = false;
  usuarioToEdit!: Users;
  usuarios: Users[] = [];
  signupForm: FormGroup;
  searchValue: string = '';

  constructor(
    private usersService: UsuariosService,
    private secureStorage: Localstorage,
    private route: Router,
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

  obtenerUsuariosTest() {
    const usersList: Users[] = [
      {
        idUser: 3,
        nombre: "Carlos",
        apellidos: "Ramírez López",
        email: "carlos.ramirez@test.com",
        telefono: "6441747474",
        idRol: 2,
        nombreUsuario: "carlosram",
        password: "Carlos123!"
      },
      {
        idUser: 4,
        nombre: "María",
        apellidos: "González Torres",
        email: "maria.gonzalez@test.com",
        telefono: "6441747474",
        idRol: 2,
        nombreUsuario: "mariagt",
        password: "Maria123!"
      },
      {
        idUser: 5,
        nombre: "Luis",
        apellidos: "Fernández Ruiz",
        email: "luis.fernandez@test.com",
        telefono: "6441747474",
        idRol: 2,
        nombreUsuario: "luisfer",
        password: "Luis123!"
      },
      {
        idUser: 6,
        nombre: "Ana",
        apellidos: "Martínez Vega",
        email: "ana.martinez@test.com",
        telefono: "6441747474",
        idRol: 2,
        nombreUsuario: "anamv",
        password: "Ana123!"
      },
      {
        idUser: 7,
        nombre: "Jorge",
        apellidos: "Hernández Castro",
        email: "jorge.hernandez@test.com",
        telefono: "6441747474",
        idRol: 2,
        nombreUsuario: "jorgehc",
        password: "Jorge123!"
      },
      {
        idUser: 8,
        nombre: "Fernanda",
        apellidos: "Soto Navarro",
        email: "fernanda.soto@test.com",
        telefono: "6441747474",
        idRol: 2,
        nombreUsuario: "fersoto",
        password: "Fer123!"
      },
      {
        idUser: 9,
        nombre: "Ricardo",
        apellidos: "Morales Díaz",
        email: "ricardo.morales@test.com",
        telefono: "6441747474",
        idRol: 2,
        nombreUsuario: "ricmora",
        password: "Ricardo123!"
      },
      {
        idUser: 10,
        nombre: "Daniela",
        apellidos: "Pérez Silva",
        email: "daniela.perez@test.com",
        telefono: "6441747474",
        idRol: 2,
        nombreUsuario: "danips",
        password: "Dani123!"
      },
      {
        idUser: 11,
        nombre: "Miguel",
        apellidos: "Ortega Reyes",
        email: "miguel.ortega@test.com",
        telefono: "6441747474",
        idRol: 2,
        nombreUsuario: "miguelor",
        password: "Miguel123!"
      },
      {
        idUser: 12,
        nombre: "Sofía",
        apellidos: "Cruz Mendoza",
        email: "sofia.cruz@test.com",
        telefono: "6441747474",
        idRol: 2,
        nombreUsuario: "sofiacm",
        password: "Sofia123!"
      }
    ];

    this.usuarios = usersList;
  }

  obtenerUsuarios = () => {

    if (this.usersService.loggedData$()?.idUser === 999) {
      this.usersService.clearUser();
      this.obtenerUsuariosTest();
      this.usersService.setUser(this.usuarios);
      return;
    }

    this.usersService.getUsers().subscribe({
      next: (usuarios) => {
        this.usersService.clearUser();
        this.usuarios = usuarios;
        this.usersService.setUser(this.usuarios);
      },
      error: (error) => {
        this.openModalFunc('No se pudo cargar la informacion de usuarios');
      }
    });
  }

  signupFunc() {
    this.editandoUsuario = false;
    this.modalSignUp.present();
  }

  async beginSignup() {
    const formData = this.signupForm.value;

    const newUser: Users = {
      idUser: 0,
      nombre: formData.Nombre,
      apellidos: formData.Apellidos,
      email: formData.Email,
      telefono: formData.Telefono,
      idRol: parseInt(formData.Rol),
    }

    if (this.usersService.loggedData$()?.idRol == 999) {
      let newUser: Users = {
        idUser: Math.random(),
        nombre: formData.Nombre,
        apellidos: formData.Apellidos,
        email: formData.Email,
        telefono: formData.Telefono,
        idRol: parseInt(formData.Rol),
      }

      this.usuarios.push(newUser);
      this.usersService.setUser(this.usuarios);
      this.openModalFunc('Usuario registrado exitosamente');
      this.signupForm.reset();
      return;
    }

    this.usersService.signUpNewUser(newUser).subscribe({
      next: (response) => {
        this.modalSignUp.dismiss();
        this.usuarios.push(response);
        this.usersService.setUser(this.usuarios);
        this.openModalFunc('Usuario registrado exitosamente');
        this.signupForm.reset();
      }, error: (error) => {
        this.openModalFunc('Error al registrar el usuario');
        return of([]);
      }
    });

  }

  editarUsuario(idUser: number) {
    this.editandoUsuario = true;
    const userSelected = this.usuarios.find(u => u.idUser === idUser);
    if (userSelected) {
      this.usuarioToEdit = userSelected;
    }
    this.signupForm.setValue({
      Nombre: this.usuarioToEdit?.nombre,
      Apellidos: this.usuarioToEdit?.apellidos,
      Email: this.usuarioToEdit?.email,
      Telefono: this.usuarioToEdit?.telefono,
      Rol: this.usuarioToEdit.idRol?.toString()
    });
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
      this.usersService.setUser(this.usuarios);
      console.log(this.usuarios);
      this.modalSignUp.dismiss();
      this.openModalFunc('Usuario registrado exitosamente');
      this.signupForm.reset();
      this.editandoUsuario = false;
      return;
    }

    this.usersService.editUser(this.usuarioToEdit).subscribe({
      next: (respone) => {
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
      this.usuarios = this.usuarios.filter(usr => usr.idUser !== idUser);
      this.usersService.setUser(this.usuarios);
      this.openModalFunc('Usuario eliminado');
      return;
    }

    this.usersService.deleteUsuario(idUser).subscribe({
      next: () => {
        this.openModalFunc('Usuario eliminado');
        this.usuarios = this.usuarios.filter(usr => usr.idUser !== idUser);
        this.usersService.setUser(this.usuarios);
      },
      error: (error) => {
        console.log(error);
        this.openModalFunc('Error al eliminar usuario');
      }
    });
  }

}

import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { IonModal, ModalController } from '@ionic/angular';
import { catchError, of, tap } from 'rxjs';
import { IonModalComponent } from 'src/app/components/ion-modal/ion-modal.component';
import { Users } from 'src/app/models/users';
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

  constructor(
    private usersService: UsuariosService,
    private route: Router,
    private modalCtrl: ModalController,
    private formBuilder: FormBuilder
  ) {
    this.signupForm = this.formBuilder.group({
      Nombre: [''],
      Apellidos: [''],
      Email: [''],
      Telefono: [''],
    });
  }

  ngOnInit() {
    // this.obtenerUsuarios();
  }

  ionViewDidEnter() {
    if (!this.loaded) {
      console.log('ionViewDidEnter');
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


  obtenerUsuarios = () => {
    this.usersService.getUsers().subscribe({
      next: (usuarios) => {
        console.log(usuarios);
        this.usuarios = usuarios;
        this.usersService.setUser(this.usuarios);
      },
      error: (error) => {
        console.log(error);
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
    console.log(formData);

    const newUser: Users = {
      idUser: 0,
      nombre: formData.Nombre,
      apellidos: formData.Apellidos,
      email: formData.Email,
      telefono: formData.Telefono,
      idRol: 2,
    }

    this.usersService.signUpNewUser(newUser).pipe(
      tap((response) => {
        this.modalSignUp.dismiss();
        this.usuarios.push(response);
        this.usersService.setUser(this.usuarios);
        this.openModalFunc('Usuario registrado exitosamente');
        this.signupForm.reset();
      }), catchError(error => {
        console.log(error);
        this.openModalFunc('Error al registrar el usuario');
        return of([]);
      })
    );

    this.usersService.signUpNewUser(newUser).subscribe({
      next: (response) => {
        this.modalSignUp.dismiss();
        this.usuarios.push(response);
        this.usersService.setUser(this.usuarios);
        this.openModalFunc('Usuario registrado exitosamente');
        this.signupForm.reset();
      }, error: (error) => {
        console.log(error);
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
    }

    this.usersService.editUser(this.usuarioToEdit).subscribe({
      next: (respone) => {
        console.log(respone);
        this.modalSignUp.dismiss();
        this.editandoUsuario = false
      },
      error: (error) => {
        console.log(error);
        this.openModalFunc('Error al editar el usuario');
      }
    });

  }

  cerrarSesion() {
    this.usersService.clearLogin();
    this.route.navigate(['/login']);
  }

}

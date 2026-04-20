import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { IonModal, ModalController } from '@ionic/angular';
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


  obtenerUsuarios = async () => {
    try {
      const usuarios = await this.usersService.getUsers();
      console.log(usuarios);

      if (usuarios.length > 0) {
        this.usuarios = usuarios;
        this.usersService.setUser(this.usuarios);
      }
    } catch (error) {
      console.log(error);
    }
  }

  signupFunc() {
    this.editandoUsuario = false;
    this.modalSignUp.present();
  }

  async beginSignup() {
    const formData = this.signupForm.value;
    console.log(formData);

    const newUser: Users = {
      id: 0,
      nombre: formData.Nombre,
      apellidos: formData.Apellidos,
      email: formData.Email,
      telefono: formData.Telefono,
      idrol: 2,
    }

    try {
      const response = await this.usersService.signUpNewUser(newUser);
      this.modalSignUp.dismiss();
      this.usuarios.push(response);
      this.usersService.setUser(this.usuarios);
      this.openModalFunc('Usuario registrado exitosamente');
      this.signupForm.reset();
    } catch (error) {
      console.log(error);
      this.openModalFunc('Error al registrar el usuario');
    }
    this.modalSignUp.dismiss();
  }

  editarUsuario(idUser: number) {
    this.editandoUsuario = true;
    const userSelected = this.usuarios.find(u => u.id === idUser);
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

  async guardarCambiosUsuario() {
    const formData = this.signupForm.value;
    if (this.usuarioToEdit) {
      this.usuarioToEdit.nombre = formData.Nombre;
      this.usuarioToEdit.apellidos = formData.Apellidos;
      this.usuarioToEdit.email = formData.Email;
      this.usuarioToEdit.telefono = formData.Telefono;
    }

    try {
      const editedUser = await this.usersService.editUser(this.usuarioToEdit);
      console.log(editedUser);
      this.modalSignUp.dismiss();
      this.editandoUsuario = false
    } catch (error) {
      console.log(error);
      this.openModalFunc('Error al editar el usuario');
    }
  }

  cerrarSesion() {
    this.usersService.clearLogin();
    this.route.navigate(['/login']);
  }

}

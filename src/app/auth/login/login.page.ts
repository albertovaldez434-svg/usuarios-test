import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuariosService } from 'src/app/services/usuarios';
import { Login } from 'src/app/models/login';
import { IonModal, ModalController } from '@ionic/angular';
import { IonModalComponent } from 'src/app/components/ion-modal/ion-modal.component';
import { RegisterFormComponent } from 'src/app/components/register-form/register-form.component';
import { AuthUser, Users } from 'src/app/models/users';
import { loginResponseDTO } from 'src/app/models/loginDTO';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {
  //@ViewChild('registerModal') registerModal!: IonModal;
  loginForm: FormGroup;
  valid: boolean = true;

  constructor(
    private builder: FormBuilder,
    private UserService: UsuariosService,
    private route: Router,
    private modalCtrl: ModalController
  ) {
    this.loginForm = this.builder.group({
      Email: [''],
      Password: ['']
    });
  }

  ngOnInit() {
  }

  get f() { return this.loginForm.controls; }

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

  loginFunction() {
    const Mail = this.loginForm.value.Email;
    const Password = this.loginForm.value.Password;

    if (Mail == null || Mail == '' || Password == null || Password == '') {
      this.openModalFunc('Datos incorrectos, por favor ingrese un usuario y contraseña válidos');
      return;
    }

    const loginRrquest: Login = {
      Email: Mail,
      Password: Password
    };

    this.UserService.Login(loginRrquest).subscribe({
      next: (loginData) => {
        this.UserService.setLoginData(loginData);
        this.route.navigate(['/dashboard']);
      },
      error: (error) => {
        this.openModalFunc('Error al iniciar sesión, por favor intente nuevamente');
      }
    });

  }

  async registerFunction() {
    const modal = this.modalCtrl.create({
      component: RegisterFormComponent,
      breakpoints: [0, 0.25, 0.5, 0.75, 0.85],
      initialBreakpoint: 0.85,
      cssClass: 'custom-modal',
      componentProps: {
        Title: 'Registrate'
      }
    });

    (await modal).present();
    return;
  }

  getDataEmitted(data: Users | null) {
    if (data) {
      this.UserService.signUpNewUser(data).subscribe({
        next: (response) => {
          this.modalCtrl.dismiss();
          this.openModalFunc('Utilize sus credenciales para iniciar sesión');
        },
        error: (err) => {
          this.openModalFunc('Error al Registrarse, por favor intente nuevamente');
        }
      });
      this.modalCtrl.dismiss();
    } else {
      return;
    }
  }

  logginInvitado() {
    const userData: Users = {
      idUser: 999,
      idRol: 999,
      nombre: 'Usuario',
      apellidos: 'Invitado',
      email: 'example@gmail.com',
      telefono: '6441747474',
    }
    const invitadoAuth: loginResponseDTO = {
      accessToken: 'my_token_123',
      tokenType: 'my_token_123',
      idUser: 999,
      idRol: 999,
      nombre: 'Test',
      apellidos: 'Admin',
      email: 'test@user.com',
      avatar: ''
    }

    this.UserService.setLoginData(invitadoAuth);
    this.openModalFunc('Sesion iniciada');
    this.route.navigate(['/profile']);
  }


}

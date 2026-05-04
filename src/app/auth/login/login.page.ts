import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuariosService } from 'src/app/services/usuarios';
import { Login } from 'src/app/models/login';
import { IonModal, ModalController } from '@ionic/angular';
import { IonModalComponent } from 'src/app/components/ion-modal/ion-modal.component';
import { catchError, of, tap } from 'rxjs';
import { Localstorage } from 'src/app/services/localstorage';
import { RegisterFormComponent } from 'src/app/components/register-form/register-form.component';
import { Users } from 'src/app/models/users';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {
  @ViewChild('registerModal') registerModal!: IonModal;
  loginForm: FormGroup;
  valid: boolean = true;

  constructor(
    private builder: FormBuilder,
    private UserService: UsuariosService,
    private secureStorage: Localstorage,
    private route: Router,
    private modalCtrl: ModalController
  ) {
    this.loginForm = this.builder.group({
      Usuario: [''],
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
      componentProps: {
        mensaje: mensaje
      }

    });

    (await modal).present();
  }

  loginFunction() {
    const userName = this.loginForm.value.Usuario;
    const Password = this.loginForm.value.Password;

    if (userName == null || userName == '' || Password == null || Password == '') {
      this.openModalFunc('Datos incorrectos, por favor ingrese un usuario y contraseña válidos');
      return;
    }

    const loginRrquest: Login = {
      Usuario: userName,
      Password: Password
    };

    this.UserService.Login(loginRrquest).subscribe({
      next: (userInfo) => {
        console.log('iniciando subscribe');
        this.UserService.setLogin(userInfo);
        this.secureStorage.setItem('authUser', userInfo);
        this.openModalFunc('Sesion iniciada');
        this.route.navigate(['/profile']);
        console.log('finalizando');
      },
      error: (error) => {
        console.error('Login error:', error);
        this.openModalFunc('Error al iniciar sesión, por favor intente nuevamente');
        //return of([]);
      }
    });

  }

  async registerFunction() {
    const modal = this.modalCtrl.create({
      component: RegisterFormComponent,
      breakpoints: [0, 0.25, 0.5, 0.75, 0.85],
      initialBreakpoint: 0.85
    });

    (await modal).present();
    return;
  }

  getDataEmitted(data: Users | null) {
    if (data) {
      console.log('nuevo registro: ');
      console.log(data);
      this.UserService.signUpNewUser(data).subscribe({
        next: (response) => {
          console.log('Usuario registrado:', response);
          this.registerModal.dismiss();
          this.openModalFunc('Utilize sus credenciales para iniciar sesión');
        },
        error: (err) => {
          console.log(err);
          this.openModalFunc('Error al Registrarse, por favor intente nuevamente');
        }
      });
      this.registerModal.dismiss();
    } else {
      return;
    }
  }

}
